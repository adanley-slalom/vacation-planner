import type { ItineraryDay } from '../lib/types';
import { buildViatorActivityLink } from '../lib/bookingLinks';
import { formatDisplayDate } from '../lib/dates';

interface DayTimelineProps {
  day: ItineraryDay;
  destination: string;
}

export function DayTimeline({ day, destination }: DayTimelineProps) {
  return (
    <div className="card p-8 sm:p-10 mb-8">
      <div className="flex items-center gap-4 mb-8">
        <span
          className="w-11 h-11 rounded-full text-white flex items-center justify-center font-semibold text-base shrink-0 shadow-soft"
          style={{ background: 'linear-gradient(135deg, #555dff 0%, #555dffcc 100%)' }}
        >
          {day.day}
        </span>
        <div>
          <h3 className="text-2xl font-serif font-bold text-ink">{day.title}</h3>
          <p className="text-base text-gray-500">{formatDisplayDate(day.date)}</p>
        </div>
      </div>

      <div className="space-y-5">
        {day.activities.map((activity, idx: number) => (
          <div key={idx} className="bg-offwhite rounded-2xl p-6">
            <div className="flex justify-between items-start gap-3 mb-3">
              <div>
                <span className="pill bg-[#555dff]/10 text-[#555dff] mb-2">{activity.time}</span>
                <h4 className="font-semibold text-ink text-lg">{activity.title}</h4>
              </div>
              <span className="pill bg-[#d5910c]/10 text-[#d5910c] shrink-0">
                ${activity.estimatedCost}
              </span>
            </div>
            <p className="text-base text-gray-600 mb-4 leading-relaxed">{activity.description}</p>
            {activity.bookingUrl ? (
              <a
                href={activity.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-coral hover:text-coral/80 font-semibold"
              >
                View →
              </a>
            ) : (
              <a
                href={buildViatorActivityLink(activity.title, destination)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-coral hover:text-coral/80 font-semibold"
              >
                Find activity →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
