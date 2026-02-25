import { getToken } from "../utils/config";
import { api } from "./api";

export async function createHealthCheck(payload: {
  url: string;
  interval_sec: number;
  slack_webhook?: string;
  email?: string;
  whatsapp?: string;
}) {
  const token = getToken();
  if (!token) {
    console.error("✖ Authentication required. Run `apihealthz login`");
    process.exit(1);
  }

  const body = {
    url: payload.url,
    interval_sec: payload.interval_sec,
    slack_webhook: payload.slack_webhook,
    email: payload.email,
    whatsapp: payload.whatsapp,
  };

  const response = await api.post("/checks", body);
  return response.data;
}
