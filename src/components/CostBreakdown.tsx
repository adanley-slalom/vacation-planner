import type { Itinerary } from '../lib/types';

interface CostBreakdownProps {
  itinerary: Itinerary;
  budgetMax: number;
}

export function CostBreakdown({ itinerary, budgetMax }: CostBreakdownProps) {
  const { costs } = itinerary;
  const isUnderBudget = costs.total <= budgetMax;
  const isWithinTenPercent = costs.total <= budgetMax * 1.1;

  const getBudgetColor = () => {
    if (isUnderBudget) return 'text-green-600';
    if (isWithinTenPercent) return 'text-amber-600';
    return 'text-red-600';
  };

  const getBudgetBg = () => {
    if (isUnderBudget) return 'bg-green-50';
    if (isWithinTenPercent) return 'bg-amber-50';
    return 'bg-red-50';
  };

  return (
    <div className={`${getBudgetBg()} rounded-lg p-6 mb-8`}>
      <h3 className="text-lg font-serif font-bold text-ink mb-4">Cost breakdown</h3>
      
      <div className="space-y-3 mb-6 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-700">Flights</span>
          <span className="font-semibold">${costs.flights}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700">Lodging</span>
          <span className="font-semibold">${costs.lodging}</span>
        </div>
        {costs.car > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-700">Car rental</span>
            <span className="font-semibold">${costs.car}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-700">Activities</span>
          <span className="font-semibold">${costs.activities}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700">Food estimate</span>
          <span className="font-semibold">${costs.food}</span>
        </div>
      </div>

      <div className={`border-t border-gray-300 pt-4 flex justify-between ${getBudgetColor()}`}>
        <span className="font-bold">Total estimated cost</span>
        <span className="text-xl font-bold">${costs.total}</span>
      </div>
    </div>
  );
}
