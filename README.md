# Business Licensing Assistant (Restaurants – Israel)

## Goal
Minimal MVP that helps a food business in Israel understand key licensing and compliance requirements. The app ingests selected rules from an official spec, asks a short questionnaire, matches relevant requirements, and generates a clear Hebrew report (LLM-backed with a server-side fallback).

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Data: JSON (normalized rules)
- Optional AI: OpenAI / Google Gemini / Groq / Ollama (switchable via `.env`)

## Folder Structure
```
business-licensing-assistant/
├── client/          # Vite + React frontend
├── server/          # Express API (match + report)
├── data/
│   ├── raw/         # Original PDF/Word (source)
│   └── processed/   # requirements.json (normalized)
├── README.md
└── משימה.md        # Task specification (Hebrew)
```

## Quick Start (dev)
1. `cd server && npm i && npm run dev`
2. `cd client && npm i && npm run dev`
3. Open the client (Vite default port) and run a sample questionnaire.

## Notes
- Keep functionality over visual polish.
- Always append a legal disclaimer to generated reports.
