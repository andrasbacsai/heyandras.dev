import { readdir, mkdir, readFile, writeFile, stat, unlink } from 'fs/promises';
import { join, basename, extname } from 'path';
import { watch } from 'fs';
import Bun from 'bun';

const BASE_URL = 'https://heyandras.dev'
const OG_TYPE = 'website';
const OG_IMAGE = 'https://coolcdn.b-cdn.net/assets/links.jpg';
const OG_TITLE = 'Andras Bacsai\'s Blog';
const OG_DESCRIPTION = 'Working on the next-gen of Coolify and sharing my journey...';
const OG_SITE_NAME = 'Andras Bacsai';
const TWITTER_SITE = '@heyandras';

// Parse YAML front matter (very basic)
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

// Minimal Markdown to HTML converter (headings, paragraphs, links, code)
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
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/^(?!<h\d|<li|<blockquote|<p|<ul|<ol|<code|<pre|<b|<i|<a|<img|<hr|<br)(.+)$/gim, '<p>$1</p>');
}

// Social media footer HTML
const footerHtml = `\n<footer><a href=\"https://x.com/heyandras\">Twitter/X</a> | <a href=\"https://bsky.app/profile/heyandras.dev\">Bluesky</a> | <a href=\"https://twitch.tv/heyandras\">Twitch</a> | <a href=\"https://youtube.com/@heyandras\">Youtube</a> | <a href=\"/rss.xml\">RSS</a></footer>\n`;

const metaHtml = `\n<meta charset='utf-8'>\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n `;

const analyticsHtml = `\n<script defer data-domain="heyandras.dev" src="https://analytics.coollabs.io/js/script.js"></script>\n`;

async function generate() {
  const postsDir = join(process.cwd(), 'posts');
  const distDir = join(process.cwd(), 'dist');

  try { await mkdir(distDir); } catch { }

  let files = await readdir(postsDir);
  files = files.filter(f => extname(f) === '.md');

  // Read all posts and their stats
  const posts = await Promise.all(files.map(async file => {
    const filePath = join(postsDir, file);
    const raw = await readFile(filePath, 'utf8');
    const stats = await stat(filePath);
    const { meta, body } = parseFrontMatter(raw);
    // Parse topics: comma-separated or single value
    let topics: string[] = [];
    if (meta.topic) {
      topics = meta.topic.split(',').map(t => t.trim()).filter(Boolean);
    }
    return {
      file,
      title: meta.title || body.match(/^# (.*)$/m)?.[1] || basename(file, '.md'),
      content: body,
      meta,
      topics,
      time: meta.time || stats.mtime.toISOString(),
      mtime: stats.mtime,
    };
  }));

  // Collect all unique topics
  const allTopics = Array.from(new Set(posts.flatMap(post => post.topics))).filter(Boolean);

  // Sort by meta.time (if present) or mtime descending (latest first)
  posts.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  const distPostsDir = join(distDir, 'posts');
  try { await mkdir(distPostsDir); } catch { }

  // Generate per-post HTML files
  for (const post of posts) {
    // Prepare OG/Twitter meta tags
    const twitterSite = TWITTER_SITE;
    const ogType = OG_TYPE;
    const ogSiteName = OG_SITE_NAME;
    const ogTitle = post.title || OG_TITLE;
    const ogDescription = post.meta.description || OG_DESCRIPTION;
    const ogImage = post.meta.ogimage || OG_IMAGE;
    const postUrl = `${BASE_URL}/posts/${post.file.replace('.md', '.html')}`;
    const ogMeta = `
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:site" content="${twitterSite}">
      <meta name="twitter:title" content="${ogTitle}">
      <meta name="twitter:description" content="${ogDescription}">
      <meta name="twitter:image" content="${ogImage}">
      <meta property="og:type" content="${ogType}">
      <meta property="og:url" content="${postUrl}">
      <meta property="og:title" content="${ogTitle}">
      <meta property="og:description" content="${ogDescription}">
      <meta property="og:site_name" content="${ogSiteName}">
      <meta property="og:image" content="${ogImage}">
    `;
    const html = `<!DOCTYPE html><html><head>${metaHtml}${analyticsHtml}${ogMeta}<title>${post.title}</title><style>
html,body{height:100%;margin:0;}
body{min-height:100vh;display:flex;flex-direction:column;font-size:110%;}
main{flex:1 0 auto; padding-left: 25%; padding-right: 25%;}
h1{font-size:2.2em;margin-top:1.2em;margin-bottom:0.6em;}
h2{font-size:1.5em;margin-top:1em;margin-bottom:0.5em;}
h3{font-size:1.2em;margin-top:0.8em;margin-bottom:0.4em;}
blockquote{background:#f5f5f5;padding:0.8em 1.2em;border-radius:6px;margin:1em 0;font-style:italic;color:#444;}
footer{flex-shrink:0;text-align:center;padding:1em 0;}
@media (max-width:1200px){main{padding-left:15%;padding-right:15%;}}
@media (max-width:900px){main{padding-left:5%;padding-right:5%;}}
@media (max-width:600px){main{padding-left:10px;padding-right:10px;}}
</style></head><body><main><article>${mdToHtml(post.content)}<p><a href='../index.html'>&larr; Back to index</a></p></article></main>${footerHtml}</body></html>`;
    const outPath = join(distPostsDir, post.file.replace('.md', '.html'));
    await writeFile(outPath, html, 'utf8');
  }

  // Delete orphaned HTML files in /dist/posts
  const distHtmlFiles = (await readdir(distPostsDir)).filter(f => f.endsWith('.html'));
  const validHtmlFiles = new Set(posts.map(post => post.file.replace('.md', '.html')));
  for (const file of distHtmlFiles) {
    if (!validHtmlFiles.has(file)) {
      await unlink(join(distPostsDir, file));
    }
  }

  // Generate RSS feed
  const rssItems = posts.map(post => {
    const postUrl = `posts/${post.file.replace('.md', '.html')}`;
    // Use meta.description or meta.rssdescription if available, else fallback
    let desc = post.meta.description || post.meta.rssdescription;
    if (!desc) {
      desc = post.content.split(/\n\n|\r\n\r\n/)[0].replace(/^# .+/, '').trim();
      if (!desc) desc = post.content.slice(0, 100);
    }
    return `<item>
      <title><![CDATA[${post.title}]]></title>
      <link>{{BASE_URL}}/${postUrl}</link>
      <guid>{{BASE_URL}}/${postUrl}</guid>
      <description><![CDATA[${desc}]]></description>
      <pubDate>${new Date(post.time).toUTCString()}</pubDate>
    </item>`;
  }).join('\n');
  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Andras Bacsai's Blog</title>
  <link>{{BASE_URL}}/</link>
  <description>Blog by Andras Bacsai</description>
  <language>en</language>
  <atom:link href="{{BASE_URL}}/rss.xml" rel="self" type="application/rss+xml" />
  ${rssItems}
</channel>
</rss>`;
  await writeFile(join(distDir, 'rss.xml'), rssXml.replace(/\{\{BASE_URL\}\}/g, BASE_URL), 'utf8');

  // Generate index.html
  const latest = posts[0];
  const others = posts.slice(1);
  // Helper to render topics as clickable links
  function renderTopics(topics: string[]) {
    return topics.map(t => `<a href="#" class="topic-link" data-topic="${t}">${t}</a>`).join(', ');
  }
  // Only show topics section if there are more than one unique topic
  const showTopicsSection = allTopics.length > 1;
  // Only show previous posts section if there are any
  const showPreviousPosts = others.length > 0;
  const indexHtml = `<!DOCTYPE html><html><head>${metaHtml}${analyticsHtml}<title>Andras's Blog</title><style>
html,body{height:100%;margin:0;}
body{min-height:100vh;display:flex;flex-direction:column;font-size:110%;}
main{flex:1 0 auto; padding-left: 25%; padding-right: 25%;}
h1{font-size:2.2em;margin-top:1.2em;margin-bottom:0.6em;}
h2{font-size:1.5em;margin-top:1em;margin-bottom:0.5em;}
h3{font-size:1.2em;margin-top:0.8em;margin-bottom:0.4em;}
blockquote{background:#f5f5f5;padding:0.8em 1.2em;border-radius:6px;margin:1em 0;font-style:italic;color:#444;}
footer{flex-shrink:0;text-align:center;padding:1em 0;}
@media (max-width:1200px){main{padding-left:15%;padding-right:15%;}}
@media (max-width:900px){main{padding-left:5%;padding-right:5%;}}
@media (max-width:600px){main{padding-left:10px;padding-right:10px;}}
</style></head><body><main>
    <h1>Hey, I'm <a href="https://x.com/heyandras">Andras Bacsai</a>
      <a href="/rss.xml" style="font-size: 0.5em; font-weight: normal; margin-left: 1em;" target="_blank" rel="noopener">
      RSS
      </a>
    </h1>
    <p>I am the founder of <a href="https://coolify.io" target="_blank">Coolify</a>, a popular open-source & self-hostable Heroku / Netlify / Vercel alternative.</p>
    <p>And this is my blog...</p>

    <hr>
    ${showTopicsSection ? `<section><b>Topics:</b> ${renderTopics(allTopics)} <a href="#" id="show-all" style="display:none; margin-left:1em;">Show all</a></section>` : ''}
    <h3><a href='posts/${latest.file.replace('.md', '.html')}'>${latest.title}</a>${latest.topics.length > 1 ? ' <small>(' + renderTopics(latest.topics) + ')</small>' : ''} <time style="font-size: 0.6em; font-weight: normal;" datetime='${latest.meta.time || latest.mtime.toISOString()}'></time></h3>
    ${showPreviousPosts ? `
    <ul id="posts-list" style="list-style-type: none; padding-left: 0;">
      ${others.map(post => `<li data-topics="${post.topics.join(',')}" style="margin-bottom: 0.3em;"><a href='posts/${post.file.replace('.md', '.html')}'>${post.title}</a>${post.topics.length > 1 ? ' <small>(' + renderTopics(post.topics) + ')</small>' : ''} <time datetime='${post.meta.time || post.mtime.toISOString()}'></time></li>`).join('\n')}
    </ul>` : ''}
    <script>
      // Relative time for <time>
      function relativeTime(date) {
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);
        if (diff < 60) return 'just now';
        if (diff < 3600) return Math.floor(diff/60) + ' minute' + (Math.floor(diff/60) === 1 ? '' : 's') + ' ago';
        if (diff < 86400) return Math.floor(diff/3600) + ' hour' + (Math.floor(diff/3600) === 1 ? '' : 's') + ' ago';
        if (diff < 2592000) {
          const days = Math.floor(diff/86400);
          const hours = Math.floor((diff%86400)/3600);
          let str = days + ' day' + (days === 1 ? '' : 's');
          if (hours > 0) str += ' and ' + hours + ' hour' + (hours === 1 ? '' : 's');
          return str + ' ago';
        }
        return date.toLocaleDateString();
      }
      for (const t of document.querySelectorAll('time')) {
        const d = new Date(t.getAttribute('datetime'));
        if (!isNaN(d)) {
          t.textContent = relativeTime(d);
          t.title = d.toLocaleString();
        }
      }
      // Topic filtering
      const topicLinks = document.querySelectorAll('.topic-link');
      const postsList = document.getElementById('posts-list');
      const showAll = document.getElementById('show-all');
      function filterByTopic(topic) {
        for (const li of postsList?.children || []) {
          const topics = li.getAttribute('data-topics');
          li.style.display = topics && topics.split(',').includes(topic) ? '' : 'none';
        }
        if (showAll) showAll.style.display = '';
      }
      for (const link of topicLinks) {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          filterByTopic(this.getAttribute('data-topic'));
        });
      }
      if (showAll) showAll.addEventListener('click', function(e) {
        e.preventDefault();
        for (const li of postsList?.children || []) li.style.display = '';
        showAll.style.display = 'none';
      });
    </script>
  </main>${footerHtml}</body></html>`;
  await writeFile(join(distDir, 'index.html'), indexHtml, 'utf8');

  console.log('Blog generated to dist folder.');
}

// Dev mode: serve and watch
async function dev() {
  const postsDir = join(process.cwd(), 'posts');
  let building = false;
  let pending = false;
  async function triggerBuild() {
    if (building) {
      pending = true;
      return;
    }
    building = true;
    await generate();
    building = false;
    if (pending) {
      pending = false;
      await triggerBuild();
    }
  }
  await triggerBuild();
  watch(postsDir, { recursive: true }, async (eventType, filename) => {
    if (filename && (eventType === 'change' || eventType === 'rename')) {
      console.log(`[dev] Detected change: ${filename}`);
      await triggerBuild();
    }
  });
  serve();
  console.log('[dev] Serving on http://localhost:3000');
}

function serve() {
  Bun.serve({
    port: 3000,
    async fetch(req) {
      const url = new URL(req.url);
      let filePath = join(process.cwd(), 'dist', url.pathname === '/' ? '/index.html' : url.pathname);
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

function main() {
  generate();
  console.log('Serving on port 3000');
  serve();
}


const isProd = process.argv.includes('--serve') || process.env.NODE_ENV === 'production';
const isDev = process.env.DEV || process.env.npm_lifecycle_event === 'dev';
if (isProd) {
  main();
} else if (isDev) {
  dev();
} else {
  generate();
}