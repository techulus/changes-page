import { PostStatus } from "@changes-page/supabase/types/page";
import { CheckIcon, ClockIcon, PencilIcon } from "@heroicons/react/solid";

export const PostStatusToIcon = {
  [PostStatus.draft]: PencilIcon,
  [PostStatus.publish_later]: ClockIcon,
  [PostStatus.published]: CheckIcon,
};

export const PostStatusIcon = ({ status, className }) => {
  const IconComponent = PostStatusToIcon[status];
  return <IconComponent className={className} />;
};
