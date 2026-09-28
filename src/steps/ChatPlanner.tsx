import { useState, useEffect, useRef } from 'react';
import {
  IconBeach,
  IconBuildingSkyscraper,
  IconMountain,
  IconGlassFull,
  IconYoga,
  IconBuildingBank,
  IconSparkles,
  IconSend,
  IconWand,
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
  const [showQuickReplies, setShowQuickReplies] = useState(
    () => !(state.messages.length === 1 && state.messages[0].role === 'user')
  );
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(state.messages.length);
  const hasKickedOffRef = useRef(false);

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

  const runAssistantTurn = async (currentMessages: typeof messages) => {
    setLoading(true);
    setError(null);
    try {
      const response = await sendChatMessage(tripBasics, currentMessages);
      const updatedMessages = [
        ...currentMessages,
        { role: 'assistant' as const, content: response.reply },
      ];
      dispatch({ type: 'SET_MESSAGES', payload: updatedMessages });

      if (response.readyToPlan) {
        const itinerary = await generateItinerary(tripBasics, updatedMessages, false);
        dispatch({ type: 'SET_ITINERARY', payload: itinerary });
        dispatch({ type: 'SET_STEP', payload: 3 });
      }
    } catch (err) {
      setError('Failed to process your request. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Themed-trip cards seed a single user message and skip straight to the LLM
  // for a reply (e.g. asking for or suggesting dates), instead of the quick replies.
  useEffect(() => {
    if (!hasKickedOffRef.current && messages.length === 1 && messages[0].role === 'user') {
      hasKickedOffRef.current = true;
      setShowQuickReplies(false);
      runAssistantTurn(messages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendMessage = async (text: string, surprise = false) => {
    if (!text.trim() && !surprise) return;

    const messageText = surprise ? 'Surprise me!' : text;
    const newMessages = [...messages, { role: 'user' as const, content: messageText }];
    dispatch({ type: 'SET_MESSAGES', payload: newMessages });
    setUserInput('');
    setShowQuickReplies(false);

    if (surprise) {
      setLoading(true);
      setError(null);
      try {
        const itinerary = await generateItinerary(tripBasics, newMessages, true);
        dispatch({ type: 'SET_ITINERARY', payload: itinerary });
        dispatch({ type: 'SET_STEP', payload: 3 });
      } catch (err) {
        setError('Failed to process your request. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      await runAssistantTurn(newMessages);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-gray-50 flex items-start sm:items-center justify-center px-4 py-6 sm:py-10 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 45%, rgba(135,128,255,0.16), transparent 70%)',
        }}
      />
      <div className="relative w-full max-w-2xl h-[min(44rem,calc(100vh-6rem))] card shadow-lifted border border-black/5 flex flex-col overflow-hidden">
        {/* Panel header */}
        <div className="px-6 py-5 border-b border-black/5 shrink-0">
          <h2 className="text-xl font-serif font-bold text-ink">Tell us about your ideal trip</h2>
        </div>

        {/* Scrollable message area */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {messages.map((msg, idx) => (
            <ChatBubble key={idx} message={msg.content} isUser={msg.role === 'user'} />
          ))}

          {showQuickReplies && messages.length === 1 && (
            <div className="mt-2 mb-6">
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
            <div className="text-callout shadow-[inset_0_0_0_1px_rgba(200,0,0,0.15)] bg-red-50 text-red-700 mb-6">
              <p>{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setLoading(false);
                }}
                className="btn btn-dark mt-3 py-1.5 text-sm"
              >
                Retry
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Composer */}
        <div className="px-4 sm:px-6 pt-3 pb-4 border-t border-black/5 bg-white/70 shrink-0">
          <button
            onClick={() => handleSendMessage('', true)}
            disabled={loading}
            className="btn btn-secondary btn-pill mx-auto mb-3 py-1.5 px-4 text-xs"
          >
            <IconWand size={14} className="text-ocean" />
            Build my itinerary
          </button>
          <div className="input-field flex items-center gap-2 rounded-full pl-5 pr-1.5 py-1.5">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(userInput)}
              placeholder="Type your response..."
              className="flex-1 bg-transparent focus:outline-none text-sm"
              disabled={loading}
            />
            <button
              onClick={() => handleSendMessage(userInput)}
              disabled={loading || !userInput.trim()}
              className="w-9 h-9 shrink-0 rounded-full bg-coral text-white flex items-center justify-center hover:bg-coral/90 disabled:bg-gray-300 transition-colors"
              aria-label="Send message"
            >
              <IconSend size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
