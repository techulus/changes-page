import { useState } from "react";

declare global {
  interface Date {
    toNiceFormat(): string;
    toRelative(): string;
  }
}

Date.prototype.toNiceFormat = function () {
  return this.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

Date.prototype.toRelative = function () {
  const seconds = Math.floor(
    (new Date().getTime() - this.date.getTime()) / 1000
  );
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
};

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
        ? new Date(publishedAt).toNiceFormat()
        : new Date(publishedAt).toRelative()}
    </time>
  );
}
