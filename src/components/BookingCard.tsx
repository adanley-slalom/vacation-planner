import type { ReactNode } from 'react';

interface BookingCardProps {
  title: string;
  description: string;
  bookingUrl: string;
  icon?: ReactNode;
}

export function BookingCard({ title, description, bookingUrl, icon }: BookingCardProps) {
  return (
    <div className="bg-offwhite p-4 rounded-lg border border-gray-200">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <h4 className="font-semibold text-ink">{title}</h4>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-4 py-2 bg-coral text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
      >
        Book now
      </a>
    </div>
  );
}
