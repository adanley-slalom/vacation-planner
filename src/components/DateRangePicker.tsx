import { useState } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import { IconCalendar, IconChevronDown } from '@tabler/icons-react';
import { differenceInDays } from 'date-fns';
import 'react-day-picker/dist/style.css';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onDatesChange: (startDate: string, endDate: string, days: number) => void;
}

// Format/parse using local date parts to avoid UTC off-by-one shifts from Date's ISO handling
function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseLocalDateString(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function DateRangePicker({ startDate, endDate, onDatesChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>(
    startDate ? { from: parseLocalDateString(startDate), to: endDate ? parseLocalDateString(endDate) : undefined } : undefined
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleClear = () => setRange(undefined);

  const handleDone = () => {
    if (range?.from && range?.to) {
      const days = differenceInDays(range.to, range.from) + 1;
      onDatesChange(toLocalDateString(range.from), toLocalDateString(range.to), days);
      setIsOpen(false);
    }
  };

  const displayText =
    startDate && endDate
      ? `${parseLocalDateString(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${parseLocalDateString(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
      : 'Depart - Return';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="input-field w-full px-5 py-5 hover:border-ocean transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <IconCalendar size={20} className="text-ocean" />
          <span className="text-lg font-medium text-ink">{displayText}</span>
        </div>
        <IconChevronDown size={16} className="text-gray-500 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 card border border-black/10 shadow-lifted p-6 z-20 w-max">
          <DayPicker
            mode="range"
            numberOfMonths={2}
            selected={range}
            onSelect={setRange}
            disabled={(day: Date) => {
              if (day < today) return true;
              if (range?.from && !range?.to) {
                return differenceInDays(day, range.from) > 29;
              }
              return false;
            }}
          />
          <div className="flex items-center justify-end gap-6 mt-4 pt-4 border-t border-black/10">
            <button onClick={handleClear} className="text-ocean font-semibold text-sm hover:underline">
              Clear
            </button>
            <button
              onClick={handleDone}
              disabled={!(range?.from && range?.to)}
              className="btn btn-dark py-2 text-sm"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
