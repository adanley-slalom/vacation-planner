import { IconPlane, IconBed, IconHome, IconCar } from '@tabler/icons-react';
import { BookingCard } from '../components/BookingCard';
import { DayTimeline } from '../components/DayTimeline';
import { CostBreakdown } from '../components/CostBreakdown';
import {
  buildGoogleFlightsLink,
  buildBookingComHotelLink,
  buildAirbnbLink,
  buildKayakCarsLink,
} from '../lib/bookingLinks';
import { useAppContext } from '../state/AppContext';

export function ItineraryViewStep() {
  const { state, dispatch } = useAppContext();

  const itinerary = state.itinerary!;
  const tripBasics = state.tripBasics!;

  // Themed/surprise trips can skip the trip-basics form, so tripBasics dates may be
  // blank — fall back to the itinerary's own day range, which is always populated.
  const displayStartDate = tripBasics.startDate || itinerary.days[0]?.date || '';
  const displayEndDate = tripBasics.endDate || itinerary.days[itinerary.days.length - 1]?.date || '';
  const displayOrigin = tripBasics.origin.trim() || 'Your city';

  const handleStartOver = () => {
    dispatch({ type: 'RESET' });
  };

  const handleAdjustInChat = () => {
    dispatch({ type: 'SET_STEP', payload: 2 });
  };

  const handlePrint = () => {
    window.print();
  };

  const flightsLink = buildGoogleFlightsLink(
    tripBasics.origin,
    itinerary.destination,
    itinerary.destinationAirportCode,
    displayStartDate,
    displayEndDate,
    tripBasics.travelers
  );

  const hotelLink = buildBookingComHotelLink(
    itinerary.destination,
    displayStartDate,
    displayEndDate,
    tripBasics.travelers
  );

  const airbnbLink = buildAirbnbLink(
    itinerary.destination,
    displayStartDate,
    displayEndDate,
    tripBasics.travelers
  );

  const carLink = itinerary.needsCar
    ? buildKayakCarsLink(
        itinerary.destination,
        displayStartDate,
        displayEndDate,
        tripBasics.origin
      )
    : '';

  return (
    <div className="relative max-w-4xl mx-auto pb-16">
      {/* Ambient glow, echoes the chat step's radial background */}
      <div
        className="absolute -top-10 left-1/2 -translate-x-1/2 w-[40rem] h-[24rem] pointer-events-none print:hidden"
        style={{
          background: 'radial-gradient(ellipse 60% 60% at 50% 30%, rgba(180,126,238,0.18), transparent 70%)',
        }}
      />

      {/* Header */}
      <div
        className="relative text-white p-8 sm:p-10 rounded-2xl shadow-card mb-10 print:break-after-page overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #212a4d 0%, #4b3f8f 55%, #b47eee 100%)' }}
      >
        <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-3">{itinerary.destination}</h1>
        <div className="text-base sm:text-lg text-white/75">
          {displayStartDate} to {displayEndDate} • {tripBasics.travelers} traveler{tripBasics.travelers !== 1 ? 's' : ''}
        </div>
        {itinerary.surpriseReason && (
          <p className="mt-5 text-white/90 italic border-l-2 border-white/30 pl-4">
            "Why we picked this: {itinerary.surpriseReason}"
          </p>
        )}
      </div>

      {/* Booking Cards */}
      <div className="mb-10">
        <h2 className="text-2xl font-serif font-bold text-ink mb-5">Book your trip</h2>
        <div className="grid gap-5 md:grid-cols-2 print:grid-cols-1">
          <BookingCard
            title="Flights"
            description={`${displayOrigin} → ${itinerary.destinationAirportCode}`}
            bookingUrl={flightsLink}
            icon={<IconPlane size={22} />}
          />
          <BookingCard
            title="Hotel"
            description={`${displayStartDate} to ${displayEndDate}`}
            bookingUrl={hotelLink}
            icon={<IconBed size={22} />}
          />
          <BookingCard
            title="Airbnb"
            description={`${displayStartDate} to ${displayEndDate}`}
            bookingUrl={airbnbLink}
            icon={<IconHome size={22} />}
          />
          {itinerary.needsCar && (
            <BookingCard
              title="Car Rental"
              description={`Pick up and drop off in ${itinerary.destination}`}
              bookingUrl={carLink}
              icon={<IconCar size={22} />}
            />
          )}
        </div>
      </div>

      {/* Cost Breakdown */}
      <CostBreakdown itinerary={itinerary} budget={tripBasics.budget} />

      {/* Day-by-day itinerary */}
      <div className="mb-10">
        <h2 className="text-2xl font-serif font-bold text-ink mb-5">Your itinerary</h2>
        <div className="print:break-inside-avoid">
          {itinerary.days.map((day) => (
            <DayTimeline key={day.day} day={day} destination={itinerary.destination} />
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-callout text-sm text-gray-600 mb-10">
        <p>
          <strong>Note:</strong> Prices are estimates. Final prices shown on booking sites may vary.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center print:hidden">
        <button
          onClick={handleAdjustInChat}
          className="btn btn-secondary"
        >
          Adjust in chat
        </button>
        <button
          onClick={handlePrint}
          className="btn btn-primary"
        >
          Print / Save as PDF
        </button>
        <button
          onClick={handleStartOver}
          className="btn btn-dark"
        >
          Start over
        </button>
      </div>
    </div>
  );
}
