import { useState } from 'react';
import { BudgetInput } from '../components/BudgetInput';
import { DateRangePicker } from '../components/DateRangePicker';
import type { TripBasics } from '../lib/types';
import { useAppContext } from '../state/AppContext';

const INSPIRATION_TRIPS = [
  {
    title: 'Beach Escape',
    subtitle: 'Sun, sand and slow mornings',
    img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80',
  },
  {
    title: 'City Break',
    subtitle: 'Skylines, food halls and nightlife',
    img: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=500&q=80',
  },
  {
    title: 'Adventure Trip',
    subtitle: 'Trails, peaks and open air',
    img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=500&q=80',
  },
  {
    title: 'Food & Wine Journey',
    subtitle: 'Vineyards, tastings and local flavor',
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=500&q=80',
  },
  {
    title: 'Relaxation Retreat',
    subtitle: 'Spas, quiet and doing nothing',
    img: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=500&q=80',
  },
  {
    title: 'Culture & History Tour',
    subtitle: 'Old streets and living stories',
    img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=500&q=80',
  },
];

export function TripBasicsStep() {
  const { state, dispatch } = useAppContext();
  const [formData, setFormData] = useState<TripBasics>(
    state.tripBasics || {
      budgetMin: 1000,
      budgetMax: 5000,
      startDate: '',
      endDate: '',
      days: 0,
      origin: '',
      travelers: 1,
    }
  );

  const isValid =
    formData.budgetMin > 0 &&
    formData.budgetMax > formData.budgetMin &&
    formData.startDate &&
    formData.endDate &&
    formData.travelers > 0;

  const scrollToForm = () => {
    document.getElementById('trip-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleContinue = () => {
    if (isValid) {
      dispatch({ type: 'SET_TRIP_BASICS', payload: formData });
      dispatch({ type: 'SET_STEP', payload: 2 });
      dispatch({
        type: 'SET_MESSAGES',
        payload: [
          {
            role: 'assistant',
            content: `You've got ${formData.days} days and a $${formData.budgetMin.toLocaleString()}–${formData.budgetMax.toLocaleString()} budget. What kind of trip are you in the mood for?`,
          },
        ],
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <span className="block text-sm font-bold tracking-wide uppercase text-coral mb-4">
          AI trip planner
        </span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-ink mb-3">
          Plan your trip <span className="italic">with AI</span>.
        </h1>
        <p className="text-gray-600 text-lg max-w-lg mx-auto">
          Tell us your budget and dates — get a personalized, day-by-day itinerary in minutes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <div className="bg-ocean text-offwhite rounded-2xl p-6 md:p-8">
          <div className="text-3xl mb-3">🤖</div>
          <div className="text-2xl font-serif font-bold mb-1">AI-powered</div>
          <div className="text-sm text-offwhite/80">Built by AI, not templates</div>
        </div>
        <div className="bg-coral text-offwhite rounded-2xl p-6 md:p-8">
          <div className="text-3xl mb-3">💰</div>
          <div className="text-2xl font-serif font-bold mb-1">Budget-smart</div>
          <div className="text-sm text-offwhite/80">Fits the number you give us</div>
        </div>
        <div className="bg-seaglass text-ink rounded-2xl p-6 md:p-8">
          <div className="text-3xl mb-3">⚡</div>
          <div className="text-2xl font-serif font-bold mb-1">Instant itinerary</div>
          <div className="text-sm text-ink/70">Ready in minutes, not days</div>
        </div>
      </div>

      <div id="trip-form" className="space-y-8 bg-offwhite p-8 rounded-xl">
        <div>
          <label className="block text-sm font-medium text-ink mb-2">Budget range</label>
          <BudgetInput
            min={formData.budgetMin}
            max={formData.budgetMax}
            onChange={(min, max) => setFormData({ ...formData, budgetMin: min, budgetMax: max })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-2">Trip dates</label>
          <DateRangePicker
            startDate={formData.startDate}
            endDate={formData.endDate}
            onDatesChange={(start, end, days) =>
              setFormData({ ...formData, startDate: start, endDate: end, days })
            }
          />
        </div>

        <button
          onClick={handleContinue}
          disabled={!isValid}
          className={`w-full py-3 rounded-full font-semibold text-white transition-colors ${
            isValid
              ? 'bg-coral hover:bg-orange-600 cursor-pointer'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
        <p className="text-center text-xs text-gray-500 -mt-4">
          Free to use · Takes about 2 minutes · No signup required
        </p>
      </div>

      <div className="mt-16">
        <h2 className="text-center text-3xl md:text-4xl font-serif font-bold text-ink mb-6">
          <span className="bg-sand px-2">For trips you can't afford to get wrong.</span>
        </h2>
        <div className="relative rounded-2xl overflow-hidden h-[380px] md:h-[440px]">
          <img
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80"
            alt="Traveler overlooking a mountain landscape"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute top-4 left-4 md:top-6 md:left-6 flex items-start gap-2 max-w-[240px]">
            <div className="w-9 h-9 rounded-full bg-ocean text-offwhite flex items-center justify-center text-sm shrink-0">
              🤖
            </div>
            <div className="bg-white rounded-2xl rounded-tl-none shadow-lg p-3">
              <div className="text-xs font-semibold text-coral mb-1">Wayfare AI</div>
              <p className="text-xs text-ink">
                I compared hundreds of destinations and built a 5-day trip around your{' '}
                <strong>exact dates and budget</strong>.
              </p>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 flex items-end gap-2 max-w-[260px]">
            <div className="bg-white rounded-2xl rounded-br-none shadow-lg p-3">
              <div className="text-xs font-semibold text-coral mb-1">Wayfare AI</div>
              <p className="text-xs text-ink">
                Tell me <strong>adventure</strong>, <strong>relaxation</strong>, or anything in
                between — I'll rebuild the whole itinerary in seconds.
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-seaglass text-ink flex items-center justify-center text-sm shrink-0">
              💬
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 relative overflow-hidden rounded-2xl bg-gradient-to-br from-seaglass/30 via-sand/40 to-coral/10 p-8 md:p-12">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-seaglass/40 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-coral/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-ink mb-2">
            Trips <span className="italic">tailored</span> to you
          </h2>
          <p className="text-gray-600">
            Real itineraries built by Wayfare AI for real budgets and dates
          </p>
        </div>

        <div className="relative grid grid-cols-2 md:grid-cols-3 gap-4">
          {INSPIRATION_TRIPS.map((trip) => (
            <div
              key={trip.title}
              className="relative h-40 rounded-xl overflow-hidden group cursor-pointer"
              onClick={scrollToForm}
            >
              <img
                src={trip.img}
                alt={trip.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="text-sm font-semibold text-white">{trip.title}</div>
                <div className="text-xs text-white/80">{trip.subtitle}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative text-center mt-8">
          <button
            onClick={scrollToForm}
            className="px-8 py-3 bg-ink text-white rounded-full font-semibold hover:bg-black transition-colors cursor-pointer"
          >
            Start planning your trip
          </button>
        </div>
      </div>
    </div>
  );
}
