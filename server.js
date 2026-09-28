#!/usr/bin/env node
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const Groq = require('groq-sdk');

const app = express();
const PORT = process.env.PORT || 3000;

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = process.env.LLM_MODEL || 'qwen/qwen3.8-27b';
const ITINERARY_MODEL = process.env.ITINERARY_LLM_MODEL || 'openai/gpt-oss-120b';

app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'dist')));

app.post('/api/chat', async (req, res) => {
  try {
    const { basics, messages } = req.body;

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

    const reply = response.choices[0].message.content || '';
    const readyToPlan = reply.includes('[READY]');
    const cleanReply = reply.replace('[READY]', '').trim();

    res.json({ reply: cleanReply, readyToPlan });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
});

app.post('/api/itinerary', async (req, res) => {
  try {
    const { basics, messages, surprise } = req.body;

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
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');

    const itinerary = JSON.parse(content);
    res.json(itinerary);
  } catch (error) {
    console.error('Itinerary error:', error);
    res.status(500).json({ error: 'Failed to generate itinerary' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Catch-all: serve index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
