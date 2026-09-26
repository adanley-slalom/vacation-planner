interface BudgetInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function BudgetInput({ value, onChange }: BudgetInputProps) {
  return (
    <div className="space-y-4">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-ocean"
        min="0"
        placeholder="Enter budget (USD)"
      />
      <div className="text-sm text-gray-600">
        Budget: ${value.toLocaleString()}
      </div>
    </div>
  );
}
