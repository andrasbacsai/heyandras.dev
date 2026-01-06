---
title: Self-Hosting a Static Site with Coolify
time: 2025-01-06T12:00:00Z
topic: coolify,self-hosting
rssdescription: A beginner's guide to deploying your own static site using Coolify on a VPS.
---

# Self-Hosting a Static Site with Coolify

Self-hosting means running your own applications on servers you control, instead of relying on platforms like Vercel, Netlify, or GitHub Pages. You get full control over your data, no vendor lock-in, and often lower costs at scale.

But setting up servers, configuring reverse proxies, managing SSL certificates, and handling deployments can be intimidating. That's where <a href="https://coolify.io">Coolify</a> comes in.

Coolify is an open-source, self-hosted platform that makes deploying applications as easy as pushing to GitHub. Think of it as your own Vercel or Netlify, running on your own server.

In this guide, I'll walk you through deploying a static site using Coolify. I'll use this very blog as the example - it's a simple static site built with Bun and served with Nginx.

## Prerequisites

Before we start, you'll need:

- **A VPS** - I recommend <a href="https://www.hetzner.com/cloud">Hetzner</a> for their excellent price-to-performance ratio. A CX22 (2 vCPU, 4GB RAM) for around €4/month is more than enough.
- **A domain name** - Optional, but recommended. You can use a free subdomain from services like <a href="https://freedns.afraid.org">FreeDNS</a> if you don't have one.
- **A GitHub account** - With a repository containing your static site.
- **Basic terminal knowledge** - You should be comfortable with SSH and running commands.

## Setting Up Your VPS

If you're using Hetzner, create a new server with these settings:

- **Location**: Choose the closest to your target audience
- **Image**: Ubuntu 24.04 (or the latest LTS)
- **Type**: CX22 or higher
- **SSH Key**: Add your public SSH key for secure access

Once the server is created, note down the IP address. You'll need it to connect.

SSH into your server:

```bash
ssh root@your-server-ip
```

## Installing Coolify

Coolify has a one-line installer that handles everything. Run this command on your server:

```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

This script will:

- Install Docker if it's not already installed
- Set up the required Docker networks
- Pull and start the Coolify containers
- Configure everything automatically

The installation takes a few minutes. Once it's done, you'll see a message with the URL to access your Coolify dashboard.

> The installation script will display the exact URL at the end. By default, Coolify runs on port 8000.

Open your browser and go to:

```
http://your-server-ip:8000
```

You'll be greeted with the registration page. Create your admin account - this will be the only account that can access your Coolify instance.

After registration, you'll land on the dashboard. Take a moment to explore - it's quite intuitive.

## Configuring Your Server

Coolify needs to know about the server it's running on. By default, it creates a "localhost" server during installation, which represents the machine Coolify is installed on.

Go to **Servers** in the sidebar. You should see your localhost server already connected and validated. If the status shows "Connected", you're good to go.

> If you want to deploy to remote servers, you can add them here too. But for this guide, we'll deploy to the same server running Coolify.

## Creating a Project

Projects in Coolify are containers for organizing your applications. Let's create one for your static site.

1. Go to **Projects** in the sidebar
2. Click **+ Add**
3. Give it a name (e.g., "My Blog" or "Personal Site")
4. Click **Continue**

You now have a project. Inside it, you'll see a default "Production" environment. Environments help you separate staging from production deployments if needed.

## Deploying Your Static Site

Now for the main event - deploying your site.

1. Click into your project, then into the **Production** environment
2. Click **+ Add New Resource**
3. Select your server (localhost)
4. Choose **Public Repository** (or Private if your repo is private)

For a public GitHub repository, paste the URL:

```
https://github.com/yourusername/your-repo
```

Coolify will detect your repository and try to figure out how to build it.

### Build Configuration

This is where it gets interesting. Coolify supports multiple build methods:

- **Nixpacks** - Automatic detection and building (works for most frameworks)
- **Dockerfile** - Use your own Dockerfile
- **Docker Compose** - For multi-container setups
- **Static** - Just serve files directly

For this blog, I use a Dockerfile that builds with Bun and serves with Nginx. If your repository has a Dockerfile, Coolify will detect it automatically.

If you're using a simple static site generator without a Dockerfile, select **Nixpacks** and configure:

- **Build Command**: Your build command (e.g., `npm run build`, `bun run build`)
- **Install Command**: Your install command (e.g., `npm install`, `bun install`)
- **Base Directory**: Leave empty if your code is in the root
- **Publish Directory**: Where your built files are (e.g., `dist`, `build`, `out`)

### Setting Up Your Domain

Scroll down to the **Domains** section. Here you can configure:

- Your custom domain (e.g., `blog.yourdomain.com`)
- Coolify will automatically provision SSL certificates via Let's Encrypt

Make sure your domain's DNS points to your server's IP address before deploying. Add an A record:

```
Type: A
Name: blog (or @ for root domain)
Value: your-server-ip
TTL: 3600
```

### Deploy!

Once everything is configured, click **Deploy**.

Coolify will:

1. Clone your repository
2. Build your application (using Dockerfile or Nixpacks)
3. Start the container
4. Configure the reverse proxy (Traefik)
5. Provision SSL certificates

You can watch the build logs in real-time. If something goes wrong, the logs will tell you what happened.

After a successful deployment, your site will be live at your configured domain!

## Automatic Deployments

You probably want your site to automatically redeploy when you push changes to GitHub. Coolify makes this easy with webhooks.

In your application settings, go to the **Webhooks** section. You'll see a webhook URL that looks like:

```
https://your-coolify-domain/api/webhooks/...
```

Copy this URL and add it to your GitHub repository:

1. Go to your repo on GitHub
2. Click **Settings** → **Webhooks** → **Add webhook**
3. Paste the Coolify webhook URL
4. Set Content type to `application/json`
5. Select "Just the push event"
6. Click **Add webhook**

Now every time you push to your repository, Coolify will automatically rebuild and redeploy your site.

## Wrapping Up

You now have your own self-hosted static site, deployed with Coolify. Every push to GitHub triggers an automatic deployment, SSL is handled for you, and you have full control over your infrastructure.

The benefits of this setup:

- **Full control** - Your data, your server, your rules
- **Cost effective** - A €4/month VPS can host multiple sites
- **No vendor lock-in** - Standard Docker containers, easy to migrate
- **Privacy** - No third-party tracking your visitors or builds

Coolify can do much more than static sites - databases, backend services, Docker Compose stacks, and more. But that's for another post.

If you have questions, find me on <a href="https://x.com/heyandras">X/Twitter</a> or <a href="https://bsky.app/profile/heyandras.dev">Bluesky</a>.

> Give self-hosting a try. It's more accessible than ever. :)
