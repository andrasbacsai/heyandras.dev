---
title: Building a Static Site Generator with Bun
time: 2026-02-03T12:00:00Z
topic: bun, typescript
ogimage: https://coolcdn.b-cdn.net/assets/blog/bun-ssg.jpeg
rssdescription: Learn how to build a minimal static site generator using Bun's built-in features - no frameworks, no build tools, just Bun.

---
# Building a Static Site Generator with Bun

No frameworks. No bundlers. No config files. Just Bun and ~300 lines of TypeScript.

This blog runs on a static site generator I built in about 30 minutes. It converts Markdown files to HTML, generates an RSS feed, and serves everything with a built-in dev server. Here's how it works.

## Why Bun?

Bun is a JavaScript runtime that replaces Node.js, npm, and your bundler in one tool. For small projects like this, it's perfect because:

- **Direct TypeScript execution** - no compilation step, no tsconfig tweaks
- **Built-in HTTP server** - `Bun.serve()` replaces Express/Fastify
- **Built-in file watcher** - `bun run --watch` replaces nodemon
- **Fast** - cold starts in milliseconds

## Project Setup

```bash
bun init
```

That's it. Here's the entire `package.json`:

```json
{
  "name": "blog",
  "type": "module",
  "scripts": {
    "build": "bun run index.ts",
    "dev": "bun run --watch index.ts",
    "serve": "bun run index.ts --serve"
  },
  "devDependencies": {
    "@types/bun": "latest",
    "typescript": "^5.8.3"
  }
}
```

No webpack. No vite. No esbuild config. Bun runs TypeScript directly.

## The Core: Markdown to HTML

### YAML Front Matter

Each post starts with metadata:

```markdown
---
title: My Post Title
time: 2026-02-03T12:00:00Z
topic: bun, typescript
---
# My Post Title

Content goes here...
```

Parsing it is simple:

```typescript
function parseFrontMatter(md: string) {
  const match = md.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { meta: {}, body: md };

  const meta: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) meta[key.trim()] = rest.join(':').trim();
  }
  return { meta, body: md.slice(match[0].length) };
}
```

### Markdown Converter

I could use a library like `marked` or `remark`, but for a simple blog, regex works fine:

```typescript
function mdToHtml(md: string): string {
  return md
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/gim, '<b>$1</b>')
    .replace(/\*(.*?)\*/gim, '<i>$1</i>')
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
    .replace(/^> (.*$)/gim, '<blockquote><i>$1</i></blockquote>')
    .replace(/^[-*] (.*$)/gim, '<li>$1</li>')
    .replace(/\n{2,}/g, '</p><p>');
}
```

Is it perfect? No. Does it handle everything I need? Yes. Ship it.

## Bun-Specific Features

### The Dev Server

Here's the entire HTTP server:

```typescript
function serve() {
  Bun.serve({
    port: 3000,
    async fetch(req) {
      const url = new URL(req.url);
      let filePath = join(process.cwd(), 'dist', url.pathname);

      try {
        const fileStat = await stat(filePath);
        if (fileStat.isFile()) {
          return new Response(Bun.file(filePath));
        }
      } catch { }

      return new Response('Not found', { status: 404 });
    },
  });
}
```

That's 15 lines to serve static files. Compare that to setting up Express with `express.static()` and error handlers.

`Bun.file()` returns a lazy file reference that streams efficiently - no need to read the whole file into memory.

### File Watching for Dev Mode

```typescript
import { watch } from 'fs';

watch(postsDir, { recursive: true }, async (eventType, filename) => {
  if (filename && (eventType === 'change' || eventType === 'rename')) {
    console.log(`[dev] Detected change: ${filename}`);
    await generate();
  }
});
```

Combined with `bun run --watch`, you get instant rebuilds when editing posts.

## Generating the Site

The `generate()` function:

1. Reads all `.md` files from `posts/`
2. Parses front matter and converts Markdown to HTML
3. Wraps content in an HTML template with meta tags
4. Generates an RSS feed
5. Creates an index page listing all posts

```typescript
async function generate() {
  const postsDir = join(process.cwd(), 'posts');
  const distDir = join(process.cwd(), 'dist');

  let files = await readdir(postsDir);
  files = files.filter(f => extname(f) === '.md');

  // Process each post...
  for (const post of posts) {
    const html = `<!DOCTYPE html>
      <html>
        <head>
          <title>${post.title}</title>
          <!-- OG tags, styles... -->
        </head>
        <body>
          ${mdToHtml(post.content)}
        </body>
      </html>`;

    await writeFile(outPath, html, 'utf8');
  }
}
```

## What You Don't Need

With Bun, I didn't install:

- Express, Fastify, or any HTTP framework
- nodemon or any file watcher
- webpack, vite, esbuild, or any bundler
- ts-node or any TypeScript runner
- A markdown library (for this simple use case)

Total runtime dependencies: **0**

## The Full Picture

```
posts/
  my-post.md
  another-post.md
index.ts          # ~300 lines, does everything
package.json      # 15 lines
```

Run `bun run build` and you get a `dist/` folder with static HTML files ready to deploy anywhere.

## Try It

If you're building something small - a blog, a landing page, a quick tool - give Bun a shot. The reduced tooling overhead is refreshing.

The full source for this blog is on <a href="https://github.com/andrasbacsai/heyandras.dev">GitHub</a>.
