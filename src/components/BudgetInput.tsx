interface BudgetInputProps {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
}

export function BudgetInput({ min, max, onChange }: BudgetInputProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-ink mb-1">
            Minimum budget (USD)
          </label>
          <input
            type="number"
            value={min}
            onChange={(e) => onChange(Math.max(0, Number(e.target.value)), max)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-ocean"
            min="0"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-ink mb-1">
            Maximum budget (USD)
          </label>
          <input
            type="number"
            value={max}
            onChange={(e) => onChange(min, Math.max(min, Number(e.target.value)))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-ocean"
            min={min}
          />
        </div>
      </div>
      <div className="text-sm text-gray-600">
        Budget range: ${min.toLocaleString()} - ${max.toLocaleString()}
      </div>
    </div>
  );
}
