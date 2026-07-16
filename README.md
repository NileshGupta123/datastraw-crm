# 🎫 Datastraw Support CRM

A full-stack customer support ticketing system built for the Datastraw Technologies hiring assessment — designed, built, and deployed to production in a single sprint.

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Groq](https://img.shields.io/badge/Groq-AI%20Powered-orange?style=flat)](https://groq.com/)
[![Deployed on Render](https://img.shields.io/badge/Deployed-Render-46E3B7?style=flat&logo=render)](https://render.com/)

**🔗 Live App:** https://datastraw-crm-frontend.onrender.com
**🔗 Backend API:** https://datastraw-crm-backend-jwyc.onrender.com/docs
**🎥 Demo Video:** [link here]

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Setup Instructions](#setup-instructions)
- [My Approach](#my-approach)
- [Challenges & Solutions](#challenges--solutions)
- [With More Time](#with-more-time-i-would)

---

## Overview

A customer support agent needs to do three things fast: see what's open, understand what a customer needs, and respond. This CRM is built around that loop — a clean ticket list with live search and filtering, a detail view for triage, and an AI Assist feature that turns a raw customer complaint into a summary, a priority call, and a draft reply in one click.

The brief asked for 4-5 core features on a 2-table schema. I built all 5, then used the "extra features welcome" note as an opportunity to add the kind of polish and AI integration that separates a working prototype from something that feels shippable.

## Features

**Core (as specified):**
| Feature | Description |
|---|---|
| 🎫 Create Tickets | Customer name, email, subject, description — auto-generated ID (`TKT-001`, `TKT-002`...) and timestamp |
| 📋 List View | Clean table: ID, customer, subject, priority, status, date |
| 🔍 Live Search | Debounced search-as-you-type across name, ticket ID, email, and description |
| 🏷️ Status Filter | Open / In Progress / Closed |
| 📝 Detail & Update | Full ticket view with status/priority editing and a notes/comments history |

**Beyond the brief:**
| Feature | Why it's here |
|---|---|
| ✨ **AI Assist** (Groq) | One click generates a summary, a suggested priority *with reasoning*, and a draft customer reply — the single highest-leverage feature for an actual support agent |
| 📊 Stats Dashboard | Live counts by status, so triage priority is visible without opening the list |
| ⚡ Priority Levels | Low/Medium/High, color-coded, factored into both manual and AI-assisted triage |
| 📄 Pagination | List scales past a single page without a full reload |
| 🌙 Dark Mode | Persisted toggle, respects system preference on first load |
| 🔔 Toast Notifications | Immediate feedback on create/update instead of silent success |

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Backend | FastAPI + SQLAlchemy | Async-ready, auto-generated OpenAPI docs at `/docs`, strong typing via Pydantic |
| Database | SQLite | Matches the brief's "keep it simple" guidance — 2 tables, no over-engineering |
| Frontend | React + Vite + Tailwind CSS | Fast dev loop, utility-first styling, easy dark-mode theming |
| AI | Groq (`llama-3.3-70b-versatile`) | Free tier, fast inference, structured JSON output mode |
| Deployment | Render (2 services) | Backend as a Web Service, frontend as a Static Site with SPA rewrite rules |

## Architecture

```
┌─────────────────┐         REST/JSON          ┌──────────────────┐
│  React Frontend  │ ───────────────────────▶  │   FastAPI Backend │
│  (Vite + Tailwind)│ ◀─────────────────────── │  (SQLAlchemy ORM) │
└─────────────────┘                             └─────────┬────────┘
                                                            │
                                            ┌───────────────┼───────────────┐
                                            ▼                               ▼
                                   ┌─────────────────┐           ┌──────────────────┐
                                   │  SQLite Database │           │    Groq API       │
                                   │ (tickets + notes) │           │ (AI Assist)        │
                                   └─────────────────┘           └──────────────────┘
```

Deployed as two independent Render services connected via CORS-scoped REST calls — no shared infrastructure, so either side can be redeployed or swapped independently.

## Database Schema

**`tickets`**
| Column | Type | Notes |
|---|---|---|
| id | integer (PK) | |
| ticket_id | string (unique) | e.g. `TKT-001`, auto-generated sequentially |
| customer_name | string | |
| customer_email | string | validated |
| subject | string | |
| description | text | |
| status | string | `Open` / `In Progress` / `Closed` |
| priority | string | `Low` / `Medium` / `High` |
| created_at | datetime | |
| updated_at | datetime | |

**`notes`**
| Column | Type | Notes |
|---|---|---|
| id | integer (PK) | |
| ticket_id | integer (FK → tickets.id) | |
| note_text | text | |
| created_at | datetime | |

## API Reference

Full interactive docs live at [`/docs`](https://datastraw-crm-backend-jwyc.onrender.com/docs) (Swagger UI, auto-generated by FastAPI).

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/tickets` | Create a ticket → `{ ticket_id, created_at }` |
| `GET` | `/api/tickets` | List tickets — query params: `status`, `search`, `page`, `limit` |
| `GET` | `/api/tickets/{ticket_id}` | Full ticket detail including notes |
| `PUT` | `/api/tickets/{ticket_id}` | Update `status` / `priority` / add a `notes` entry |
| `POST` | `/api/tickets/{ticket_id}/notes` | Add a note directly |
| `POST` | `/api/tickets/{ticket_id}/ai-suggest` | Returns `{ summary, suggested_priority, suggested_priority_reason, suggested_response }` |
| `GET` | `/api/stats` | `{ total, open, in_progress, closed }` |

## Setup Instructions

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: .\venv\Scripts\Activate.ps1

pip install -r requirements.txt
cp .env.example .env            # add your GROQ_API_KEY (free at console.groq.com)

uvicorn app.main:app --reload --port 8000
```
Runs at `http://localhost:8000` — docs at `/docs`.

### Frontend
```bash
cd frontend
npm install
cp .env.example .env            # set VITE_API_URL=http://localhost:8000/api

npm run dev
```
Runs at `http://localhost:5173`.

> **Note on data persistence:** the deployed backend runs on Render's free tier, which uses an ephemeral filesystem — the SQLite database resets on every redeploy or extended idle period. This is a deliberate tradeoff to keep the assessment free-tier friendly; see [With More Time](#with-more-time-i-would) for the production fix.

## My Approach

I started from the schema and API contract rather than the UI, since getting the data model right first meant the frontend was just wiring, not guesswork. The 2-table structure in the brief was already correct for the scope, so I kept it exactly as specified rather than adding complexity. Once the 5 core features were working end-to-end, I used the explicit "extra features welcome" note to add one feature I thought would actually matter to a support agent using this daily: AI Assist. Rather than three disconnected AI gimmicks, I built it as a single Groq call returning structured JSON — a summary, a reasoned priority suggestion, and a ready-to-edit reply — because that's the shape of decision a real triage workflow needs.

## Challenges & Solutions

**Tailwind CSS v4's PostCSS breaking change.** `npm install` pulled Tailwind v4, which moved PostCSS integration into a separate `@tailwindcss/postcss` package and changed the CSS import syntax from `@tailwind base/components/utilities` to a single `@import "tailwindcss"`. Fixed by installing the new package and updating both `postcss.config.js` and `index.css`.

**Python 3.14 build failure on Render.** Render defaulted to Python 3.14, which doesn't yet have prebuilt wheels for `pydantic-core` — pip fell back to compiling it from source via Rust/maturin, which failed on Render's read-only build filesystem. Fixed by pinning `python-3.11.9` via a `runtime.txt` file, which has stable prebuilt wheels for the full dependency chain.

**CORS blocking the deployed frontend.** After deploying both services independently, ticket creation and the stats dashboard silently failed with `No 'Access-Control-Allow-Origin' header is present`. Root cause: the backend's `CORS_ORIGINS` environment variable had been set but never actually saved/redeployed with the production frontend URL. Diagnosed via the browser console's Network tab, fixed by updating the environment variable and forcing a fresh deploy — a good reminder to verify env var changes actually took effect, not just that they were entered.

## With More Time, I Would...

- **Migrate to PostgreSQL** (Render's free tier) for persistent storage — SQLite on an ephemeral filesystem is fine for a demo but not production
- **Add authentication** — even basic agent login, so tickets can be assigned and attributed
- **WebSocket/SSE live updates** — so the ticket list reflects changes from other agents in real time, not just on refresh
- **Email notifications** — auto-notify the customer when their ticket status changes
- **Expand AI Assist** — auto-categorize tickets by type (billing, technical, shipping, etc.) and use that for smarter routing
