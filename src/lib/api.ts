import type { TripBasics, ChatMessage, Itinerary } from './types';

const API_BASE = process.env.VITE_API_URL || 'http://localhost:3001/api';

export async function sendChatMessage(
  basics: TripBasics,
  messages: ChatMessage[]
): Promise<{ reply: string; readyToPlan: boolean }> {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ basics, messages }),
  });

  if (!response.ok) {
    throw new Error('Failed to get chat response');
  }

  return response.json();
}

export async function generateItinerary(
  basics: TripBasics,
  messages: ChatMessage[],
  surprise: boolean
): Promise<Itinerary> {
  const response = await fetch(`${API_BASE}/itinerary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ basics, messages, surprise }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate itinerary');
  }

  return response.json();
}
