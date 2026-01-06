---
title: Deploy Your Node.js App in Minutes
time: 2026-01-06T13:00:00Z
topic: coolify
rssdescription: Your first Node.js app, self-hosted, in under 10 minutes. Here is how...

---
# Deploy Your Node.js App in Minutes

When I tell people they can host their own Node.js apps, the first reaction is usually: "That sounds complicated."

I get it. Managing servers, configuring process managers, dealing with SSL certificates... it feels like a lot.

> But it really is not.

By the end of this post, you will have a Node.js app running on your own server. It takes about 10 minutes.

## What you need

- A VPS (I use <a href="https://hetzner.com">Hetzner</a>, but anything works)
- Coolify installed (<a href="https://coolify.io/docs/installation">takes 2 minutes</a>)
- Your Node.js app or a GitHub repo

That is it. Let's go.

## Step 1: Connect your server

If you installed Coolify directly on your VPS, localhost is already connected. You are good to go.

For remote servers, go to Servers in the sidebar, click "Add Server", and paste your SSH private key. Coolify validates the connection automatically.

## Step 2: Create a project

Projects are just containers to organize your resources. Think of them as folders.

Click "Add Project" in the dashboard, give it a name like "My Apps", and create an environment (production works fine for most cases).

## Step 3: Add your Node.js app

Inside your project, click "+ New" and select your source.

For public GitHub repos, just paste the URL. For private repos, connect your GitHub account first.

> Here is where it gets good: Coolify uses Nixpacks to automatically detect your Node.js app.

It reads your `package.json`, figures out your Node version, install command, and start script. No configuration needed in most cases.

## Step 4: Configure the build

Nixpacks handles most of this automatically, but you can customize if needed:

- **Build command**: Usually auto-detected from `package.json` (e.g., `npm run build`)
- **Start command**: Auto-detected from your `start` script or `main` field
- **Port**: Coolify detects common ports, or set it manually

> Make sure your app listens on `0.0.0.0` instead of `localhost`, and use the `PORT` environment variable if possible.

## Step 5: Set your domain

In the Domains section, add your custom domain.

Point your DNS to the server's IP address (A record). SSL is automatic with Let's Encrypt - no configuration required.

## Step 6: Deploy

Click Deploy and watch the build logs.

> That is it. Your Node.js app is now running on your own server.

No vendor lock-in. No surprise bills. No cold starts. Just your app, on your hardware, running 24/7.

## What is next?

Enable webhooks to auto-deploy when you push to GitHub. Add a database - Coolify supports PostgreSQL, MySQL, MongoDB, and more with one click.

You just self-hosted your first Node.js app. The next one is even easier.

> Self-hosting is not about doing everything yourself. It is about having the choice.
