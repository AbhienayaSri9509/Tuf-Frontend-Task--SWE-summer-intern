"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, CloudSun, Leaf, Snowflake } from "lucide-react";

interface HeroImageProps {
  currentDate: Date;
}

const SEASONAL_CONFIG = [
  { month: 0, image: "/images/winter.jpg", icon: Snowflake, label: "Winter", accent: "from-blue-500/20" },
  { month: 1, image: "/images/winter.jpg", icon: Snowflake, label: "Winter", accent: "from-blue-500/20" },
  { month: 2, image: "/images/spring.jpg", icon: Sparkles, label: "Spring", accent: "from-pink-500/20" },
  { month: 3, image: "/images/spring.jpg", icon: Sparkles, label: "Spring", accent: "from-pink-500/20" },
  { month: 4, image: "/images/spring.jpg", icon: Sparkles, label: "Spring", accent: "from-pink-500/20" },
  { month: 5, image: "/images/summer.jpg", icon: CloudSun, label: "Summer", accent: "from-amber-500/20" },
  { month: 6, image: "/images/summer.jpg", icon: CloudSun, label: "Summer", accent: "from-amber-500/20" },
  { month: 7, image: "/images/summer.jpg", icon: CloudSun, label: "Summer", accent: "from-amber-500/20" },
  { month: 8, image: "/images/autumn.jpg", icon: Leaf, label: "Autumn", accent: "from-orange-500/20" },
  { month: 9, image: "/images/autumn.jpg", icon: Leaf, label: "Autumn", accent: "from-orange-500/20" },
  { month: 10, image: "/images/autumn.jpg", icon: Leaf, label: "Autumn", accent: "from-orange-500/20" },
  { month: 11, image: "/images/winter.jpg", icon: Snowflake, label: "Winter", accent: "from-blue-500/20" },
];

export function HeroImage({ currentDate }: HeroImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [prevImage, setPrevImage] = useState<string | null>(null);
  
  const month = currentDate.getMonth();
  const seasonal = SEASONAL_CONFIG[month];
  const SeasonIcon = seasonal.icon;

  useEffect(() => {
    setImageLoaded(false);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => setImageLoaded(true);
    img.src = seasonal.image;
    
    return () => {
      setPrevImage(seasonal.image);
    };
  }, [seasonal.image]);

  return (
    <div className="relative w-full h-full overflow-hidden group">
      {/* Background image with parallax-like effect */}
      <div 
        className={cn(
          "absolute inset-0 transition-all duration-1000 ease-out",
          imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
        )}
      >
        <img
          src={seasonal.image}
          alt={`${seasonal.label} landscape`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Animated gradient overlay */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br",
        seasonal.accent,
        "to-transparent opacity-60"
      )} />

      {/* Cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

      {/* Season badge */}
      <div className="absolute top-6 left-6 z-10">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
          <SeasonIcon className="h-4 w-4 text-white" />
          <span className="text-sm font-medium text-white tracking-wide">{seasonal.label}</span>
        </div>
      </div>

      {/* Decorative floating elements */}
      <div className="absolute top-1/4 right-8 animate-pulse">
        <div className="w-2 h-2 rounded-full bg-white/40" />
      </div>
      <div className="absolute top-1/3 right-16 animate-pulse delay-300">
        <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
      </div>
      <div className="absolute top-1/2 right-12 animate-pulse delay-700">
        <div className="w-1 h-1 rounded-full bg-white/20" />
      </div>

      {/* Main content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <p className="text-white/70 text-sm font-medium tracking-[0.2em] uppercase">
              {currentDate.toLocaleDateString("en-US", { weekday: "long" })}
            </p>
            <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none">
              {currentDate.toLocaleDateString("en-US", { month: "long" })}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-white/60 text-xl font-light">
                {currentDate.getFullYear()}
              </span>
              <div className="w-px h-5 bg-white/30" />
              <span className="text-white/50 text-sm">
                Week {getWeekNumber(currentDate)}
              </span>
            </div>
          </div>
          
          {/* Large date number */}
          <div className="relative">
            <span className="text-white/10 text-[120px] md:text-[160px] lg:text-[200px] font-bold leading-none tabular-nums select-none">
              {currentDate.getDate().toString().padStart(2, "0")}
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-6xl md:text-7xl lg:text-8xl font-bold tabular-nums">
                {currentDate.getDate()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle grain texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}
