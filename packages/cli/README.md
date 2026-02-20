# @changespage/cli

CLI for [changes.page](https://changes.page) — manage posts from the terminal.

## Install

```bash
npm install -g @changespage/cli
```

## Setup

```bash
chp configure
```

You'll be prompted to enter your page secret key. Find it in your page settings under **Integrations**.

Alternatively, use the `CHANGESPAGE_SECRET_KEY` environment variable or `--secret-key` flag.

## Usage

### List posts

```bash
chp posts list
chp posts list --status published --limit 5
```

### Get a post

```bash
chp posts get <id>
```

### Create a post

Content is read from stdin:

```bash
echo "Release notes here" | chp posts create --title "v2.0" --tags new,fix --status draft
```

Or from a file:

```bash
chp posts create --title "v2.0" --tags new,fix --status published < content.md
```

### Update a post

```bash
echo "Updated content" | chp posts update <id> --title "v2.1" --tags improvement
```

Update metadata only (no stdin pipe):

```bash
chp posts update <id> --status published
```

### Delete a post

```bash
chp posts delete <id>
```

## Options

| Flag | Description |
|---|---|
| `--secret-key <key>` | Page secret key |
| `--pretty` | Pretty-print JSON output |

### Create / Update options

| Flag | Description |
|---|---|
| `--title <title>` | Post title (required for create) |
| `--tags <tags>` | Comma-separated tags: `new`, `fix`, `improvement`, `announcement`, `alert` |
| `--status <status>` | `draft`, `published`, `archived` (default: `draft`) |
| `--publish-at <date>` | ISO date for scheduled publish |
| `--allow-reactions` | Enable reactions |
| `--notes <notes>` | Internal notes |

## License

MIT
