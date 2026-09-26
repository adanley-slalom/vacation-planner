import type { ItineraryDay } from '../lib/types';
import { buildViatorActivityLink } from '../lib/bookingLinks';

interface DayTimelineProps {
  day: ItineraryDay;
  destination: string;
}

export function DayTimeline({ day, destination }: DayTimelineProps) {
  return (
    <div className="mb-8 pb-8 border-b border-gray-200 last:border-b-0">
      <div className="mb-4">
        <h3 className="text-xl font-serif font-bold text-ocean">{day.title}</h3>
        <p className="text-sm text-gray-600">{day.date}</p>
      </div>

      <div className="space-y-4">
        {day.activities.map((activity, idx: number) => (
          <div key={idx} className="bg-offwhite p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-xs font-semibold text-seaglass uppercase">
                  {activity.time}
                </span>
                <h4 className="font-semibold text-ink mt-1">{activity.title}</h4>
              </div>
              <span className="text-sm font-semibold text-coral">
                ${activity.estimatedCost}
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-3">{activity.description}</p>
            {activity.bookingUrl ? (
              <a
                href={activity.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-coral hover:text-orange-600 font-medium"
              >
                View →
              </a>
            ) : (
              <a
                href={buildViatorActivityLink(activity.title, destination)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-coral hover:text-orange-600 font-medium"
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
