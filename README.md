# WeiraLynk

Facility management platform for rehabilitation centres, mental health
facilities, and clinics across Kenya.

## Repository Structure

This repository serves two purposes:

- **Root** — the WeiraLynk Frappe app (seed configuration)
- **`deployment/`** — Docker Compose and deployment files for client VPSes

## Version
- v1.2.0 — Rehab archetype with auto-seed

## Deployment

See `deployment/DEPLOY.md` for the full client deployment guide.

Quick start on a fresh VPS:

    git clone https://github.com/Nyaigs/WeiraLynk.git
    cd WeiraLynk/deployment
    docker-compose -f pwd.yml up -d
    ./rehab-setup.sh client-domain.com

## Stack

- ERPNext v15
- Marley Health v15
- HRMS v15
- Lending v15
- Frappe M-Pesa Payments v15
- WeiraLynk Seed app (this repo)
