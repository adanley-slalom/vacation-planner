const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = process.env.LLM_MODEL || 'qwen/qwen3.8-27b';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

    res.status(200).json({ reply: cleanReply, readyToPlan });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat request', details: error.message });
  }
};
