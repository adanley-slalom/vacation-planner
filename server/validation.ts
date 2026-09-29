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
    let jsonStr = String(data).trim();
    
    // Attempt to repair common JSON formatting issues from LLM output
    try {
      // Remove markdown code fences if present
      jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Fix single quotes to double quotes (but preserve apostrophes in text)
      // This is a bit tricky - only replace quotes that are around keys or wrapping values
      jsonStr = jsonStr.replace(/: '/g, ': "').replace(/', /g, '", ');
      jsonStr = jsonStr.replace(/: "/g, ': "'); // Fix double conversion
      
      // Ensure the JSON ends properly
      if (!jsonStr.endsWith('}')) {
        // Find the last complete object closing
        const lastBrace = jsonStr.lastIndexOf('}');
        if (lastBrace > 0) {
          jsonStr = jsonStr.substring(0, lastBrace + 1);
        }
      }
      
      JSON.parse(jsonStr);
    } catch (repairError) {
      // If repair didn't work, try without repair
      jsonStr = String(data).trim();
    }
    
    const validated = ItinerarySchema.parse(JSON.parse(jsonStr));
    return validated;
  } catch (error) {
    console.error('Validation error:', error);
    throw new Error('Invalid itinerary format from AI');
  }
}
