interface BudgetInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function BudgetInput({ value, onChange }: BudgetInputProps) {
  return (
    <div className="relative">
      {value > 0 && (
        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg font-medium text-ink pointer-events-none">
          $
        </span>
      )}
      <input
        type="number"
        value={value || ''}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
        className={`input-field w-full py-5 focus:outline-none text-lg font-medium text-ink ${
          value > 0 ? 'pl-8 pr-5' : 'px-5'
        }`}
        min="0"
        placeholder="Budget"
      />
    </div>
  );
}
