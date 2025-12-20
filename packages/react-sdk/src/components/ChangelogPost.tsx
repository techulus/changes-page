import type { ChangelogPostProps, ChangelogPostRenderProps } from "../types";

export function ChangelogPost({ post, children }: ChangelogPostProps) {
  const renderProps: ChangelogPostRenderProps = {
    id: post.id,
    title: post.title,
    content: post.content,
    plainText: post.plain_text_content,
    tags: post.tags,
    publicationDate: post.publication_date,
    url: post.url,
  };

  return <>{children(renderProps)}</>;
}
