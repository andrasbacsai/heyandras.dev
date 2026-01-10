---
title: Self-Hosting on Hetzner
time: 2026-01-10T12:00:00Z
topic: self-hosting
rssdescription: Why Hetzner is my go-to choice for self-hosting projects and how to get started...

---
# Self-Hosting on Hetzner

If you're getting into self-hosting, you've probably heard of Hetzner. It's a German hosting provider that has become incredibly popular in the self-hosting community, and for good reason.

## Why Hetzner?

### Price-to-Performance Ratio

Hetzner offers some of the best pricing in the industry. Their dedicated servers and cloud instances are significantly cheaper than major cloud providers like AWS, GCP, or Azure. You can get a dedicated server with serious specs for the price of a modest cloud VM elsewhere.

For example, their CAX line (ARM-based cloud servers) starts at around €4/month for a CAX11 (2 vCPU, 4GB RAM) and offers great performance for most workloads. Check <a href="https://www.hetzner.com/cloud">Hetzner's pricing page</a> for current rates.

### European Data Centers

With data centers in Germany and Finland, Hetzner is an excellent choice if you care about data sovereignty and GDPR compliance. Your data stays in Europe, under European laws.

### No Surprise Bills

One thing I love about Hetzner is the predictable pricing. No hidden egress fees that suddenly blow up your bill. You pay for what you provision, and that's it.

## Getting Started

### Cloud vs Dedicated

Hetzner offers two main options:

1. **Hetzner Cloud** - Virtual servers that you can spin up in seconds. Great for testing, smaller projects, or when you need flexibility.

2. **Dedicated Servers** - Physical machines that are entirely yours. Better for production workloads, databases, or when you need consistent performance.

For most self-hosting beginners, I recommend starting with Hetzner Cloud. It's easier to manage and you can always migrate to dedicated later.

### My Recommended Setup

Here's what I typically use for a self-hosting setup:

- **CAX21 or CAX31** - ARM-based servers with great price-to-performance
- **Ubuntu 24.04** - Stable and well-supported
- **A tool like Coolify** - Makes deploying applications a breeze

### Initial Server Setup

Once your server is running, here are the essential first steps:

```bash
# Update the system
apt update && apt upgrade -y

# Create a non-root user
adduser deploy
usermod -aG sudo deploy

# Set up SSH key authentication (run on your local machine)
ssh-copy-id deploy@your-server-ip

# Disable password authentication (edit on the server)
sudo nano /etc/ssh/sshd_config
# Set: PasswordAuthentication no
sudo systemctl restart sshd

# Install and enable the firewall
sudo apt install ufw -y
sudo ufw allow OpenSSH
sudo ufw enable
```

After securing the basics, you can install Coolify with a single command and start deploying applications.

### Things to Consider

1. **Backups** - Hetzner offers automated backups for a small fee. Enable them.

2. **Firewall** - Use Hetzner's cloud firewall. It's free and blocks traffic before it reaches your server.

3. **Floating IPs** - If you plan to migrate between servers, consider using a floating IP.

4. **Location** - Choose the data center closest to your users. Nuremberg and Falkenstein are in Germany, Helsinki is in Finland.

## The Self-Hosting Mindset

Self-hosting isn't just about saving money (though that's nice). It's about:

- **Control** - Your data, your rules
- **Learning** - Understanding how things actually work
- **Privacy** - Not being the product
- **Independence** - Not relying on services that might disappear

Hetzner gives you the infrastructure to make this happen without breaking the bank.

## What's Next?

If you're new to self-hosting, here are some great first projects to try:

1. **Deploy a personal website** - Use Coolify to deploy a static site or blog
2. **Set up Uptime Kuma** - Monitor your services with a beautiful dashboard
3. **Install Nextcloud** - Your own cloud storage, calendar, and contacts
4. **Run Plausible or Umami** - Privacy-friendly analytics for your websites
5. **Self-host Vaultwarden** - Your own password manager

Each of these teaches you something new about Docker, networking, and server management.

> The best time to start self-hosting was yesterday. The second best time is now.

Feel free to reach out on social media if you have questions about getting started. Happy hosting!
