import classNames from "classnames";
import { PostType, PostTypeToLabel } from "../../data/page.interface";
import { PinnedIcon } from "../core/icons.component";

const Alert = ({ className }: { className?: string }) => (
  <div
    className={classNames(
      "inline-flex items-center whitespace-nowrap rounded-md py-1 px-2 text-sm font-medium",
      "bg-red-400/10 text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-400/30 text-xs",
      className
    )}
  >
    <span className="runcate">{PostTypeToLabel[PostType.alert]}</span>
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
    <span className={"truncate"}>{PostTypeToLabel[PostType.new]}</span>
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
    <span className={"truncate"}>{PostTypeToLabel[PostType.improvement]}</span>
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
    <span className="truncate">{PostTypeToLabel[PostType.fix]}</span>
  </div>
);

const Announcement = ({ className }: { className?: string }) => (
  <div
    className={classNames(
      "inline-flex items-center whitespace-nowrap rounded-md py-1 px-2 text-sm font-medium",
      "bg-gray-400/10 text-gray-600 dark:text-gray-400 ring-1 ring-inset ring-gray-400/20 text-xs",
      className
    )}
  >
    <span className={"truncate"}>{PostTypeToLabel[PostType.announcement]}</span>
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
    <PinnedIcon />
    <span className={"truncate ml-1"}>Pinned</span>
  </div>
);

const PostTypeToBadge = {
  [PostType.fix]: Fix,
  [PostType.new]: New,
  [PostType.improvement]: Improvement,
  [PostType.announcement]: Announcement,
  [PostType.alert]: Alert,
  pinned: Pinned,
};

export default PostTypeToBadge;
