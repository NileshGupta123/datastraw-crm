# Datastraw Support CRM

A full-stack customer support ticketing system built for the Datastraw Technologies hiring assessment.

## Live Demo
- **App:** [deployed URL here]
- **Demo Video:** [YouTube link here]

## Tech Stack
- **Backend:** FastAPI + SQLAlchemy + SQLite
- **Frontend:** React + Vite + Tailwind CSS
- **AI:** Groq API (llama-3.3-70b-versatile) for the AI Assist feature
- **Deployment:** Render (backend + frontend as separate services)

## Features
Core (required):
1. Create tickets with customer info, subject, description, auto-generated ticket ID
2. List all tickets with clean table view
3. Live search across name, ticket ID, email, and description
4. Filter by status (Open / In Progress / Closed)
5. Ticket detail view with status/priority updates and notes

Extras (beyond requirements):
- **Priority levels** (Low/Medium/High) with color-coded badges
- **Stats dashboard** — live ticket counts by status
- **Pagination** on the ticket list
- **Dark mode** toggle
- **Toast notifications** for create/update actions
- **✨ AI Assist** — Groq-powered ticket summary, priority suggestion, and draft reply generation, so support agents can respond faster

## Setup Instructions

### Backend
\`\`\`bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\Activate.ps1
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Add your GROQ_API_KEY to .env (get one free at console.groq.com)

uvicorn app.main:app --reload --port 8000
\`\`\`
API runs at `http://localhost:8000`, docs at `http://localhost:8000/docs`.

### Frontend
\`\`\`bash
cd frontend
npm install
cp .env.example .env
# VITE_API_URL should point to your backend, e.g. http://localhost:8000/api

npm run dev
\`\`\`
App runs at `http://localhost:5173`.

## API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/tickets | Create a ticket |
| GET | /api/tickets | List tickets (supports `status`, `search`, `page`, `limit`) |
| GET | /api/tickets/{ticket_id} | Get ticket detail |
| PUT | /api/tickets/{ticket_id} | Update status/priority/notes |
| POST | /api/tickets/{ticket_id}/notes | Add a note |
| POST | /api/tickets/{ticket_id}/ai-suggest | Get AI summary, priority suggestion, and reply draft |
| GET | /api/stats | Ticket counts by status |

## Database Schema
**tickets**: id, ticket_id, customer_name, customer_email, subject, description, status, priority, created_at, updated_at
**notes**: id, ticket_id (fk), note_text, created_at

## My Approach
[2-3 sentences — I'll help you write this once the app is deployed]

## Challenges & Solutions
[Fill in based on what we actually hit — e.g. Tailwind v4's PostCSS breaking change]

## With More Time, I Would...
[Fill in — e.g. auth, email notifications, ticket assignment to agents, real-time updates via websockets]