import { useState } from 'react';
import { BudgetInput } from '../components/BudgetInput';
import { TravelersInput } from '../components/TravelersInput';
import { DateRangePicker } from '../components/DateRangePicker';
import { ChatDemo } from '../components/ChatDemo';
import type { TripBasics } from '../lib/types';
import { useAppContext } from '../state/AppContext';

const INSPIRATION_TRIPS = [
  {
    title: 'Caribbean Escape',
    subtitle: 'Sun, sand and slow mornings',
    img: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=500&q=80',
  },
  {
    title: 'Grand Japan Adventure',
    subtitle: 'Temples, cherry blossoms and neon streets',
    img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=500&q=80',
  },
  {
    title: 'African Safari',
    subtitle: 'Trails, peaks and open air',
    img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=500&q=80',
  },
  {
    title: 'Northern Lights in Norway',
    subtitle: 'Fjords, arctic skies and dancing auroras',
    img: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=500&q=80',
  },
  {
    title: 'Inca Trail Odyssey',
    subtitle: 'Mountain passes and Machu Picchu at dawn',
    img: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=500&q=80',
  },
  {
    title: 'Culture & History Tour',
    subtitle: 'Old streets and living stories',
    img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=500&q=80',
  },
  {
    title: 'Greek Island Hopping',
    subtitle: 'Whitewashed villages and turquoise coves',
    img: 'https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?auto=format&fit=crop&w=500&q=80',
  },
  {
    title: 'Iceland Ring Road',
    subtitle: 'Glaciers, waterfalls and endless daylight',
    img: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=500&q=80',
  },
  {
    title: 'Egyptian Pyramids Expedition',
    subtitle: 'Ancient wonders along the Nile',
    img: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=500&q=80',
  },
  {
    title: 'Bali Temple Retreat',
    subtitle: 'Rice terraces, incense and ocean sunsets',
    img: 'https://images.unsplash.com/photo-1573790387438-4da905039392?auto=format&fit=crop&w=500&q=80',
  },
  {
    title: 'New York City Lights',
    subtitle: 'Skyscrapers, Broadway and rooftop views',
    img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=500&q=80',
  },
  {
    title: 'Sydney Harbour Escape',
    subtitle: 'Beaches, the Opera House and coastal walks',
    img: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=500&q=80',
  },
];

export function TripBasicsStep() {
  const { state, dispatch } = useAppContext();
  const [formData, setFormData] = useState<TripBasics>(
    state.tripBasics || {
      budget: 2500,
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

  const startThemedChat = (trip: { title: string; subtitle: string }) => {
    dispatch({ type: 'SET_TRIP_BASICS', payload: formData });
    dispatch({ type: 'SET_STEP', payload: 2 });
    dispatch({
      type: 'SET_MESSAGES',
      payload: [
        {
          role: 'user',
          content: `I'd love a ${trip.title} trip — ${trip.subtitle}.`,
        },
      ],
    });
  };

  return (
    <div>
      {/* Hero Section */}
      <div 
        id="hero-section"
        className="min-h-[90vh] flex flex-col items-center justify-center relative bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1698307781486-7c63dadf5fb7?auto=format&fit=crop&w=1920&q=80")',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 text-center mb-14 max-w-7xl px-4">
          <h1 className="text-[clamp(2.25rem,5.5vw,5.5rem)] font-serif font-bold text-white mb-6 leading-[1.05] sm:whitespace-nowrap">
            Plan <span className="italic">less</span>. Travel <span className="italic">more</span>.
          </h1>
          <p className="text-2xl md:text-3xl font-sans text-white/90">
            Let Wayfare AI plan your perfect trip in minutes.
          </p>
        </div>

        {/* Form Card */}
        <div id="trip-form" className="relative z-10 w-full max-w-5xl card shadow-lifted p-10 mb-8 mx-4">
          {/* Main Form Row */}
          <div className="flex flex-wrap gap-5 items-end">
            {/* Budget Field */}
            <div className="flex-1 min-w-[10rem]">
              <label className="block text-base font-medium text-ink mb-2">Budget</label>
              <BudgetInput
                value={formData.budget}
                onChange={(budget) => setFormData({ ...formData, budget })}
              />
            </div>

            {/* Travelers Field */}
            <div className="w-40">
              <label className="block text-base font-medium text-ink mb-2">Travelers</label>
              <TravelersInput
                value={formData.travelers}
                onChange={(travelers) => setFormData({ ...formData, travelers })}
              />
            </div>

            {/* Date Range Field */}
            <div className="flex-1 min-w-[12rem]">
              <label className="block text-base font-medium text-ink mb-2">Trip Dates</label>
              <DateRangePicker
                startDate={formData.startDate}
                endDate={formData.endDate}
                onDatesChange={(startDate, endDate, days) =>
                  setFormData({ ...formData, startDate, endDate, days })
                }
              />
            </div>

            {/* Button */}
            <div>
              <label className="block text-base font-medium text-ink mb-2 opacity-0 select-none" aria-hidden="true">
                Go
              </label>
              <button
                onClick={handleContinue}
                disabled={!isValid}
                className="btn btn-dark py-5 px-8 text-lg whitespace-nowrap"
              >
                Let's go
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full py-16 flex-1">
        <div className="mt-8">
          <h2 className="text-center text-4xl md:text-5xl font-serif font-bold text-ink mb-4">
            From a few words to a <span className="italic">full itinerary</span>
          </h2>
          <p className="text-center text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            No forms, no spreadsheets — just chat with Wayfare AI and watch your trip take shape in real time.
          </p>
        <div className="relative rounded-2xl overflow-hidden bg-ocean flex flex-col md:flex-row min-h-[560px] md:min-h-[480px] shadow-card">
          {/* Image side */}
          <div className="relative md:w-1/2 h-64 md:h-auto shrink-0">
            <img
              src="https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1200&q=80"
              alt="Northern lights over a snowy fjord in Norway"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-ocean/80 via-ocean/10 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 text-white">
              <div className="text-sm font-semibold uppercase tracking-wider text-white/70 mb-3">
                See it in action
              </div>
              <div className="text-3xl md:text-4xl font-serif font-bold leading-tight">
                Just chat.<br />We'll build the trip.
              </div>
            </div>
          </div>

          {/* Live chat demo side */}
          <div className="md:w-1/2 flex items-center justify-center p-8 md:p-12 bg-gradient-to-br from-seaglass/10 via-white to-sand/20">
            <ChatDemo />
          </div>
        </div>
      </div>
      </div>

      {/* Trips tailored to you - full-bleed rotating showcase */}
      <div className="mt-16 relative overflow-hidden bg-gradient-to-br from-seaglass/20 via-sand/30 to-coral/10 py-20">
        <div className="absolute -top-16 -left-16 w-72 h-72 bg-seaglass/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-coral/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative text-center mb-14 px-4">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-ink mb-3">
            Discover your next <span className="italic">adventure</span>
          </h2>
          <p className="text-lg text-gray-600">
            Browse inspiring destinations. AI builds your perfect itinerary in minutes.
          </p>
        </div>

        <div className="marquee-container relative overflow-hidden">
          <div className="flex gap-6 w-max animate-marquee">
            {[...INSPIRATION_TRIPS, ...INSPIRATION_TRIPS].map((trip, idx) => (
              <div
                key={`${trip.title}-${idx}`}
                className="relative h-80 w-[26rem] shrink-0 rounded-2xl overflow-hidden group cursor-pointer shadow-card hover:shadow-lifted transition-all"
                onClick={() => startThemedChat(trip)}
              >
                <img
                  src={trip.img}
                  alt={trip.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="text-lg font-semibold text-white">{trip.title}</div>
                  <div className="text-sm text-white/80">{trip.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-center mt-10">
          <button
            onClick={() => dispatch({ type: 'SET_STEP', payload: 4 })}
            className="btn btn-dark"
          >
            View All
          </button>
        </div>
      </div>
    </div>
  );
}
