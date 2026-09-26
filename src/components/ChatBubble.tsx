import type { ReactNode } from 'react';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
}

export function ChatBubble({ message, isUser }: ChatBubbleProps) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
          isUser
            ? 'bg-ocean text-offwhite rounded-br-none'
            : 'bg-sand text-ink rounded-bl-none'
        }`}
      >
        <p className="text-sm leading-relaxed">{message}</p>
      </div>
    </div>
  );
}

interface TypingIndicatorProps {
  isVisible: boolean;
}

export function TypingIndicator({ isVisible }: TypingIndicatorProps) {
  if (!isVisible) return null;

  return (
    <div className="flex gap-2 mb-4">
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  );
}

interface QuickRepliesProps {
  children: ReactNode;
}

export function QuickReplies({ children }: QuickRepliesProps) {
  return <div className="flex flex-wrap gap-2 mb-6">{children}</div>;
}

interface QuickReplyChipProps {
  label: string;
  onClick: () => void;
  icon?: string;
}

export function QuickReplyChip({ label, onClick, icon }: QuickReplyChipProps) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-seaglass text-ink rounded-full text-sm font-medium hover:bg-opacity-80 transition-colors"
    >
      {icon && <span className="mr-1">{icon}</span>}
      {label}
    </button>
  );
}
