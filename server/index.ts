import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import type { TripBasics, ChatMessage } from '../src/lib/types';
import { chatWithAssistant, generateItinerary as generateItineraryAI } from './llm';
import { validateItinerary } from './validation';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { basics, messages } = req.body as { basics: TripBasics; messages: ChatMessage[] };

    const reply = await chatWithAssistant(basics, messages);
    const readyToPlan = reply.includes('[READY]');
    const cleanReply = reply.replace('[READY]', '').trim();

    res.json({ reply: cleanReply, readyToPlan });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
});

app.post('/api/itinerary', async (req: Request, res: Response) => {
  try {
    const { basics, messages, surprise } = req.body as {
      basics: TripBasics;
      messages: ChatMessage[];
      surprise: boolean;
    };

    let itinerary;
    let lastError;
    
    // Retry up to 3 times with exponential backoff for rate limiting
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const itineraryJson = await generateItineraryAI(basics, messages, surprise);
        itinerary = validateItinerary(itineraryJson);
        res.json(itinerary);
        return;
      } catch (error) {
        lastError = error;
        if (attempt < 2) {
          // Wait before retrying (1s, then 2s)
          await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
        }
      }
    }
    
    console.error('Itinerary error after retries:', lastError);
    res.status(500).json({ error: 'Failed to generate itinerary. Please try again in a moment.' });
  } catch (error) {
    console.error('Itinerary error:', error);
    res.status(500).json({ error: 'Failed to process your request. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`✈️ Wayfare server running on http://localhost:${PORT}`);
});
