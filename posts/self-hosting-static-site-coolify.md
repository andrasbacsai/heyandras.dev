---
title: Self-Hosting a Static Site with Coolify
time: 2026-01-06T12:00:00Z
topic: coolify
rssdescription: A complete guide to deploying your static site with Coolify using Docker.

---
# Self-Hosting a Static Site with Coolify

If you have a static site and want to self-host it, Coolify makes it incredibly simple. In this post, I will walk you through the entire process of deploying a static site using Docker.

This blog itself is deployed this way, so I'm sharing exactly what works for me.

## Prerequisites

Before we start, you need:

- Coolify installed and running on your server (check the <a href="https://coolify.io/docs">official docs</a> if you haven't set it up yet)
- A static site project (could be a simple HTML site, or something built with Vite, Astro, Next.js static export, etc.)
- Your code in a Git repository (GitHub, GitLab, or any Git provider)

## The Dockerfile

The key to deploying a static site with Coolify is a simple Dockerfile. We use a multi-stage build: first stage builds the site, second stage serves it with nginx.

Here's the Dockerfile I use for this blog:

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

Let me break it down:

**Build stage:**
- Uses Bun as the runtime (you can use Node if you prefer)
- Installs dependencies
- Runs the build command which outputs static files to `dist/`

**Production stage:**
- Uses nginx to serve the static files
- Copies the built files from the previous stage to nginx's default directory
- That's it. Nginx handles the rest.

If you're using Node instead of Bun, just swap the first line to `FROM node:20 AS build` and use `npm install` / `npm run build`.

## Deploying with Coolify

Now the fun part. Open your Coolify dashboard and follow these steps:

**1. Create a Project**

Projects in Coolify help you organize your resources. Click "Add Project" and give it a name.

**2. Add a New Resource**

Inside your project, click "Add Resource" and select your environment (production, staging, etc.).

Choose "Public Repository" if your repo is public, or "Private Repository (with Deploy Key)" if it's private. GitHub users can also use the GitHub App integration for easier access. Coolify will guide you through adding the deploy key to your Git provider.

**3. Configure the Resource**

Enter your repository URL and branch. Coolify will automatically detect the Dockerfile.

Set the port to `80` (nginx's default port).

If you have a domain, add it in the Domains section. Coolify will automatically set up SSL with Let's Encrypt.

**4. Deploy**

Hit the Deploy button. Coolify will:
- Clone your repository
- Build the Docker image using your Dockerfile
- Start the container
- Configure the reverse proxy

You can watch the build logs in real-time. Once it's done, your site is live.

## Automatic Deployments

You probably don't want to manually deploy every time you push changes. Coolify has you covered.

In your resource settings, you'll find a webhook URL. Add this as a webhook in your Git provider (GitHub, GitLab, etc.), and Coolify will automatically redeploy whenever you push to the configured branch.

For GitHub:
1. Go to your repo → Settings → Webhooks
2. Add the webhook URL from Coolify
3. Select "Just the push event"
4. Save

Now every `git push` triggers a new deployment.

## Conclusion

That's it. A Dockerfile, a few clicks in Coolify, and you have a self-hosted static site with automatic deployments and SSL.

No vendor lock-in. No usage limits. Full control.

If you want to learn more, check out the <a href="https://coolify.io/docs">Coolify documentation</a>.
