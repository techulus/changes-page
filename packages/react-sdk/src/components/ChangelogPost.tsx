import type { ChangelogPostProps, ChangelogPostRenderProps } from "../types";
import { formatDate, parseDate } from "../utils";

export function ChangelogPost({ post, children }: ChangelogPostProps) {
  const renderProps: ChangelogPostRenderProps = {
    id: post.id,
    title: post.title,
    content: post.content,
    plainText: post.plain_text_content,
    tags: post.tags,
    date: parseDate(post.publication_date),
    formattedDate: formatDate(post.publication_date),
    url: post.url,
  };

  return <>{children(renderProps)}</>;
}
