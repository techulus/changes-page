import { useState } from "react";

function toRelative(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) {
    return interval + " years ago";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months ago";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days ago";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours ago";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}

export function PostDateTime({
  publishedAt,
  startWithFullDate = false,
}: {
  publishedAt: string;
  startWithFullDate?: boolean;
}) {
  const [showFullDate, setShowFullDate] = useState(startWithFullDate);

  return (
    <time
      className="cursor-help"
      onClick={() => {
        setShowFullDate(!showFullDate);
      }}
      dateTime={publishedAt}
      suppressHydrationWarning
    >
      {showFullDate
        ? new Date(publishedAt).toLocaleString([], {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })
        : toRelative(new Date(publishedAt))}
    </time>
  );
}
