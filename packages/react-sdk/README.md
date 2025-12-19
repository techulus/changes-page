# @changespage/react

Embed your changelog in any React app.

## Installation

```bash
npm install @changespage/react
```

## Usage

```tsx
import { createChangesPageClient, ChangelogPost } from '@changespage/react';
import ReactMarkdown from 'react-markdown';

const client = createChangesPageClient({
  baseUrl: 'https://yourpage.changes.page'
});

export default async function ChangelogPage() {
  const { posts, hasMore } = await client.getPosts({ limit: 10 });

  return (
    <div>
      {posts.map(post => (
        <ChangelogPost key={post.id} post={post}>
          {({ title, content, tags, formattedDate, url }) => (
            <article>
              <h2>{title}</h2>
              <time>{formattedDate}</time>
              <div>{tags.map(t => <span key={t}>{t}</span>)}</div>
              <ReactMarkdown>{content}</ReactMarkdown>
            </article>
          )}
        </ChangelogPost>
      ))}
    </div>
  );
}
```

## API

### `createChangesPageClient(config)`

| Option | Type | Description |
|--------|------|-------------|
| `baseUrl` | `string` | Your changes-page URL |

### `client.getPosts(options?)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `limit` | `number` | 10 | Posts per page (max 50) |
| `offset` | `number` | 0 | Pagination offset |

Returns `{ posts, totalCount, hasMore }`

### `client.getLatestPost()`

Returns the most recent post or `null`.

### `<ChangelogPost>`

Render prop component exposing:

- `id`, `title`, `content` (markdown), `plainText`, `tags`, `date`, `formattedDate`, `url`

## Hook

### `usePosts`

```tsx
import { usePosts } from '@changespage/react';

// Client-only (fetches on mount)
const { posts, hasMore, loading, loadMore } = usePosts({ client, limit: 10 });

// With SSR initial data (skips initial fetch)
const { posts, hasMore, loading, loadMore } = usePosts({
  client,
  initialData: { posts: initialPosts, hasMore: initialHasMore },
  limit: 10,
});
```
