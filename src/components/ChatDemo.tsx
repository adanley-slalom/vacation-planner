import { useEffect, useRef, useState } from 'react';
import { IconSend } from '@tabler/icons-react';
import { ChatBubble, TypingIndicator } from './ChatBubble';

const SCRIPT: { role: 'user' | 'assistant'; content: string }[] = [
  {
    role: 'user',
    content: "I'd love a Northern Lights in Norway trip — fjords, arctic skies and dancing auroras.",
  },
  {
    role: 'assistant',
    content: 'That sounds magical! When are you hoping to travel? Late September to March is best for auroras.',
  },
  {
    role: 'user',
    content: "Flexible on dates. Budget is around $3,000 for 2 people.",
  },
  {
    role: 'assistant',
    content: "Perfect — building a 7-day Tromsø itinerary with aurora tours, a fjord cruise and cozy cabin stays.",
  },
];

// Reveals the scripted conversation on a loop, like a live product demo
export function ChatDemo() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const runStep = (index: number) => {
      if (cancelled) return;

      if (index >= SCRIPT.length) {
        timeoutId = setTimeout(() => {
          if (cancelled) return;
          setVisibleCount(0);
          setTyping(false);
          timeoutId = setTimeout(() => runStep(0), 500);
        }, 3000);
        return;
      }

      const message = SCRIPT[index];

      if (message.role === 'assistant') {
        setTyping(true);
        timeoutId = setTimeout(() => {
          if (cancelled) return;
          setTyping(false);
          setVisibleCount(index + 1);
          timeoutId = setTimeout(() => runStep(index + 1), 900);
        }, 1200);
      } else {
        timeoutId = setTimeout(() => {
          if (cancelled) return;
          setVisibleCount(index + 1);
          timeoutId = setTimeout(() => runStep(index + 1), 700);
        }, 600);
      }
    };

    runStep(0);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, []);

  const visibleMessages = SCRIPT.slice(0, visibleCount);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [visibleCount, typing]);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col w-full max-w-md">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50">
        <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-300" />
        <span className="ml-2 text-xs font-medium text-gray-400">Wayfare AI Chat</span>
        <span className="ml-auto flex items-center gap-1 text-[10px] font-semibold text-seaglass">
          <span className="w-1.5 h-1.5 rounded-full bg-seaglass animate-pulse" />
          LIVE
        </span>
      </div>

      <div ref={scrollRef} className="p-5 h-[280px] overflow-y-auto no-scrollbar">
        {visibleMessages.map((msg, idx) => (
          <ChatBubble key={idx} message={msg.content} isUser={msg.role === 'user'} />
        ))}
        <TypingIndicator isVisible={typing} />
      </div>

      {/* Non-interactive input bar, purely illustrative */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full pl-4 pr-1.5 py-1.5">
          <span className="flex-1 text-sm text-gray-400">Type your response...</span>
          <span className="w-8 h-8 shrink-0 rounded-full bg-coral text-white flex items-center justify-center">
            <IconSend size={14} />
          </span>
        </div>
      </div>
    </div>
  );
}
