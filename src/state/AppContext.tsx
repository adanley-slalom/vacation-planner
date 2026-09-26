import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { TripBasics, ChatMessage, Itinerary, AppStep } from '../lib/types';

type AppState = {
  step: AppStep;
  tripBasics: TripBasics | null;
  messages: ChatMessage[];
  itinerary: Itinerary | null;
};

type AppAction =
  | { type: 'SET_STEP'; payload: AppStep }
  | { type: 'SET_TRIP_BASICS'; payload: TripBasics }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_MESSAGES'; payload: ChatMessage[] }
  | { type: 'SET_ITINERARY'; payload: Itinerary }
  | { type: 'RESET' };

const initialState: AppState = {
  step: 1,
  tripBasics: null,
  messages: [],
  itinerary: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_TRIP_BASICS':
      return { ...state, tripBasics: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'SET_ITINERARY':
      return { ...state, itinerary: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

type AppContextType = {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
