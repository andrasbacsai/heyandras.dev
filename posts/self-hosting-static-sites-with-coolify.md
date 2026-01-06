---
title: Self-hosting a static site with Coolify
time: 2026-01-06T12:00:00Z
topic: coolify
ogimage: PLACEHOLDER
rssdescription: Why I chose Coolify over Vercel and Netlify for hosting this blog...
---
# Self-hosting a static site with Coolify

This blog is self-hosted with Coolify. Why would I do that when Vercel and Netlify exist and are free?

## The trade-off

**Vercel, Netlify, Cloudflare Pages** - they are great. Free tier, zero config, automatic deployments. But you trade control for convenience. Vendor lock-in is real. Pricing can surprise you at scale. You don't own anything.

**Coolify** - you need your own server, but then you have full control. No lock-in. No surprise bills. One server can host unlimited sites.

## Why I chose Coolify

- It aligns with my minimalism philosophy
- I own everything - data, infrastructure, deployments
- Predictable costs (just the server)
- One $5-10/month server hosts this blog and many other projects

## It's actually simple

Connect your GitHub repo. Pick "Static" as the build type (or use a Dockerfile). Click deploy. Done.

You get auto-SSL, auto-deployments on every push, and a nice UI to manage everything.

The code for this blog is on <a href="https://github.com/andrasbacsai/heyandras.dev">GitHub</a>. If this page loads fast, Coolify works.

> Self-hosting isn't scary. Coolify makes it accessible for everyone.
