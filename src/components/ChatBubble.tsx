import type { ReactNode } from 'react';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
}

export function ChatBubble({ message, isUser }: ChatBubbleProps) {
  if (isUser) {
    return (
      <div className="flex justify-end mb-6">
        <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl rounded-br-none bg-[linear-gradient(135deg,#555dff_0%,#555dffcc_100%)] text-white shadow-soft">
          <p className="text-sm leading-relaxed">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <p className="text-[15px] leading-relaxed text-ink">{message}</p>
    </div>
  );
}

interface TypingIndicatorProps {
  isVisible: boolean;
}

export function TypingIndicator({ isVisible }: TypingIndicatorProps) {
  if (!isVisible) return null;

  return (
    <div className="mb-6">
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
  icon?: ReactNode;
}

export function QuickReplyChip({ label, onClick, icon }: QuickReplyChipProps) {
  return (
    <button
      onClick={onClick}
      className="btn btn-secondary btn-pill py-2 text-sm"
    >
      {icon}
      {label}
    </button>
  );
}
