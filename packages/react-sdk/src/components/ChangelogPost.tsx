import { formatDate, parseDate } from "@changespage/core";
import type { ChangelogPostProps, ChangelogPostRenderProps } from "../types";

export function ChangelogPost({ post, locale, children }: ChangelogPostProps) {
  const renderProps: ChangelogPostRenderProps = {
    id: post.id,
    title: post.title,
    content: post.content,
    plainText: post.plain_text_content,
    tags: post.tags,
    date: parseDate(post.publication_date),
    formattedDate: formatDate(post.publication_date, locale),
    url: post.url,
  };

  return <>{children(renderProps)}</>;
}
