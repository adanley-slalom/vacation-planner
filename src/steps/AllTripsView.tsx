import { useAppContext } from '../state/AppContext';

const ALL_TRIPS = [
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

export function AllTripsViewStep() {
  const { state, dispatch } = useAppContext();

  const handleTripClick = (trip: typeof ALL_TRIPS[0]) => {
    dispatch({
      type: 'SET_TRIP_BASICS',
      payload: state.tripBasics || {
        budget: 2500,
        startDate: '',
        endDate: '',
        days: 0,
        origin: '',
        travelers: 1,
      },
    });
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

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 1 });
    setTimeout(() => {
      document.getElementById('hero-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="flex-1 w-full">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <button
            onClick={handleBack}
            className="text-coral hover:text-coral/70 font-semibold mb-4 flex items-center gap-2 transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-5xl font-serif font-bold text-ink mb-3">
            All Trip Ideas
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Explore our full collection of curated destinations, each tailored with AI-powered itineraries for your budget and travel dates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_TRIPS.map((trip) => (
            <div
              key={trip.title}
              onClick={() => handleTripClick(trip)}
              className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-card hover:shadow-lifted transition-all"
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
    </div>
  );
}
