import { IconUsers, IconMinus, IconPlus } from '@tabler/icons-react';

interface TravelersInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function TravelersInput({ value, onChange }: TravelersInputProps) {
  const decrement = () => onChange(Math.max(1, value - 1));
  const increment = () => onChange(Math.min(20, value + 1));

  return (
    <div className="flex items-center justify-between gap-2 px-3 py-5 border border-gray-300 rounded-lg">
      <div className="flex items-center gap-1.5 text-ink">
        <IconUsers size={20} className="text-ocean shrink-0" />
        <span className="text-lg font-medium">{value}</span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= 1}
          aria-label="Decrease travelers"
          className="w-7 h-7 shrink-0 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-ocean hover:text-ocean disabled:opacity-30 disabled:hover:border-gray-300 disabled:hover:text-gray-500 transition-colors"
        >
          <IconMinus size={14} />
        </button>
        <button
          type="button"
          onClick={increment}
          disabled={value >= 20}
          aria-label="Increase travelers"
          className="w-7 h-7 shrink-0 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-ocean hover:text-ocean disabled:opacity-30 disabled:hover:border-gray-300 disabled:hover:text-gray-500 transition-colors"
        >
          <IconPlus size={14} />
        </button>
      </div>
    </div>
  );
}
