import type { VercelRequest, VercelResponse } from '@vercel/node';
import Groq from 'groq-sdk';
import { z } from 'zod';
import type { TripBasics, ChatMessage, Itinerary } from '../src/lib/types';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const ITINERARY_MODEL = process.env.ITINERARY_LLM_MODEL || 'openai/gpt-oss-120b';

const ActivitySchema = z.object({
  time: z.enum(['morning', 'afternoon', 'evening']),
  title: z.string().min(1),
  description: z.string().min(1),
  estimatedCost: z.number().min(0),
  bookingUrl: z.string().optional(),
});

const ItineraryDaySchema = z.object({
  day: z.number().min(1),
  date: z.string(),
  title: z.string().min(1),
  activities: z.array(ActivitySchema).min(1),
});

const ItinerarySchema = z.object({
  destination: z.string().min(1),
  destinationAirportCode: z.string().min(2).max(3),
  summary: z.string().min(1),
  surpriseReason: z.string().optional(),
  days: z.array(ItineraryDaySchema),
  costs: z.object({
    flights: z.number().min(0),
    lodging: z.number().min(0),
    car: z.number().min(0),
    activities: z.number().min(0),
    food: z.number().min(0),
    total: z.number().min(0),
  }),
  lodgingSuggestions: z.array(
    z.object({
      type: z.enum(['hotel', 'airbnb', 'hostel']),
      name: z.string(),
      area: z.string(),
      nightlyRate: z.number().min(0),
    })
  ),
  needsCar: z.boolean(),
});

function validateItinerary(data: unknown): Itinerary {
  try {
    const validated = ItinerarySchema.parse(JSON.parse(String(data)));
    return validated;
  } catch (error) {
    console.error('Validation error:', error);
    throw new Error('Invalid itinerary format from AI');
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { basics, messages, surprise } = req.body as {
      basics: TripBasics;
      messages: ChatMessage[];
      surprise: boolean;
    };

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

    let systemPrompt = `Create a vacation itinerary as JSON only, matching this TypeScript type exactly:
${itineraryType}. No markdown, no commentary.
Rules: today's date is ${new Date().toISOString().slice(0, 10)}; every day's "date" field must be a real calendar date on or after today (never in the past) — ${basics.startDate ? `start from ${basics.startDate}` : 'choose a start date from the conversation, or a sensible upcoming date if none was given'}; ${basics.budget > 0 ? `total cost must fit within $${basics.budget}` : 'infer a reasonable total cost from the conversation and destination'}; ${basics.days > 0 ? `include one entry per day for all ${basics.days} days` : 'choose a sensible trip length (e.g. 4-7 days) based on the conversation'}; use realistic estimated prices in USD; set needsCar based on the destination; lodgingSuggestions[].type must be exactly one of "hotel", "airbnb", or "hostel" (lowercase, no other values).`;

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
      max_tokens: 4000,
    });

    let content = response.choices[0].message.content || '';
    // Remove markdown code fences if present
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');

    const itinerary = validateItinerary(content);
    res.json(itinerary);
  } catch (error) {
    console.error('Itinerary error:', error);
    res.status(500).json({ error: 'Failed to generate itinerary' });
  }
}
