import { z } from 'zod';
import type { Itinerary } from '../src/lib/types';

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

export function validateItinerary(data: unknown): Itinerary {
  try {
    const validated = ItinerarySchema.parse(JSON.parse(String(data)));
    return validated;
  } catch (error) {
    console.error('Validation error:', error);
    throw new Error('Invalid itinerary format from AI');
  }
}
