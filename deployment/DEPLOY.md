# WeiraLynk — Deployment Guide

Deploy WeiraLynk to a client VPS in under 30 minutes.

## Prerequisites

- VPS: Ubuntu 22.04 or 24.04
- Minimum: 4 vCPU, 8 GB RAM, 80 GB SSD
- A domain with an A record pointing to the VPS IP
- Docker installed and running
- A GHCR read token with `read:packages` scope

## Step 1 — Install Docker

    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker $USER
    newgrp docker

## Step 2 — Login to GHCR

    echo "CLIENT_READ_TOKEN" | docker login ghcr.io -u nyaigs --password-stdin

Replace `CLIENT_READ_TOKEN` with the token issued to the client.

## Step 3 — Pull the Image

    docker pull ghcr.io/nyaigs/weiralynk:1.0.0
    docker tag ghcr.io/nyaigs/weiralynk:1.0.0 custom-erpnext-healthcare:latest

## Step 4 — Clone Config

    git clone https://github.com/Nyaigs/WeiraLynk.git
    cd WeiraLynk

## Step 5 — Configure

Edit `pwd.yml` before deploying:

- Site name: the client's domain
- Admin password: set a strong unique password
- Database password: set a strong unique password
- Company name: the client's registered name
- Company email: the client's contact email

## Step 6 — Deploy

    docker-compose -f pwd.yml up -d

## Step 7 — Wait for Site Creation

    docker-compose -f pwd.yml logs -f create-site

Wait until the log shows: `create-site-1 exited with code 0`

This takes 5–10 minutes on first run.

## Step 8 — SSL (Recommended)

    sudo apt install nginx certbot python3-certbot-nginx
    sudo certbot --nginx -d client-domain.com

## Step 9 — First Login

- URL: https://client-domain.com
- Username: Administrator
- Password: the one set in Step 5

## Step 10 — Post-Deployment Setup

1. Complete the Setup Wizard
2. Create user roles
3. Configure warehouses and service units
4. Set up M-Pesa credentials (when enabled)
5. Train staff

## Backups

Automated backups run daily by default. Configure off-site backup storage:

    docker-compose -f pwd.yml exec backend bench --site frontend backup --with-files

## Support

Email: weiralynk@gmail.com
