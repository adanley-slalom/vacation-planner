import { useState } from 'react';
import { IconRobot, IconMessageCircle } from '@tabler/icons-react';
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
      budget: 0,
      startDate: '',
      endDate: '',
      days: 0,
      origin: '',
      travelers: 1,
    }
  );

  const isValid =
    formData.budget > 0 &&
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
            content: `You've got ${formData.days} days and a $${formData.budget.toLocaleString()} budget. What kind of trip are you in the mood for?`,
          },
        ],
      });
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div 
        className="min-h-screen flex flex-col items-center justify-center relative bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1920&q=80")',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 text-center mb-12 max-w-2xl px-4">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-4">
            Plan your trip with AI.
          </h1>
          <p className="text-xl md:text-2xl font-sans text-white/90">
            Get a personalized itinerary in minutes.
          </p>
        </div>

        {/* Form Card */}
        <div id="trip-form" className="relative z-10 w-full max-w-4xl bg-white rounded-3xl shadow-lg p-8 mb-8 mx-4">
          {/* Main Form Row */}
          <div className="flex gap-4 items-end">
            {/* Budget Field - Left */}
            <div className="flex-1">
              <BudgetInput
                value={formData.budget}
                onChange={(budget) => setFormData({ ...formData, budget })}
              />
            </div>

            {/* Date Range Field - Middle */}
            <div className="flex-1">
              <DateRangePicker
                startDate={formData.startDate}
                endDate={formData.endDate}
                onDatesChange={(startDate, endDate, days) =>
                  setFormData({ ...formData, startDate, endDate, days })
                }
              />
            </div>

            {/* Button */}
            <button
              onClick={handleContinue}
              disabled={!isValid}
              className={`px-8 py-5 border border-transparent rounded-lg text-lg font-semibold text-white transition-colors whitespace-nowrap ${
                isValid
                  ? 'bg-coral hover:bg-orange-600 cursor-pointer'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Let's go
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full px-4 py-8 flex-1">
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
            <div className="w-9 h-9 rounded-full bg-ocean text-offwhite flex items-center justify-center shrink-0">
              <IconRobot size={18} />
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
            <div className="w-9 h-9 rounded-full bg-seaglass text-ink flex items-center justify-center shrink-0">
              <IconMessageCircle size={18} />
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
    </div>
  );
}
