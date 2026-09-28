import type { ItineraryDay } from '../lib/types';
import { buildViatorActivityLink } from '../lib/bookingLinks';

interface DayTimelineProps {
  day: ItineraryDay;
  destination: string;
}

export function DayTimeline({ day, destination }: DayTimelineProps) {
  return (
    <div className="card p-6 sm:p-8 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <span
          className="w-9 h-9 rounded-full text-white flex items-center justify-center font-semibold text-sm shrink-0 shadow-soft"
          style={{ background: 'linear-gradient(135deg, #555dff 0%, #555dffcc 100%)' }}
        >
          {day.day}
        </span>
        <div>
          <h3 className="text-xl font-serif font-bold text-ink">{day.title}</h3>
          <p className="text-sm text-gray-500">{day.date}</p>
        </div>
      </div>

      <div className="space-y-4">
        {day.activities.map((activity, idx: number) => (
          <div key={idx} className="bg-offwhite rounded-2xl p-4 sm:p-5">
            <div className="flex justify-between items-start gap-3 mb-2">
              <div>
                <span className="pill bg-[#555dff]/10 text-[#555dff] mb-1.5">{activity.time}</span>
                <h4 className="font-semibold text-ink">{activity.title}</h4>
              </div>
              <span className="pill bg-[#d5910c]/10 text-[#d5910c] shrink-0">
                ${activity.estimatedCost}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">{activity.description}</p>
            {activity.bookingUrl ? (
              <a
                href={activity.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-coral hover:text-coral/80 font-semibold"
              >
                View →
              </a>
            ) : (
              <a
                href={buildViatorActivityLink(activity.title, destination)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-coral hover:text-coral/80 font-semibold"
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
