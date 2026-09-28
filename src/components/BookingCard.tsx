import type { ReactNode } from 'react';

interface BookingCardProps {
  title: string;
  primary: string;
  meta?: (string | undefined | false)[];
  bookingUrl: string;
  icon?: ReactNode;
  accent?: string;
}

export function BookingCard({ title, primary, meta, bookingUrl, icon, accent = '#555dff' }: BookingCardProps) {
  const metaLines = (meta ?? []).filter((line): line is string => Boolean(line));

  return (
    <div className="card p-6 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-white shadow-soft"
          style={{ background: `linear-gradient(135deg, ${accent} 0%, ${accent}cc 100%)` }}
        >
          {icon}
        </div>
        <h4 className="font-semibold text-ink text-lg">{title}</h4>
      </div>
      <div>
        <p className="text-base font-medium text-ink">{primary}</p>
        {metaLines.map((line, idx) => (
          <p key={idx} className="text-sm text-gray-500 mt-0.5">{line}</p>
        ))}
      </div>
      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-dark py-3 text-base w-fit"
      >
        Book now
      </a>
    </div>
  );
}
