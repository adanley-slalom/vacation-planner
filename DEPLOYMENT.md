# Vacation Planner - Deployment Guide

## Setup for Local Development

```bash
# Install dependencies
npm install

# Set up .env with your Groq API key
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# Run both frontend and backend together
npm run dev
```

This starts:
- Frontend on `http://localhost:5173`
- Backend on `http://localhost:3001`
- Vite proxies `/api` to the backend

---

## Deployment to Production

### Option 1: Frontend on Vercel + Backend on Railway (Recommended)

#### Step 1: Deploy Backend to Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select this repo
4. Railway will auto-detect and run it using `railway.toml`
5. In Railway dashboard, add environment variables:
   - `GROQ_API_KEY` = your key
   - `LLM_MODEL` = `qwen/qwen3.8-27b`
   - `ITINERARY_LLM_MODEL` = `openai/gpt-oss-120b`
   - `PORT` = `3000` (or leave for Railway default)
6. Get your Railway backend URL (e.g., `https://vacation-planner-prod-railway.app`)

#### Step 2: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import this repo
3. In Environment Variables, add:
   - `VITE_API_URL` = `https://your-railway-backend-url`
4. Deploy

#### Step 3: Verify

- Frontend loads on Vercel
- Try sending a chat message - it should hit your Railway backend

---

## Environment Variables

### Local Development (`.env`)
- `GROQ_API_KEY` - Your Groq API key
- `LLM_MODEL` - Chat model (default: `qwen/qwen3.8-27b`)
- `ITINERARY_LLM_MODEL` - Itinerary model (default: `openai/gpt-oss-120b`)
- `PORT` - Server port (default: `3001`)
- `VITE_API_URL` - Backend API (default: `http://localhost:3001/api`)

### Vercel (Set in Dashboard)
- `VITE_API_URL` - Full URL to your deployed backend (e.g., `https://your-railway-url`)

### Railway (Set in Dashboard)
- `GROQ_API_KEY` - Your Groq API key
- `LLM_MODEL` - Chat model
- `ITINERARY_LLM_MODEL` - Itinerary model
- `PORT` - Container port (Railway manages this, usually 3000)

---

## Troubleshooting

**"Failed to process your request" on Vercel?**
- Check that `VITE_API_URL` is set to your Railway backend URL
- Verify Railway backend is running and accessible
- Check Railway logs for errors

**Backend not deploying to Railway?**
- Ensure `railway.toml` is in the repo root
- Check that `npm run build:server` works locally: `npm run build:server`
- Verify `server/index.ts` exists and has proper exports

**Local dev not working?**
- Run `npm install`
- Set `.env` with your `GROQ_API_KEY`
- Run `npm run dev` (starts both Vite client + Express server)
