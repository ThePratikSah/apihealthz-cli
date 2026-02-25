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
    const data = response?.data?.data;

    if (!data || data.length === 0) {
      console.log("✖ No health checks found, add one with: `apihealthz add`");
      process.exit(0);
    }

    console.table(
      data.map((c: any) => ({
        ID: c._id,
        URL: c.url,
        Interval:
          c.interval_sec === 60
            ? "Every 1 minute (Premium)"
            : c.interval_sec === 300
              ? "Every 5 minutes"
              : c.interval_sec === 900
                ? "Every 15 minutes"
                : c.interval_sec === 1800
                  ? "Every 30 minutes"
                  : c.interval_sec === 3600
                    ? "Every 1 hour"
                    : `${c.interval_sec} seconds`,
        "Last Status":
          c.last_status === "UP"
            ? "✅ UP"
            : c.last_status === "DOWN"
              ? "❌ DOWN"
              : "N/A",
        "Last Checked": c.last_checked_at
          ? formatDate(c.last_checked_at)
          : "N/A",
      })),
    );
  } catch (err) {
    console.error(`✖ ${err instanceof Error ? err.message : "Unknown error"}`);
    process.exit(1);
  }
}
