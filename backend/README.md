# AIML Nexus — Backend

Express API server for AI Tutor and Dataset endpoints.

## Stack
- Node.js + Express
- Firebase Admin SDK (token verification)
- OpenAI API (AI Tutor)

## Setup

```bash
cd backend
npm install
cp .env.example .env   # fill in values
npm run dev
```

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /health | No | Health check |
| POST | /api/ai-tutor | Yes (Firebase token) | Ask AI Tutor a question |
| GET | /api/dataset | No | Get mock ML dataset |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| OPENAI_API_KEY | No | Enables live AI Tutor (falls back to demo) |
| FIREBASE_SERVICE_ACCOUNT | Yes | Firebase Admin service account JSON (single line) |
| PORT | No | Server port (default: 4000) |
| FRONTEND_URL | No | Allowed CORS origin (default: http://localhost:3000) |

## Getting FIREBASE_SERVICE_ACCOUNT
1. Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Copy the JSON content, minify it to one line, paste as `FIREBASE_SERVICE_ACCOUNT`

## Deploy
Deploy to any Node.js host: **Railway**, **Render**, or **AWS EC2/App Runner**.
