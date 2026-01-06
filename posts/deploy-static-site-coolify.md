---
title: Self-Hosting is Easier Than You Think
time: 2026-01-06T12:00:00Z
topic: coolify
rssdescription: Your first static site, self-hosted, in under 10 minutes. Here is how...

---
# Self-Hosting is Easier Than You Think

When I tell people they can host their own websites, the first reaction is usually: "That sounds complicated."

I get it. Managing servers, configuring nginx, dealing with SSL certificates... it feels like a lot.

> But it really is not.

By the end of this post, you will have a static site running on your own server. It takes about 10 minutes.

## What you need

- A VPS (I use <a href="https://hetzner.com">Hetzner</a>, but anything works)
- Coolify installed (<a href="https://coolify.io/docs/installation">takes 2 minutes</a>)
- Your static site files or a GitHub repo

That is it. Let's go.

## Step 1: Connect your server

If you installed Coolify directly on your VPS, localhost is already connected. You are good to go.

For remote servers, go to Servers in the sidebar, click "Add Server", and paste your SSH private key. Coolify validates the connection automatically.

## Step 2: Create a project

Projects are just containers to organize your resources. Think of them as folders.

Click "Add Project" in the dashboard, give it a name like "My Sites", and create an environment (production works fine for most cases).

## Step 3: Add your static site

Inside your project, click "+ New" and select your source.

For public GitHub repos, just paste the URL. For private repos, connect your GitHub account first.

> Here is where it gets good: Coolify uses Nixpacks to automatically detect your framework.

Whether you are using Next.js, Astro, Hugo, or plain HTML - it figures out how to build it. No configuration needed in most cases.

## Step 4: Configure the build

Nixpacks handles most of this automatically, but you can customize if needed:

- **Build command**: Usually auto-detected (e.g., `npm run build`)
- **Publish directory**: Where your built files end up (`dist`, `build`, `public`)

> If your site is already built (just HTML/CSS/JS files), leave the build command empty and set the publish directory to `.`

## Step 5: Set your domain

In the Domains section, add your custom domain.

Point your DNS to the server's IP address (A record). SSL is automatic with Let's Encrypt - no configuration required.

## Step 6: Deploy

Click Deploy and watch the build logs.

> That is it. Your site is now running on your own server.

No vendor lock-in. No surprise bills. No limits on builds or bandwidth. Just your site, on your hardware.

## What is next?

Enable webhooks to auto-deploy when you push to GitHub. Add more sites to the same server - it can handle dozens.

You just self-hosted your first site. The next one is even easier.

> Self-hosting is not about doing everything yourself. It is about having the choice.
