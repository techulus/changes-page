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
          {({ title, content, tags, publicationDate, url }) => (
            <article>
              <h2>{title}</h2>
              {publicationDate && <time>{new Date(publicationDate).toLocaleDateString()}</time>}
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

- `id`, `title`, `content` (markdown), `plainText`, `tags`, `publicationDate`, `url`

## Hook

### `usePosts`

```tsx
import { usePosts } from '@changespage/react';

function ChangelogList() {
  const { posts, hasMore, loading, error, loadMore, refetch } = usePosts({
    client,
    limit: 10,
  });

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
        <button onClick={refetch}>Try again</button>
      </div>
    );
  }

  if (loading && posts.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>{post.title}</article>
      ))}
      {hasMore && (
        <button onClick={loadMore} disabled={loading}>
          {loading ? 'Loading...' : 'Load more'}
        </button>
      )}
    </div>
  );
}
```

For SSR, pass initial data to skip the client-side fetch:

```tsx
const { posts, hasMore, loading, error, loadMore, refetch } = usePosts({
  client,
  initialData: { posts: serverPosts, hasMore: serverHasMore },
  limit: 10,
});
```
