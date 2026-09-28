import type { ReactNode } from 'react';

interface BookingCardProps {
  title: string;
  description: string;
  bookingUrl: string;
  icon?: ReactNode;
  accent?: string;
}

export function BookingCard({ title, description, bookingUrl, icon, accent = '#555dff' }: BookingCardProps) {
  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-white shadow-soft"
          style={{ background: `linear-gradient(135deg, ${accent} 0%, ${accent}cc 100%)` }}
        >
          {icon}
        </div>
        <h4 className="font-semibold text-ink text-base">{title}</h4>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-primary py-2.5 text-sm w-fit"
      >
        Book now
      </a>
    </div>
  );
}
