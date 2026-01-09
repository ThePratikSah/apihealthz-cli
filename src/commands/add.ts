import { input, select, confirm } from "@inquirer/prompts";
import { getToken } from "../utils/config";
import { createHealthCheck } from "../services/apiHealth";

export async function add() {
  const token = getToken();

  if (!token) {
    console.error("✖ Authentication required. Run `apihealthz login`");
    process.exit(1);
  }

  try {
    const url = await input({
      message: "API URL to monitor:",
      validate: (v) =>
        v.startsWith("http://") || v.startsWith("https://")
          ? true
          : "Invalid URL",
    });

    const interval = await select({
      message: "Select check interval:",
      choices: [
        { name: "Every 5 minutes", value: 300 },
        { name: "Every 15 minutes", value: 900 },
        { name: "Every 30 minutes", value: 1800 },
        { name: "Every 1 hour", value: 3600 },
      ],
    });

    const intervalName =
      interval === 300
        ? "Every 5 minutes"
        : interval === 900
        ? "Every 15 minutes"
        : interval === 1800
        ? "Every 30 minutes"
        : interval === 3600
        ? "Every 1 hour"
        : `${interval} seconds`;

    const alertType = await select({
      message: "How do you want to receive alerts?",
      choices: [
        { name: "Slack", value: "slack" },
        { name: "Email", value: "email" },
        { name: "WhatsApp", value: "whatsapp" },
        { name: "None", value: null },
      ],
    });

    let slack_webhook;
    let email;

    if (alertType === "slack") {
      slack_webhook = await input({
        message: "Slack webhook URL:",
        validate: (v) =>
          v.startsWith("https://hooks.slack.com/")
            ? true
            : "Invalid Slack webhook URL",
      });
    }

    if (alertType === "email") {
      email = await input({
        message: "Email address:",
        validate: (v) => (v.includes("@") ? true : "Invalid email address"),
      });
    }

    // Show a preview summary before confirmation
    console.log("\n=== Health Check Preview ===");
    console.log(`URL:           ${url}`);
    console.log(`Interval:      ${intervalName}`);
    console.log(
      `Alert:         ${
        alertType === null
          ? "None"
          : alertType === "slack"
          ? "Slack"
          : alertType === "email"
          ? "Email"
          : "N/A"
      }`
    );
    if (slack_webhook) console.log(`Slack Webhook: ${slack_webhook}`);
    if (email) console.log(`Email:         ${email}`);
    console.log("===========================\n");

    const proceed = await confirm({
      message: "Create this health check?",
      default: true,
    });

    if (!proceed) {
      console.log("Cancelled");
      process.exit(0);
    }

    const payload = {
      url,
      interval_sec: interval,
      slack_webhook,
      email,
    };

    if (slack_webhook) payload.slack_webhook = slack_webhook;
    if (email) payload.email = email;

    try {
      process.stdout.write("⠋ Creating health check...\r");
      const response = await createHealthCheck({
        url,
        interval_sec: interval,
        slack_webhook,
        email,
      });
      console.log(`✔ Health check created successfully: ${response.id}`);
    } catch (err) {
      console.error(
        `✖ ${err instanceof Error ? err.message : "Unknown error"}`
      );
      process.exit(1);
    }
  } catch (err: any) {
    // Handle user cancellation (Ctrl+C)
    if (err?.name === "ExitPromptError" || err?.message?.includes("SIGINT")) {
      console.log("\nCancelled");
      process.exit(0);
    }
    // Re-throw other errors
    throw err;
  }
}
