export function buildGoogleFlightsLink(
  origin: string,
  _destination: string,
  destinationCode: string,
  departDate: string,
  returnDate: string,
  travelers: number
): string {
  const params = new URLSearchParams({
    hl: 'en',
    tfs: `${origin.substring(0, 3).toUpperCase()}${departDate}1${destinationCode}${returnDate}0R${travelers}`,
  });
  return `https://www.google.com/flights?${params}`;
}

export function buildBookingComHotelLink(
  destination: string,
  checkIn: string,
  checkOut: string,
  guests: number
): string {
  const params = new URLSearchParams({
    ss: destination,
    checkin: checkIn,
    checkout: checkOut,
    group_adults: guests.toString(),
    group_children: '0',
  });
  return `https://www.booking.com/searchresults.html?${params}`;
}

export function buildAirbnbLink(
  destination: string,
  checkIn: string,
  checkOut: string,
  guests: number
): string {
  const params = new URLSearchParams({
    tab: 'homes',
    refinement_paths: `['/homes']`,
    flexible_trip_dates: `[${checkIn},${checkOut}]`,
    query: destination,
    place_id: destination,
    checkin: checkIn,
    checkout: checkOut,
    adults: guests.toString(),
  });
  return `https://www.airbnb.com/homes?${params}`;
}

export function buildKayakCarsLink(
  destination: string,
  pickupDate: string,
  dropoffDate: string,
  pickupLocation: string
): string {
  const params = new URLSearchParams({
    a: 'crco',
    lc: pickupLocation,
    c1: destination,
    sd: pickupDate,
    ed: dropoffDate,
  });
  return `https://www.kayak.com/cars?${params}`;
}

export function buildViatorActivityLink(
  activity: string,
  destination: string
): string {
  const params = new URLSearchParams({
    q: `${activity} ${destination}`,
  });
  return `https://www.viator.com/search/activities?${params}`;
}

export function buildGoogleSearchLink(query: string): string {
  const params = new URLSearchParams({ q: query });
  return `https://www.google.com/search?${params}`;
}
