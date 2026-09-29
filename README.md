# Wayfare — AI Vacation Planner

A simple, single-page web app that plans a vacation in three steps using AI. Built with React, Vite, TypeScript, and Tailwind CSS.

## Features

- **Step 1: Trip Basics** — Set budget range, dates, origin, and number of travelers
- **Step 2: Chat Assistant** — Describe your ideal vacation with quick-reply suggestions or use "Surprise me"
- **Step 3: Full Itinerary** — Day-by-day plan with activities, costs, and booking links

## Tech Stack

- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS
- **Calendar**: react-day-picker
- **Backend**: Express.js + Node.js
- **AI**: Groq API (with support for multiple models)
- **Validation**: Zod
- **Booking Links**: Deep links to Google Flights, Booking.com, Airbnb, Kayak, Viator

## Getting Started

### Prerequisites

- Node.js 22+
- Groq API key (free tier available at https://console.groq.com)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Add your Groq API key to `.env`:
```
GROQ_API_KEY=gsk_...
LLM_MODEL=qwen/qwen3.8-27b
ITINERARY_LLM_MODEL=openai/gpt-oss-120b
VITE_API_URL=http://localhost:3001/api
PORT=3001
```

### Development

Run the app in development mode:
```bash
npm run dev
```

This will start:
- Frontend on `http://localhost:5173`
- Backend API on `http://localhost:3001`

### Building

```bash
npm run build
```

## Project Structure

```
wayfare/
├─ api/                       # Serverless functions (Vercel deployment)
│  ├─ chat.js
│  └─ itinerary.js
├─ server/
│  ├─ index.ts            # Express app, routes
│  ├─ llm.ts              # Groq API wrapper
│  └─ validation.ts       # Zod validation schemas
├─ src/
│  ├─ App.tsx             # Main router
│  ├─ state/
│  │  └─ AppContext.tsx    # Global state management
│  ├─ steps/
│  │  ├─ TripBasics.tsx    # Step 1
│  │  ├─ ChatPlanner.tsx   # Step 2
│  │  └─ ItineraryView.tsx # Step 3
│  ├─ components/
│  │  ├─ DateRangePicker.tsx
│  │  ├─ BudgetInput.tsx
│  │  ├─ ChatBubble.tsx
│  │  ├─ BookingCard.tsx
│  │  ├─ DayTimeline.tsx
│  │  └─ CostBreakdown.tsx
│  ├─ lib/
│  │  ├─ types.ts
│  │  ├─ api.ts
│  │  └─ bookingLinks.ts
│  └─ index.css
├─ package.json
├─ tailwind.config.js
├─ tsconfig.json
├─ .env.example
└─ README.md
```

## API Endpoints

### `POST /api/chat`

Chat with the AI assistant. The assistant asks up to 2 follow-up questions and responds with `[READY]` when ready to plan.

**Request:**
```json
{
  "basics": { "budgetMin": 1000, "budgetMax": 5000, "startDate": "2024-06-01", "endDate": "2024-06-07", "days": 7, "origin": "NYC", "travelers": 2 },
  "messages": [{ "role": "user", "content": "Beach vacation" }]
}
```

**Response:**
```json
{
  "reply": "Great! What's your ideal pace?",
  "readyToPlan": false
}
```

### `POST /api/itinerary`

Generate a full day-by-day itinerary with costs and booking links.

**Request:**
```json
{
  "basics": { ... },
  "messages": [ ... ],
  "surprise": false
}
```

**Response:** A full `Itinerary` object with days, activities, costs, and lodging suggestions.

## Features Implemented

✅ Budget range input with validation  
✅ Date range picker (up to 30 days, no past dates)  
✅ Origin city input  
✅ Number of travelers  
✅ Chat interface with AI  
✅ Quick-reply chips (Beach, City, Adventure, Food & wine, Relaxation, Culture, Surprise me)  
✅ Surprise me mode (generates random destination based on season & budget)  
✅ Day-by-day itinerary with morning/afternoon/evening activities  
✅ Cost breakdown with budget comparison  
✅ Booking links for flights, hotels, Airbnb, car rental, activities  
✅ Print/Save as PDF  
✅ Responsive design (mobile-first)  
✅ Accessible (keyboard navigation, focus states, reduced motion support)  
✅ Clean, journalistic design with custom color palette  

## Future Enhancements (Out of Scope)

- User accounts and saved trips
- Real payment integration
- Live pricing APIs (Amadeus, Duffel)
- Multi-city trips
- Real-time currency conversion
- Mobile app

## Notes

- **Prices are estimates**. Final booking prices may vary.
- **API key security**: The LLM key is stored server-side only; never exposed to the browser.
- **Error handling**: Friendly error messages with retry buttons if the AI call fails.

## License

MIT License. See LICENSE file for details.
