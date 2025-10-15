const formatShowtime = (
  timestamp: string | Date,
  opts: { showDate?: boolean; showTime?: boolean } = {
    showDate: true,
    showTime: true,
  }
) => {
  try {
    const date = new Date(timestamp);

    const parts: string[] = [];

    if (opts.showDate) {
      parts.push(
        date.toLocaleDateString("en-US", {
          month: "numeric",
          day: "numeric",
        })
      );
    }

    if (opts.showTime) {
      parts.push(
        date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }

    return parts.join(" ");
  } catch {
    return "Invalid time";
  }
};

export default formatShowtime;
