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
    tripBasics.startDate,
    tripBasics.endDate,
    tripBasics.travelers
  );

  const hotelLink = buildBookingComHotelLink(
    itinerary.destination,
    tripBasics.startDate,
    tripBasics.endDate,
    tripBasics.travelers
  );

  const airbnbLink = buildAirbnbLink(
    itinerary.destination,
    tripBasics.startDate,
    tripBasics.endDate,
    tripBasics.travelers
  );

  const carLink = itinerary.needsCar
    ? buildKayakCarsLink(
        itinerary.destination,
        tripBasics.startDate,
        tripBasics.endDate,
        tripBasics.origin
      )
    : '';

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-ocean to-seaglass text-offwhite p-8 rounded-lg mb-8 print:break-after-page">
        <h1 className="text-4xl font-serif font-bold mb-2">{itinerary.destination}</h1>
        <div className="text-lg opacity-90">
          {tripBasics.startDate} to {tripBasics.endDate} • {tripBasics.travelers} traveler{tripBasics.travelers !== 1 ? 's' : ''}
        </div>
        {itinerary.surpriseReason && (
          <p className="mt-4 italic">"Why we picked this: {itinerary.surpriseReason}"</p>
        )}
      </div>

      {/* Booking Cards */}
      <div className="mb-12">
        <h2 className="text-2xl font-serif font-bold text-ink mb-4">Book your trip</h2>
        <div className="grid gap-4 md:grid-cols-2 print:grid-cols-1">
          <BookingCard
            title="Flights"
            description={`${tripBasics.origin} → ${itinerary.destinationAirportCode}`}
            bookingUrl={flightsLink}
            icon={<IconPlane size={22} className="text-ocean" />}
          />
          <BookingCard
            title="Hotel"
            description={`${tripBasics.startDate} to ${tripBasics.endDate}`}
            bookingUrl={hotelLink}
            icon={<IconBed size={22} className="text-ocean" />}
          />
          <BookingCard
            title="Airbnb"
            description={`${tripBasics.startDate} to ${tripBasics.endDate}`}
            bookingUrl={airbnbLink}
            icon={<IconHome size={22} className="text-ocean" />}
          />
          {itinerary.needsCar && (
            <BookingCard
              title="Car Rental"
              description={`Pick up and drop off in ${itinerary.destination}`}
              bookingUrl={carLink}
              icon={<IconCar size={22} className="text-ocean" />}
            />
          )}
        </div>
      </div>

      {/* Cost Breakdown */}
      <CostBreakdown itinerary={itinerary} budget={tripBasics.budget} />

      {/* Day-by-day itinerary */}
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-bold text-ink mb-6">Your itinerary</h2>
        <div className="print:break-inside-avoid">
          {itinerary.days.map((day) => (
            <DayTimeline key={day.day} day={day} destination={itinerary.destination} />
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-100 p-4 rounded-lg text-xs text-gray-600 mb-8">
        <p>
          <strong>Note:</strong> Prices are estimates. Final prices shown on booking sites may vary.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-center print:hidden">
        <button
          onClick={handleAdjustInChat}
          className="px-6 py-3 bg-seaglass text-ink rounded-lg font-semibold hover:bg-opacity-80 transition-colors"
        >
          Adjust in chat
        </button>
        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-ocean text-offwhite rounded-lg font-semibold hover:bg-opacity-80 transition-colors"
        >
          Print / Save as PDF
        </button>
        <button
          onClick={handleStartOver}
          className="px-6 py-3 bg-gray-400 text-offwhite rounded-lg font-semibold hover:bg-gray-500 transition-colors"
        >
          Start over
        </button>
      </div>
    </div>
  );
}
