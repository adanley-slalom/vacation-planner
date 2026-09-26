import OpenAI from 'openai';
import type { TripBasics, ChatMessage } from '../src/lib/types';

const openai = new OpenAI({
  apiKey: process.env.LLM_API_KEY,
});

const MODEL = process.env.LLM_MODEL || 'gpt-4o-mini';

export async function chatWithAssistant(basics: TripBasics, messages: ChatMessage[]): Promise<string> {
  const systemPrompt = `You are a friendly travel planner. The user's trip: ${basics.days} days from ${basics.startDate} to ${basics.endDate}, budget $${basics.budgetMin}-${basics.budgetMax} total for ${basics.travelers} traveler(s), departing from ${basics.origin}. Ask at most 2 short follow-up questions to understand their preferences, one at a time. Keep replies under 60 words. When you have enough information, end your reply with the exact token [READY].`;

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
    temperature: 0.7,
    max_tokens: 200,
  });

  return response.choices[0].message.content || '';
}

export async function generateItinerary(
  basics: TripBasics,
  messages: ChatMessage[],
  surprise: boolean
): Promise<string> {
  const itineraryType = `
type Activity = {
  time: "morning" | "afternoon" | "evening";
  title: string;
  description: string;
  estimatedCost: number;
  bookingUrl?: string;
};

type ItineraryDay = { day: number; date: string; title: string; activities: Activity[] };

type Itinerary = {
  destination: string;
  destinationAirportCode: string;
  summary: string;
  surpriseReason?: string;
  days: ItineraryDay[];
  costs: {
    flights: number; lodging: number; car: number;
    activities: number; food: number; total: number;
  };
  lodgingSuggestions: { type: "hotel" | "airbnb"; name: string; area: string; nightlyRate: number }[];
  needsCar: boolean;
};`;

  let systemPrompt = `Create a vacation itinerary as JSON only, matching this TypeScript type exactly:
${itineraryType}. No markdown, no commentary.
Rules: total cost must fit within $${basics.budgetMax}; include one entry per day for all ${basics.days} days; use realistic estimated prices in USD; set needsCar based on the destination.`;

  if (surprise) {
    systemPrompt += ` Choose a destination that suits the season of ${basics.startDate} and the budget, and fill surpriseReason with one sentence explaining why.`;
  }

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
    temperature: 0.7,
    max_tokens: 4000,
  });

  let content = response.choices[0].message.content || '';
  // Remove markdown code fences if present
  content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  return content;
}
