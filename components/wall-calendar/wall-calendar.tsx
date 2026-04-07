"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, RotateCcw, Calendar, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CalendarGrid } from "./calendar-grid";
import { NotesSection } from "./notes-section";
import { HeroImage } from "./hero-image";

export function WallCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [isDark, setIsDark] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const handleMonthChange = (newDate: Date) => {
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentDate(newDate);
      setIsFlipping(false);
    }, 400);
  };

  const handleReset = () => {
    setCurrentDate(new Date());
    setSelectedRange({ start: null, end: null });
  };

  const handleDateClick = (date: Date) => {
    setCurrentDate(date);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Animated background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 pointer-events-none" />
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen p-4 md:p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <header className="flex items-center justify-between mb-6 lg:mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
                  My Calendar
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Plan your days beautifully
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-9 px-3 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-foreground transition-colors"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Today</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-9 w-9 rounded-full hover:bg-primary/10"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </header>

          {/* Main calendar layout */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
            {/* Hero Image - Featured section */}
            <div className="xl:col-span-5 2xl:col-span-4">
              <div
                className={cn(
                  "relative h-[350px] md:h-[450px] xl:h-[calc(100vh-180px)] xl:max-h-[700px] rounded-3xl overflow-hidden",
                  "shadow-2xl shadow-black/10 dark:shadow-black/30",
                  "ring-1 ring-white/10",
                  "transition-all duration-500 ease-out",
                  isFlipping && "scale-[0.98] opacity-90"
                )}
              >
                <HeroImage currentDate={currentDate} />
              </div>
            </div>

            {/* Calendar and Notes - Right side */}
            <div className="xl:col-span-7 2xl:col-span-8 flex flex-col gap-6 lg:gap-8">
              {/* Calendar Grid */}
              <div
                className={cn(
                  "bg-card/80 backdrop-blur-xl rounded-3xl p-6 lg:p-8",
                  "shadow-xl shadow-black/5 dark:shadow-black/20",
                  "ring-1 ring-border/50",
                  "transition-all duration-500",
                  isFlipping && "opacity-90 scale-[0.99]"
                )}
              >
                <CalendarGrid
                  currentDate={currentDate}
                  onMonthChange={handleMonthChange}
                  selectedRange={selectedRange}
                  onRangeSelect={setSelectedRange}
                  onDateClick={handleDateClick}
                />
              </div>

              {/* Notes Section */}
              <div className="bg-card/80 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-xl shadow-black/5 dark:shadow-black/20 ring-1 ring-border/50 flex-1">
                <NotesSection
                  selectedRange={selectedRange}
                  currentDate={currentDate}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            <p>Click dates to select a range</p>
            <span className="text-muted-foreground/50">|</span>
            <p>Notes saved locally</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
