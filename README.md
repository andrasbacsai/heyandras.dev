# Minimal Bun Blog Generator tes

This is a super minimal static blog generator built with Bun. It:

- Converts Markdown files in the `posts/` directory to HTML at build time
- Renders a simple HTML5 index page with the latest post on top and a list of previous posts
- No CSS, no styling, just semantic HTML (h1, h2, etc.)

## Usage

1. Add your `.md` files to the `posts/` directory.
2. Run `bun run index.ts` to generate the static site in the `dist/` folder.
3. Open `dist/index.html` in your browser.

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.4. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

Nothing to see here.
