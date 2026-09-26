import { useState, useEffect, useRef } from 'react';
import {
  IconBeach,
  IconBuildingSkyscraper,
  IconMountain,
  IconGlassFull,
  IconYoga,
  IconBuildingBank,
  IconSparkles,
} from '@tabler/icons-react';
import { ChatBubble, TypingIndicator, QuickReplies, QuickReplyChip } from '../components/ChatBubble';
import { sendChatMessage, generateItinerary } from '../lib/api';
import { useAppContext } from '../state/AppContext';

const QUICK_REPLIES = [
  { label: 'Beach', icon: <IconBeach size={16} /> },
  { label: 'City', icon: <IconBuildingSkyscraper size={16} /> },
  { label: 'Adventure', icon: <IconMountain size={16} /> },
  { label: "Food & wine", icon: <IconGlassFull size={16} /> },
  { label: 'Relaxation', icon: <IconYoga size={16} /> },
  { label: 'Culture & history', icon: <IconBuildingBank size={16} /> },
  { label: 'Surprise me', icon: <IconSparkles size={16} /> },
];

export function ChatPlannerStep() {
  const { state, dispatch } = useAppContext();
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(state.messages.length);

  const tripBasics = state.tripBasics!;
  const messages = state.messages;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Only scroll when new messages are appended, not on initial mount (StrictMode-safe)
  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      scrollToBottom();
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages]);

  const handleSendMessage = async (text: string, surprise = false) => {
    if (!text.trim() && !surprise) return;

    const messageText = surprise ? 'Surprise me!' : text;
    const newMessages = [...messages, { role: 'user' as const, content: messageText }];
    dispatch({ type: 'SET_MESSAGES', payload: newMessages });
    setUserInput('');
    setLoading(true);
    setError(null);
    setShowQuickReplies(false);

    try {
      if (surprise) {
        // Generate itinerary directly for surprise
        const itinerary = await generateItinerary(tripBasics, newMessages, true);
        dispatch({ type: 'SET_ITINERARY', payload: itinerary });
        dispatch({ type: 'SET_STEP', payload: 3 });
      } else {
        const response = await sendChatMessage(tripBasics, newMessages);
        const assistantMessage = response.reply;
        const updatedMessages = [
          ...newMessages,
          { role: 'assistant' as const, content: assistantMessage },
        ];
        dispatch({ type: 'SET_MESSAGES', payload: updatedMessages });

        if (response.readyToPlan) {
          // Auto-generate itinerary
          const itinerary = await generateItinerary(tripBasics, updatedMessages, false);
          dispatch({ type: 'SET_ITINERARY', payload: itinerary });
          dispatch({ type: 'SET_STEP', payload: 3 });
        }
      }
    } catch (err) {
      setError('Failed to process your request. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto h-screen flex flex-col bg-gradient-to-b from-offwhite to-white">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-serif font-bold text-ink">Tell us about your ideal trip</h2>
        </div>

        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <ChatBubble key={idx} message={msg.content} isUser={msg.role === 'user'} />
          ))}

          {showQuickReplies && messages.length === 1 && (
            <div className="mt-6">
              <QuickReplies>
                {QUICK_REPLIES.map((reply) => (
                  <QuickReplyChip
                    key={reply.label}
                    label={reply.label}
                    icon={reply.icon}
                    onClick={() =>
                      handleSendMessage(reply.label, reply.label === 'Surprise me')
                    }
                  />
                ))}
              </QuickReplies>
            </div>
          )}

          <TypingIndicator isVisible={loading} />

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setLoading(false);
                }}
                className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                Retry
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-gray-200 bg-white p-6">
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(userInput)}
            placeholder="Type your response..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-ocean"
            disabled={loading}
          />
          <button
            onClick={() => handleSendMessage(userInput)}
            disabled={loading || !userInput.trim()}
            className="px-6 py-2 bg-coral text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-400 transition-colors"
          >
            Send
          </button>
        </div>
        <button
          onClick={() => handleSendMessage('', true)}
          disabled={loading}
          className="w-full px-4 py-2 bg-seaglass text-ink rounded-lg hover:bg-opacity-80 disabled:bg-gray-400 transition-colors font-medium"
        >
          Build my itinerary
        </button>
      </div>
    </div>
  );
}
