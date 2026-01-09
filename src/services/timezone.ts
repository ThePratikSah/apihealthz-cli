// Get user's timezone
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

// Format date in user's timezone
const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(date);
  } catch {
    return dateString;
  }
};

export { timezone, formatDate };
