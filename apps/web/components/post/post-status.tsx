import classNames from "classnames";
import { PostStatus, PostStatusToLabel } from "../../data/page.interface";

const Draft = ({ className }: { className?: string }) => (
  <span
    className={classNames(
      "inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      className
    )}
  >
    {PostStatusToLabel[PostStatus.draft]}
  </span>
);

const PublishLater = ({ className }: { className?: string }) => (
  <span
    className={classNames(
      "inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-green-800 dark:bg-gray-800 dark:text-green-200",
      className
    )}
  >
    {PostStatusToLabel[PostStatus.publish_later]}
  </span>
);

const Published = ({ className }: { className?: string }) => (
  <span
    className={classNames(
      "inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200",
      className
    )}
  >
    {PostStatusToLabel[PostStatus.published]}
  </span>
);

const PostStatusToBadge = {
  [PostStatus.draft]: Draft,
  [PostStatus.publish_later]: PublishLater,
  [PostStatus.published]: Published,
};

export default PostStatusToBadge;
