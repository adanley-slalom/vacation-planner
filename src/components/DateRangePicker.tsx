import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
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
  const [mode, setMode] = useState<'start' | 'end'>('start');
  const [tempStart, setTempStart] = useState<Date | undefined>(startDate ? parseLocalDateString(startDate) : undefined);
  const [tempEnd, setTempEnd] = useState<Date | undefined>(endDate ? parseLocalDateString(endDate) : undefined);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleDayClick = (day: Date) => {
    day.setHours(0, 0, 0, 0);

    if (mode === 'start') {
      setTempStart(day);
      setMode('end');
      if (tempEnd && day > tempEnd) {
        setTempEnd(undefined);
      }
    } else {
      if (tempStart && day >= tempStart) {
        setTempEnd(day);
        const days = differenceInDays(day, tempStart) + 1;
        if (days <= 30) {
          onDatesChange(
            toLocalDateString(tempStart),
            toLocalDateString(day),
            days
          );
          setIsOpen(false);
          setMode('start');
        }
      }
    }
  };

  const displayText =
    startDate && endDate
      ? `${parseLocalDateString(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${parseLocalDateString(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
      : startDate
      ? `${parseLocalDateString(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - Return`
      : 'Depart - Return';

  const days = startDate && endDate ? differenceInDays(parseLocalDateString(endDate), parseLocalDateString(startDate)) + 1 : 0;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-5 border border-gray-300 rounded-lg bg-white hover:border-ocean transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl text-ocean">📅</span>
          <span className="text-lg font-medium text-ink">{displayText}</span>
        </div>
        <span className="text-gray-500 text-sm ml-2">▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10">
          <div className="mb-2 text-sm font-semibold text-ink">
            {mode === 'start' ? 'Select start date' : 'Select end date'}
          </div>
          <DayPicker
            mode="single"
            selected={mode === 'start' ? tempStart : tempEnd}
            onDayClick={handleDayClick}
            disabled={(day: Date): boolean => {
              const isBefore = day < today;
              const isTooFar = tempStart ? differenceInDays(day, tempStart) > 29 : false;
              return isBefore || isTooFar;
            }}
          />
          {days > 0 && (
            <div className="mt-2 text-sm text-ocean font-medium">
              {days} day{days !== 1 ? 's' : ''}{days > 1 ? `, ${days - 1} night${days !== 2 ? 's' : ''}` : ''}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
