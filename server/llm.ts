import Groq from 'groq-sdk';
import type { TripBasics, ChatMessage } from '../src/lib/types';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = process.env.LLM_MODEL || 'qwen/qwen3.8-27b';
// Itinerary generation needs a much larger output than chat; use the same model
// but with reduced tokens to stay within free tier rate limits.
const ITINERARY_MODEL = process.env.ITINERARY_LLM_MODEL || 'qwen/qwen3.8-27b';

export async function chatWithAssistant(basics: TripBasics, messages: ChatMessage[]): Promise<string> {
  const hasDates = Boolean(basics.startDate && basics.endDate);
  const hasBudget = basics.budget > 0;

  const tripDetails = [
    hasDates
      ? `${basics.days} days from ${basics.startDate} to ${basics.endDate}`
      : 'no travel dates chosen yet',
    hasBudget ? `a total budget of $${basics.budget}` : 'no budget specified yet',
    `for ${basics.travelers || 1} traveler(s)`,
  ].join(', ');

  const missingDatesInstruction = !hasDates
    ? ' The user has not picked travel dates yet — ask what dates they have in mind, or if they seem flexible, recommend a good time of year to go based on the trip theme and move on.'
    : '';

  const systemPrompt = `You are a friendly travel planner. Today's date is ${new Date().toISOString().slice(0, 10)}. The user's trip: ${tripDetails}.${missingDatesInstruction} Ask at most 2 short follow-up questions to understand their preferences, one at a time. Keep replies under 60 words. When you have enough information, end your reply with the exact token [READY]`;

  const response = await groq.chat.completions.create({
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
  lodgingSuggestions: { type: "hotel" | "airbnb" | "hostel"; name: string; area: string; nightlyRate: number }[];
  needsCar: boolean;
};`;

  let systemPrompt = `You MUST respond with ONLY valid JSON, nothing else. No markdown, no commentary, no extra text.
JSON schema:
${itineraryType}

Rules:
- Generate ONLY JSON - do not include code fences or any text outside the JSON
- All string values MUST use double quotes only
- All property names MUST be exactly as shown (double-quoted)
- Dates must be real calendar dates on or after today (${new Date().toISOString().slice(0, 10)})
- ${basics.startDate ? `Start from ${basics.startDate}` : 'Choose a sensible start date'}
- ${basics.budget > 0 ? `Total cost must fit within $${basics.budget}` : 'Infer reasonable cost'}
- ${basics.days > 0 ? `Include exactly ${basics.days} days of activities` : 'Create 4-7 days'}
- Use realistic USD prices
- lodgingSuggestions[].type must be exactly "hotel", "airbnb", or "hostel" (lowercase only)
- Ensure every JSON array and object is properly closed`

  if (surprise) {
    systemPrompt += basics.startDate
      ? ` Choose a destination that suits the season of ${basics.startDate} and the budget, and fill surpriseReason with one sentence explaining why.`
      : ` Choose a destination that suits the conversation and budget, and fill surpriseReason with one sentence explaining why.`;
  }

  const response = await groq.chat.completions.create({
    model: ITINERARY_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  let content = response.choices[0].message.content || '';
  // Remove markdown code fences if present
  content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  return content;
}
