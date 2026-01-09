import { confirm, input } from "@inquirer/prompts";
import { getToken } from "../utils/config";
import { api } from "../services/api";

export async function del() {
  const token = getToken();

  if (!token) {
    console.error("✖ Authentication required. Run `apihealthz login`");
    process.exit(1);
  }

  try {
    const id = await input({
      message: "Enter the ID of the health check to delete:",
    });

    const proceed = await confirm({
      message: `Delete check ${id}?`,
      default: true,
    });

    if (!proceed) {
      console.log("Cancelled");
      process.exit(0);
    }

    try {
      await api.delete(`/checks/${id}`);
      console.log("✔ Health check deleted successfully");
      process.exit(0);
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
