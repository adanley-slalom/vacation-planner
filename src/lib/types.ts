export type TripBasics = {
  budget: number;
  startDate: string;
  endDate: string;
  days: number;
  origin: string;
  travelers: number;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type Activity = {
  time: "morning" | "afternoon" | "evening";
  title: string;
  description: string;
  estimatedCost: number;
  bookingUrl?: string;
};

export type ItineraryDay = {
  day: number;
  date: string;
  title: string;
  activities: Activity[];
};

export type Itinerary = {
  destination: string;
  destinationAirportCode: string;
  summary: string;
  surpriseReason?: string;
  days: ItineraryDay[];
  costs: {
    flights: number;
    lodging: number;
    car: number;
    activities: number;
    food: number;
    total: number;
  };
  lodgingSuggestions: Array<{
    type: "hotel" | "airbnb" | "hostel";
    name: string;
    area: string;
    nightlyRate: number;
  }>;
  needsCar: boolean;
};

export type AppStep = 1 | 2 | 3;
