import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { differenceInDays } from 'date-fns';
import 'react-day-picker/dist/style.css';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onDatesChange: (startDate: string, endDate: string, days: number) => void;
}

export function DateRangePicker({ startDate, endDate, onDatesChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'start' | 'end'>('start');
  const [tempStart, setTempStart] = useState<Date | undefined>(startDate ? new Date(startDate) : undefined);
  const [tempEnd, setTempEnd] = useState<Date | undefined>(endDate ? new Date(endDate) : undefined);

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
            tempStart.toISOString().split('T')[0],
            day.toISOString().split('T')[0],
            days
          );
          setIsOpen(false);
          setMode('start');
        }
      }
    }
  };

  const displayText = startDate && endDate
    ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
    : 'Select dates';

  const days = startDate && endDate ? differenceInDays(new Date(endDate), new Date(startDate)) + 1 : 0;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-left hover:border-ocean"
      >
        {displayText}
      </button>

      {isOpen && (
        <div className="absolute top-12 left-0 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10">
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
