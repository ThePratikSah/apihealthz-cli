import { api } from "../services/api";
import { formatDate } from "../services/timezone";
import { getToken } from "../utils/config";

export async function list() {
  const token = getToken();

  if (!token) {
    console.error("✖ Authentication required. Run `apihealthz login`");
    process.exit(1);
  }

  try {
    const response = await api.get("/checks");
    const data = response.data;

    if (!data || data.length === 0) {
      console.log("✖ No health checks found, add one with: `apihealthz add`");
      process.exit(0);
    }

    console.table(
      data.map((c: any) => ({
        ID: c.id,
        URL: c.url,
        Interval: `${c.interval_sec} seconds`,
        "Last Status":
          c.last_status === "UP"
            ? "✅ UP"
            : c.last_status === "DOWN"
            ? "❌ DOWN"
            : "N/A",
        "Last Checked": c.last_checked_at
          ? formatDate(c.last_checked_at)
          : "N/A",
      }))
    );
  } catch (err) {
    console.error(`✖ ${err instanceof Error ? err.message : "Unknown error"}`);
    process.exit(1);
  }
}
