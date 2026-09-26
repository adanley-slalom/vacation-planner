import type { ReactNode } from 'react';
import { IconRobot } from '@tabler/icons-react';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
}

export function ChatBubble({ message, isUser }: ChatBubbleProps) {
  if (isUser) {
    return (
      <div className="flex justify-end mb-6">
        <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl rounded-br-md bg-ocean text-offwhite">
          <p className="text-sm leading-relaxed">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 mb-6">
      <div className="w-8 h-8 rounded-full bg-ocean text-offwhite flex items-center justify-center shrink-0">
        <IconRobot size={16} />
      </div>
      <p className="text-[15px] leading-relaxed text-ink pt-1">{message}</p>
    </div>
  );
}

interface TypingIndicatorProps {
  isVisible: boolean;
}

export function TypingIndicator({ isVisible }: TypingIndicatorProps) {
  if (!isVisible) return null;

  return (
    <div className="flex gap-3 mb-6">
      <div className="w-8 h-8 rounded-full bg-ocean text-offwhite flex items-center justify-center shrink-0">
        <IconRobot size={16} />
      </div>
      <div className="flex items-center gap-1 pt-3">
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
      className="px-4 py-2 bg-seaglass text-ink rounded-full text-sm font-medium hover:bg-opacity-80 transition-colors flex items-center gap-1.5"
    >
      {icon}
      {label}
    </button>
  );
}
