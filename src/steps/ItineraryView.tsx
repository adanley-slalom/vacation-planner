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
import { formatDisplayDateRange, nightsBetween } from '../lib/dates';
import { useAppContext } from '../state/AppContext';

export function ItineraryViewStep() {
  const { state, dispatch } = useAppContext();

  const itinerary = state.itinerary!;
  const tripBasics = state.tripBasics!;

  // Themed/surprise trips can skip the trip-basics form, so tripBasics dates may be
  // blank — fall back to the itinerary's own day range, which is always populated.
  const displayStartDate = tripBasics.startDate || itinerary.days[0]?.date || '';
  const displayEndDate = tripBasics.endDate || itinerary.days[itinerary.days.length - 1]?.date || '';
  const displayDateRange = formatDisplayDateRange(displayStartDate, displayEndDate);
  const displayOrigin = tripBasics.origin.trim() || 'Your city';
  const nights = nightsBetween(displayStartDate, displayEndDate);
  const travelerLabel = `${tripBasics.travelers} traveler${tripBasics.travelers !== 1 ? 's' : ''}`;
  const hotelSuggestion = itinerary.lodgingSuggestions.find((l) => l.type === 'hotel');
  const airbnbSuggestion = itinerary.lodgingSuggestions.find((l) => l.type === 'airbnb' || l.type === 'hostel');

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
    <div className="relative max-w-5xl mx-auto pb-20">
      {/* Ambient glow, echoes the chat step's radial background */}
      <div
        className="absolute -top-10 left-1/2 -translate-x-1/2 w-[40rem] h-[24rem] pointer-events-none print:hidden"
        style={{
          background: 'radial-gradient(ellipse 60% 60% at 50% 30%, rgba(180,126,238,0.18), transparent 70%)',
        }}
      />

      {/* Header */}
      <div
        className="relative text-white p-10 sm:p-14 rounded-2xl shadow-card mb-12 print:break-after-page overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #212a4d 0%, #4b3f8f 55%, #b47eee 100%)' }}
      >
        <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4">{itinerary.destination}</h1>
        <div className="text-lg sm:text-xl text-white/75">
          {displayDateRange} • {tripBasics.travelers} traveler{tripBasics.travelers !== 1 ? 's' : ''}
        </div>
        {itinerary.surpriseReason && (
          <p className="mt-6 text-lg text-white/90 italic border-l-2 border-white/30 pl-4">
            "Why we picked this: {itinerary.surpriseReason}"
          </p>
        )}
      </div>

      {/* Booking Cards */}
      <div className="mb-12">
        <h2 className="text-3xl font-serif font-bold text-ink mb-6">Book your trip</h2>
        <div className="grid gap-6 md:grid-cols-2 print:grid-cols-1">
          <BookingCard
            title="Flights"
            primary={`${displayOrigin} → ${itinerary.destination} (${itinerary.destinationAirportCode})`}
            meta={[displayDateRange, travelerLabel, 'Round trip']}
            bookingUrl={flightsLink}
            icon={<IconPlane size={24} />}
          />
          <BookingCard
            title="Hotel"
            primary={hotelSuggestion?.name || `Stay in ${itinerary.destination}`}
            meta={[
              hotelSuggestion?.area,
              `${displayDateRange} · ${nights} night${nights !== 1 ? 's' : ''}`,
              hotelSuggestion && `$${hotelSuggestion.nightlyRate}/night`,
            ]}
            bookingUrl={hotelLink}
            icon={<IconBed size={24} />}
          />
          <BookingCard
            title="Airbnb"
            primary={airbnbSuggestion?.name || `Stay in ${itinerary.destination}`}
            meta={[
              airbnbSuggestion?.area,
              `${displayDateRange} · ${nights} night${nights !== 1 ? 's' : ''}`,
              airbnbSuggestion && `$${airbnbSuggestion.nightlyRate}/night`,
            ]}
            bookingUrl={airbnbLink}
            icon={<IconHome size={24} />}
          />
          {itinerary.needsCar && (
            <BookingCard
              title="Car Rental"
              primary={`Pick up & drop off in ${itinerary.destination}`}
              meta={[displayDateRange, travelerLabel]}
              bookingUrl={carLink}
              icon={<IconCar size={24} />}
            />
          )}
        </div>
      </div>

      {/* Cost Breakdown */}
      <CostBreakdown itinerary={itinerary} budget={tripBasics.budget} />

      {/* Day-by-day itinerary */}
      <div className="mb-12">
        <h2 className="text-3xl font-serif font-bold text-ink mb-6">Your itinerary</h2>
        <div className="print:break-inside-avoid">
          {itinerary.days.map((day) => (
            <DayTimeline key={day.day} day={day} destination={itinerary.destination} />
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-callout text-base text-gray-600 mb-12">
        <p>
          <strong>Note:</strong> Prices are estimates. Final prices shown on booking sites may vary.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 justify-center print:hidden">
        <button
          onClick={handleAdjustInChat}
          className="btn btn-secondary"
        >
          Adjust in chat
        </button>
        <button
          onClick={handlePrint}
          className="btn btn-secondary"
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
