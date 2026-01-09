import fs from "fs";
import path from "path";
import os from "os";

const CONFIG_DIR = path.join(os.homedir(), ".apihealthz");
const TOKEN_PATH = path.join(CONFIG_DIR, "token");

export function saveToken(token: string) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.writeFileSync(TOKEN_PATH, token, { mode: 0o600 });
}

export function getToken(): string | null {
  if (!fs.existsSync(TOKEN_PATH)) return null;
  return fs.readFileSync(TOKEN_PATH, "utf-8");
}

export function clearToken() {
  if (fs.existsSync(TOKEN_PATH)) fs.unlinkSync(TOKEN_PATH);
}
