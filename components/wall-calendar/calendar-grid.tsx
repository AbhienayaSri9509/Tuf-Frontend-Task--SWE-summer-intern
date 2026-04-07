"use client";

import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CalendarGridProps {
  currentDate: Date;
  onMonthChange: (date: Date) => void;
  selectedRange: { start: Date | null; end: Date | null };
  onRangeSelect: (range: { start: Date | null; end: Date | null }) => void;
  onDateClick?: (date: Date) => void;
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function isDateInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const time = date.getTime();
  return time > start.getTime() && time < end.getTime();
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function CalendarGrid({
  currentDate,
  onMonthChange,
  selectedRange,
  onRangeSelect,
  onDateClick,
}: CalendarGridProps) {
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const handlePrevMonth = () => {
    onMonthChange(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(new Date(year, month + 1, 1));
  };

  const handleDateClick = useCallback(
    (day: number) => {
      const clickedDate = new Date(year, month, day);
      onDateClick?.(clickedDate);

      if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
        // Start new selection
        onRangeSelect({ start: clickedDate, end: null });
        setIsSelecting(true);
      } else {
        // Complete selection
        const start = selectedRange.start;
        if (clickedDate < start) {
          onRangeSelect({ start: clickedDate, end: start });
        } else {
          onRangeSelect({ start, end: clickedDate });
        }
        setIsSelecting(false);
      }
    },
    [year, month, selectedRange, onRangeSelect, onDateClick]
  );

  const handleMouseEnter = (day: number) => {
    if (isSelecting) {
      setHoverDate(new Date(year, month, day));
    }
  };

  const handleMouseLeave = () => {
    setHoverDate(null);
  };

  // Generate calendar days
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getDateState = (day: number) => {
    const date = new Date(year, month, day);
    const isStart = selectedRange.start && isSameDay(date, selectedRange.start);
    const isEnd = selectedRange.end && isSameDay(date, selectedRange.end);
    const inRange = isDateInRange(date, selectedRange.start, selectedRange.end);
    
    // Preview range while selecting
    let inPreviewRange = false;
    if (isSelecting && selectedRange.start && hoverDate) {
      const start = selectedRange.start;
      const hover = hoverDate;
      const [rangeStart, rangeEnd] = start < hover ? [start, hover] : [hover, start];
      inPreviewRange = date > rangeStart && date < rangeEnd;
    }

    return { isStart, isEnd, inRange, inPreviewRange, isToday: isToday(date) };
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-2 pb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevMonth}
          className="h-8 w-8 rounded-full hover:bg-calendar-hover"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold tracking-wide text-foreground">
          {MONTHS[month]} {year}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextMonth}
          className="h-8 w-8 rounded-full hover:bg-calendar-hover"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 flex-1">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const { isStart, isEnd, inRange, inPreviewRange, isToday: isTodayDate } = getDateState(day);

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              onMouseEnter={() => handleMouseEnter(day)}
              onMouseLeave={handleMouseLeave}
              className={cn(
                "aspect-square flex items-center justify-center text-sm rounded-lg transition-all duration-200",
                "hover:bg-calendar-hover focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                // Today styling
                isTodayDate && !isStart && !isEnd && "ring-2 ring-calendar-today ring-inset font-semibold",
                // Range styling
                (inRange || inPreviewRange) && "bg-calendar-range",
                // Start date styling
                isStart && "bg-calendar-selection text-primary-foreground font-semibold rounded-lg",
                // End date styling  
                isEnd && "bg-calendar-selection text-primary-foreground font-semibold rounded-lg",
                // Default styling
                !isStart && !isEnd && !inRange && !inPreviewRange && "text-foreground"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Selection info */}
      {selectedRange.start && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            {selectedRange.end ? (
              <>
                <span className="font-medium text-foreground">
                  {selectedRange.start.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
                {" → "}
                <span className="font-medium text-foreground">
                  {selectedRange.end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
                <span className="ml-2 text-xs">
                  ({Math.ceil((selectedRange.end.getTime() - selectedRange.start.getTime()) / (1000 * 60 * 60 * 24)) + 1} days)
                </span>
              </>
            ) : (
              <>
                <span className="font-medium text-foreground">
                  {selectedRange.start.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
                <span className="ml-2 text-xs animate-pulse">Select end date...</span>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
