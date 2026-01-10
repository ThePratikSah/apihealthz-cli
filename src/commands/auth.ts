import { Command } from "commander";
import { authStatus, loginWithProvider, logout } from "../services/auth";

export const authCommand = new Command("auth").description(
  "Authentication commands"
);

authCommand
  .command("login")
  .description("Login to ApiHealthz")
  .option("-p, --provider <provider>", "google")
  .action(async (options) => {
    await loginWithProvider(options.provider);
  });

authCommand
  .command("logout")
  .description("Logout from ApiHealthz")
  .action(async () => {
    await logout();
  });

authCommand
  .command("status")
  .description("Show auth status")
  .action(async () => {
    await authStatus();
  });
