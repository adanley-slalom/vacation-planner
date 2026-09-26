import { useState } from 'react';
import { BudgetInput } from '../components/BudgetInput';
import { DateRangePicker } from '../components/DateRangePicker';
import type { TripBasics } from '../lib/types';
import { useAppContext } from '../state/AppContext';

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
        <span className="inline-block text-xs font-semibold tracking-wide uppercase text-coral bg-coral/10 px-3 py-1 rounded-full mb-4">
          AI trip planner
        </span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-ink mb-3">
          Plan your trip with AI.
        </h1>
        <p className="text-gray-600 text-lg max-w-lg mx-auto">
          Tell us your budget and dates — get a personalized, day-by-day itinerary in minutes.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8 text-center">
        <div className="bg-offwhite rounded-lg p-4">
          <div className="text-2xl mb-1">🤖</div>
          <div className="text-xs font-semibold text-ink">AI-powered</div>
        </div>
        <div className="bg-offwhite rounded-lg p-4">
          <div className="text-2xl mb-1">💰</div>
          <div className="text-xs font-semibold text-ink">Budget-smart</div>
        </div>
        <div className="bg-offwhite rounded-lg p-4">
          <div className="text-2xl mb-1">⚡</div>
          <div className="text-xs font-semibold text-ink">Instant itinerary</div>
        </div>
      </div>

      <div className="space-y-8 bg-offwhite p-8 rounded-xl">
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
          className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
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
    </div>
  );
}
