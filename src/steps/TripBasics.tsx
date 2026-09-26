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
      <h1 className="text-4xl font-serif font-bold text-ink mb-2">Let's plan your trip</h1>
      <p className="text-gray-600 mb-8">Start by telling us about your ideal vacation</p>

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

        <div>
          <label className="block text-sm font-medium text-ink mb-2">Number of travelers</label>
          <input
            type="number"
            min="1"
            value={formData.travelers}
            onChange={(e) => setFormData({ ...formData, travelers: Math.max(1, Number(e.target.value)) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-ocean"
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
      </div>
    </div>
  );
}
