# @changespage/core

Framework-agnostic JavaScript SDK for changes.page.

## Installation

```bash
npm install @changespage/core
```

## Usage

```ts
import { createChangesPageClient } from '@changespage/core';

const client = createChangesPageClient({
  baseUrl: 'https://yourpage.changes.page'
});

const { posts, totalCount, hasMore } = await client.getPosts({ limit: 10 });

const latestPost = await client.getLatestPost();

const pinnedPost = await client.getPinnedPost();
```

## API

### `createChangesPageClient(config)`

| Option | Type | Description |
|--------|------|-------------|
| `baseUrl` | `string` | Your changes.page URL |

### `client.getPosts(options?)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `limit` | `number` | 10 | Posts per page (max 50) |
| `offset` | `number` | 0 | Pagination offset |

Returns `{ posts, totalCount, hasMore }`

### `client.getLatestPost()`

Returns the most recent post or `null`.

### `client.getPinnedPost()`

Returns the pinned post or `null` if none is pinned.

## Utilities

### `getTagLabel(tag)`

Returns a display label for a post tag.

```ts
import { getTagLabel } from '@changespage/core';

getTagLabel('new'); // "New"
getTagLabel('fix'); // "Fix"
```

## Types

```ts
type PostTag = 'fix' | 'new' | 'improvement' | 'announcement' | 'alert';

interface Post {
  id: string;
  title: string;
  content: string;
  tags: PostTag[];
  publication_date: string | null;
  updated_at: string;
  created_at: string;
  url: string;
  plain_text_content: string;
}
```
