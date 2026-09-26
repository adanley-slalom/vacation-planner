interface BudgetInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function BudgetInput({ value, onChange }: BudgetInputProps) {
  return (
    <div>
      <input
        type="number"
        value={value || ''}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
        className="w-full px-5 py-5 border border-gray-300 rounded-lg focus:outline-none focus:border-ocean text-lg font-medium text-ink"
        min="0"
        placeholder="Max Budget"
      />
    </div>
  );
}
