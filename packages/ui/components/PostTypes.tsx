import classNames from "classnames";

type PostType = "fix" | "new" | "improvement" | "announcement" | "alert";

const Alert = ({ className }: { className?: string }) => (
  <div
    className={classNames(
      "inline-flex items-center whitespace-nowrap rounded-md py-1 px-2 text-sm font-medium",
      "bg-red-400/10 text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-400/30 text-xs",
      className
    )}
  >
    <span>Alert</span>
  </div>
);

const New = ({ className }: { className?: string }) => (
  <div
    className={classNames(
      "inline-flex items-center whitespace-nowrap rounded-md py-1 px-2 text-sm font-medium",
      "bg-green-500/10 text-green-700 dark:text-green-500 ring-1 ring-inset ring-green-500/30 text-xs",
      className
    )}
  >
    <span>New</span>
  </div>
);

const Improvement = ({ className }: { className?: string }) => (
  <div
    className={classNames(
      "inline-flex items-center whitespace-nowrap rounded-md py-1 px-2 text-sm font-medium",
      "bg-blue-500/10 text-blue-700 dark:text-blue-500 ring-1 ring-inset ring-blue-500/30 text-xs",
      className
    )}
  >
    <span>Improvement</span>
  </div>
);

const Fix = ({ className }: { className?: string }) => (
  <div
    className={classNames(
      "inline-flex items-center whitespace-nowrap rounded-md py-1 px-2 text-sm font-medium",
      "bg-purple-400/10 text-purple-700 dark:text-purple-400 ring-1 ring-inset ring-purple-400/30 text-xs",
      className
    )}
  >
    <span className="truncate">Fixes</span>
  </div>
);

const Announcement = ({ className }: { className?: string }) => (
  <div
    className={classNames(
      "inline-flex items-center whitespace-nowrap rounded-md py-1 px-2 text-sm font-medium",
      "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 ring-1 ring-inset ring-gray-400/20 text-xs",
      className
    )}
  >
    <span className={"truncate"}>Announcement</span>
  </div>
);

const Pinned = ({ className }: { className?: string }) => (
  <div
    className={classNames(
      "inline-flex items-center whitespace-nowrap rounded-md py-1 px-2 text-sm font-medium",
      "bg-gray-400/10 text-gray-600 dark:text-gray-400 ring-1 ring-inset ring-gray-400/20 text-xs",
      className
    )}
  >
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={classNames("w-3 h-3 text-red-500", "-rotate-12")}
    >
      <g>
        <path
          fill="currentColor"
          d="M7 4.5C7 3.12 8.12 2 9.5 2h5C15.88 2 17 3.12 17 4.5v5.26L20.12 16H13v5l-1 2-1-2v-5H3.88L7 9.76V4.5z"
        ></path>
      </g>
    </svg>
    <span className={"truncate ml-1"}>Pinned</span>
  </div>
);

export function PostTypeBadge({
  type,
  className,
}: {
  type: PostType | "pinned";
  className?: string;
}) {
  if (type === "pinned") {
    return <Pinned className={className} />;
  }
  if (type === "alert") {
    return <Alert className={className} />;
  }
  if (type === "new") {
    return <New className={className} />;
  }
  if (type === "improvement") {
    return <Improvement className={className} />;
  }
  if (type === "fix") {
    return <Fix className={className} />;
  }
  if (type === "announcement") {
    return <Announcement className={className} />;
  }

  return null;
}
