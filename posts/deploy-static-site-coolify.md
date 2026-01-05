---
title: How to deploy a static site with Coolify
time: 2026-01-05T12:00:00Z
topic: coolify
ogimage:
rssdescription: A complete beginner guide to self-hosting your static sites with Coolify - from server setup to automatic deployments.

---
# How to deploy a static site with Coolify

So you have a static site and you want to host it somewhere. You could use Vercel, Netlify, or GitHub Pages - they're great! But what if you want full control over your infrastructure? What if you want to learn how things actually work under the hood?

> Self-hosting is not just about saving money. It's about ownership and learning.

In this guide, I'll show you how to deploy any static site using Coolify. Whether it's a simple HTML page, a Hugo blog, or a Next.js static export - by the end, you'll have it running on your own server with automatic deployments on every git push.

## Prerequisites

Before we start, you'll need:

- **A server** - A VPS from Hetzner, DigitalOcean, Vultr, or any cloud provider. Even a $5/month server works fine for static sites.
- **A domain** (optional but recommended) - You can use Coolify without one, but having a domain makes everything nicer.
- **A GitHub or GitLab account** - With your static site in a repository.

## Installing Coolify

If you don't have Coolify installed yet, it's a single command:

```
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

This installs everything you need. Once done, you can access Coolify at `http://your-server-ip:8000`.

For detailed installation instructions, check the <a href="https://coolify.io/docs/installation">official documentation</a>.

## Deploying your first static site

Let's deploy a static site step by step.

### 1. Create a new project

In Coolify, projects help you organize your resources. Create one for your static sites - you can name it anything you like.

### 2. Add a new resource

Click "Add Resource" and choose one of these options:

- **Public Repository** - If your repo is public on GitHub/GitLab
- **GitHub App** - If you want to connect your GitHub account for private repos and webhooks

For this guide, let's use a public repository. Paste your repository URL.

### 3. Configure the build

This is where you tell Coolify how to build your site. The settings depend on what kind of static site you have:

**Build Command** - The command that builds your site (e.g., `npm run build`, `hugo`, `bun run build`)

**Publish Directory** - The folder containing your built files (e.g., `dist`, `public`, `build`, `out`)

Don't worry if you're not sure - I'll give you examples for common setups below.

### 4. Set up your domain

Under the "Domains" section, add your domain. Coolify will automatically set up SSL certificates using Let's Encrypt.

If you don't have a domain yet, Coolify generates a random URL you can use.

### 5. Deploy

Hit the deploy button and watch the magic happen. Coolify will clone your repo, run the build command, and serve your site.

## Examples for different static sites

Here's how to configure Coolify for various types of static sites.

### Simple HTML/CSS (no build step)

If you just have HTML, CSS, and maybe some JavaScript files:

- **Build Command**: Leave empty
- **Publish Directory**: `.` (or the folder containing your index.html)

That's it. No build needed.

### Hugo

- **Build Command**: `hugo`
- **Publish Directory**: `public`

Make sure your server has Hugo installed, or use a Dockerfile (more on that later).

### Jekyll

- **Build Command**: `bundle install && bundle exec jekyll build`
- **Publish Directory**: `_site`

### Astro

- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

### Next.js (static export)

First, make sure your `next.config.js` has `output: 'export'` set.

- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `out`

### This blog (Bun + custom build)

This blog uses Bun to generate static HTML. Here's how it's configured:

- **Build Command**: `bun install && bun run build`
- **Publish Directory**: `dist`

For more complex setups, you can also use a Dockerfile. This blog actually uses one to serve files with nginx:

```dockerfile
FROM oven/bun:latest AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install
COPY . .
RUN bun run build

FROM nginx:latest AS prod
COPY --from=build /app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
```

When using a Dockerfile, Coolify detects it automatically and builds accordingly.

## Auto-deploy on git push

One of the best features of Coolify is automatic deployments. Every time you push to your repository, Coolify can automatically rebuild and deploy your site.

To enable this:

1. Make sure you've connected your GitHub account (not just using a public URL)
2. In your resource settings, enable "Webhooks"
3. Coolify will set up the webhook on GitHub automatically

Now every `git push` triggers a new deployment. No manual clicking required.

## Conclusion

You now have a self-hosted static site with automatic deployments. No vendor lock-in, full control over your infrastructure, and you learned something along the way.

The best part? You can deploy as many static sites as your server can handle - all for the cost of one VPS.

> Start small, learn as you go, and don't be afraid to break things.

If you have questions, feel free to reach out on one of the social platforms in the footer. Happy self-hosting!
