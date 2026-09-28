import type { Itinerary } from '../lib/types';

interface CostBreakdownProps {
  itinerary: Itinerary;
  budget: number;
}

export function CostBreakdown({ itinerary, budget }: CostBreakdownProps) {
  const { costs } = itinerary;
  const isUnderBudget = costs.total <= budget;
  const isWithinTenPercent = costs.total <= budget * 1.1;

  const getBudgetColor = () => {
    if (isUnderBudget) return 'text-green-700';
    if (isWithinTenPercent) return 'text-amber-700';
    return 'text-red-700';
  };

  const getStatusPill = () => {
    if (isUnderBudget) return { label: 'Under budget', classes: 'bg-green-100 text-green-700' };
    if (isWithinTenPercent) return { label: 'Near budget', classes: 'bg-amber-100 text-amber-700' };
    return { label: 'Over budget', classes: 'bg-red-100 text-red-700' };
  };

  const status = getStatusPill();

  const rows = [
    { label: 'Flights', value: costs.flights },
    { label: 'Lodging', value: costs.lodging },
    ...(costs.car > 0 ? [{ label: 'Car rental', value: costs.car }] : []),
    { label: 'Activities', value: costs.activities },
    { label: 'Food estimate', value: costs.food },
  ];

  return (
    <div className="card p-8 sm:p-10 mb-12">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-serif font-bold text-ink">Cost breakdown</h3>
        <span className={`pill ${status.classes}`}>{status.label}</span>
      </div>

      <div className="space-y-4 mb-8">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between text-base">
            <span className="text-gray-600">{row.label}</span>
            <span className="font-semibold text-ink">${row.value}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-black/10 pt-5 flex items-center justify-between">
        <span className="font-semibold text-ink">Total estimated cost</span>
        <span className={`text-2xl font-bold ${getBudgetColor()}`}>${costs.total}</span>
      </div>
    </div>
  );
}
