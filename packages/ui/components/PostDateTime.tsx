import { DateTime } from "@changes-page/utils";
import { useState } from "react";

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
        ? DateTime.fromISO(publishedAt).toNiceFormat()
        : DateTime.fromISO(publishedAt).toRelative()}
    </time>
  );
}
