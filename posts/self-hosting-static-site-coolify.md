---
title: Self-Hosting a Static Site with Coolify
time: 2026-01-05T12:00:00Z
topic: coolify
rssdescription: Why self-hosting matters and how to deploy a static site with Coolify using Docker and GitHub.

---
# Self-Hosting a Static Site with Coolify

This blog runs on Coolify. Not Vercel, not Netlify, not any managed platform. Just a VPS, Docker, and Coolify.

In this post, I will share why I chose self-hosting and walk you through deploying a static site with Coolify.

## Why Self-Host?

There are plenty of platforms that make deployment effortless. So why bother with self-hosting?

**Control.** Your infrastructure, your rules. No surprise pricing changes, no terms of service updates that break your workflow, no features getting deprecated.

**No vendor lock-in.** If something changes, you can move your setup to any server. Your Dockerfile works everywhere.

**Cost.** A $5-10/month VPS can host dozens of sites. Compare that to paying per-project on managed platforms. At scale, self-hosting wins.

**Learning.** Understanding how deployments actually work makes you a better developer. When something breaks, you know where to look.

> Self-hosting is not about doing everything the hard way. It is about owning your stack.

## Why Coolify?

<a href="https://coolify.io">Coolify</a> is an open-source, self-hostable platform that gives you a Vercel-like experience on your own server. It handles:

- Git-based deployments (push to deploy)
- Docker builds (Dockerfile or Nixpacks)
- SSL certificates via Let's Encrypt
- Custom domains
- Environment variables
- And much more

You get the convenience of a PaaS without giving up control.

## What You Need

Before we start, make sure you have:

1. A VPS with Coolify installed (check the <a href="https://coolify.io/docs">docs</a> for installation)
2. A GitHub repository with your static site
3. A Dockerfile (we will create one below)
4. A domain name (optional but recommended)

## The Dockerfile

For static sites, I prefer the Dockerfile approach over Nixpacks. It gives you explicit control over the build process and the final image.

Here is the Dockerfile this blog uses:

```
FROM oven/bun:latest AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install
COPY . .
RUN bun run build

FROM nginx:latest AS prod
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
```

This is a multi-stage build:

1. **Build stage**: Uses Bun to install dependencies and build the site into a `dist` folder
2. **Production stage**: Uses nginx to serve the static files

You will also need an `nginx.conf` file:

```
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
}
```

Adjust the build commands for your stack. Using Vite? Replace `bun run build` with `npm run build`. The pattern stays the same.

## Deploying to Coolify

Once your Dockerfile is ready and pushed to GitHub:

1. Open Coolify and create a new **Project** (or use an existing one)
2. Add a new **Resource** and select **Public Repository** or **Private Repository (with GitHub App)**
3. Paste your repository URL
4. Coolify will detect your Dockerfile automatically. If not, set the build method to **Dockerfile**
5. Click **Deploy**

Coolify will clone your repo, build the Docker image, and start the container. You will see the build logs in real-time.

Once deployed, Coolify gives you a generated URL to test your site.

## Custom Domain and SSL

To use your own domain:

1. Go to your resource settings in Coolify
2. Under **Domains**, add your domain (e.g., `blog.example.com`)
3. Enable **Let's Encrypt** for automatic SSL

Then configure your DNS:

- Add an **A record** pointing to your server's IP address
- Or use a **CNAME** if you are using a subdomain and prefer that approach

Coolify handles certificate generation and renewal automatically. No manual setup, no cron jobs, no certbot commands.

Within minutes, your site will be live on your custom domain with HTTPS.

## Wrapping Up

Self-hosting a static site with Coolify is straightforward:

1. Write a Dockerfile that builds your site and serves it with nginx
2. Push to GitHub
3. Connect the repo in Coolify
4. Add your domain and enable SSL

You get full control over your deployment, predictable costs, and a setup you actually understand.

If you have been relying on managed platforms and want to try something different, give Coolify a shot.
