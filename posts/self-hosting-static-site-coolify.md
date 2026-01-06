---
title: Self-Hosting a Static Site with Coolify
time: 2026-01-06T12:00:00Z
topic: coolify, self-hosting
ogimage: [PLACEHOLDER]
rssdescription: Learn how to deploy any static site to your own server using Coolify - no vendor lock-in, full control.

---
# Self-Hosting a Static Site with Coolify

Self-hosting sounds intimidating. Servers, Docker, nginx configs - it feels like a lot. But here's the thing: deploying a static site to your own server is simpler than you think, and the benefits are worth it.

## Why Self-Host?

Platforms like Vercel and Netlify are convenient. They work great - until they don't. Pricing changes, rate limits, or your account gets flagged for some reason. Suddenly, your site is at the mercy of someone else's decisions.

> When you self-host, you own your deployment.

There's also the learning aspect. Understanding how a website actually gets served - from Docker to nginx to DNS - makes you a better developer. And cost? A $5/month VPS can host dozens of static sites. No per-seat pricing, no bandwidth surprises.

## Why Coolify?

Coolify is an open-source, self-hostable platform that gives you the convenience of Vercel/Netlify on your own infrastructure. One-click deployments, automatic SSL, Git integration - all the good stuff, but running on your server.

It's free to self-host. You just need a VPS.

## What You Need

- A VPS with Coolify installed (<a href="https://coolify.io/docs">docs</a>)
- Your static site (HTML/CSS/JS, React build, Vue, Next.js export - anything)
- A Git repository (GitHub, GitLab, or Bitbucket)

## The Dockerfile

Create a `Dockerfile` in your project root:

```dockerfile
FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

What's happening here:
- We use `nginx:alpine` - a tiny, fast web server image
- Copy our custom nginx config
- Copy the built site (change `dist` to `build`, `out`, or whatever your framework outputs)
- Expose port 80 and start nginx

## The Nginx Config

Create an `nginx.conf` file:

```nginx
events {}
http {
    include /etc/nginx/mime.types;
    server {
        listen 80;
        root /usr/share/nginx/html;
        index index.html;
        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

This serves your static files and falls back to `index.html` for client-side routing (useful for SPAs like React or Vue).

## Deploy to Coolify

1. **Create a new project** in Coolify (just a container for your resources)
2. **Add a new resource** and select "Dockerfile"
3. **Connect your Git repository** - Coolify will pull your code automatically
4. **Set the build directory** if your site isn't in the root (e.g., `/frontend`)
5. **Hit Deploy**

That's it. Coolify builds your Docker image, starts the container, and your site is live.

## Add Your Domain

In the resource settings, add your domain (e.g., `example.com`). Point your DNS A record to your server's IP address. Coolify handles SSL automatically with Let's Encrypt.

No manual certificate management. No nginx reload commands. It just works.

## You Own It Now

Your static site is running on your server. No vendor lock-in, no surprise bills, no terms of service changes that break your workflow.

> The best part? You can deploy as many sites as your server can handle.

Welcome to self-hosting.
