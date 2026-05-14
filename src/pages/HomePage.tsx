import React, { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { format } from 'date-fns';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useWeatherStore } from '@/store/weatherStore';
import { useWeather } from '@/hooks/useWeather';
import { getWeatherInterpretation, getWeatherTheme } from '@/lib/weather';
import { WeatherIcon } from '@/components/WeatherIcon';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AlertCircle, Droplets, Gauge, MapPin, Search, Thermometer, Wind } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { cn } from '@/lib/utils';
export function HomePage() {
  const [open, setOpen] = useState(false);
  const { fetchWeatherForCity } = useWeather();
  const location = useWeatherStore(s => s.location);
  const weather = useWeatherStore(s => s.weather);
  const loading = useWeatherStore(s => s.loading);
  const error = useWeatherStore(s => s.error);
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);
  const handleSelectCity = useCallback((city: string) => {
    fetchWeatherForCity(city);
    setOpen(false);
  }, [fetchWeatherForCity]);
  const weatherTheme = weather
    ? getWeatherTheme(weather.current.weatherCode, weather.current.isDay)
    : 'sunny';
  const interpretation = weather
    ? getWeatherInterpretation(weather.current.weatherCode, weather.current.isDay)
    : null;
  const bgClass = weatherTheme === 'night' ? 'bg-weather-night' :
                  weatherTheme === 'cloudy' ? 'bg-weather-cloudy' :
                  weatherTheme === 'rainy' ? 'bg-weather-rainy' :
                  weatherTheme === 'snowy' ? 'bg-weather-snowy' :
                  weatherTheme === 'stormy' ? 'bg-weather-stormy' :
                  'bg-weather-sunny';
  return (
    <>
      <div className={cn("min-h-screen w-full transition-all duration-1000 ease-in-out selection:bg-primary/30", bgClass)}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <header className="flex justify-between items-center mb-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4"
              >
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Nimbus</h1>
              </motion.div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setOpen(true)} 
                  className="flex items-center gap-2 bg-background/40 backdrop-blur-md border-white/20 hover:bg-background/60 transition-all duration-200"
                >
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline">Search city...</span>
                  <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </Button>
                <ThemeToggle className="static" />
              </div>
            </header>
            <main className="relative z-10">
              <AnimatePresence mode="wait">
                {loading ? (
                  <WeatherSkeleton key="skeleton" />
                ) : weather && location && interpretation ? (
                  <motion.div
                    key={location.name}
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.02, y: -10 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <Card className="bg-white/40 dark:bg-black/20 backdrop-blur-xl border-white/30 dark:border-white/10 shadow-2xl overflow-hidden ring-1 ring-white/20">
                      <CardContent className="p-6 md:p-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="flex flex-col items-center justify-center text-center md:items-start md:text-left">
                            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 mb-1">
                              <MapPin className="h-5 w-5 opacity-70" />
                              <p className="text-2xl font-semibold">{location.name}{location.country ? `, ${location.country}` : ''}</p>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{format(new Date(), "EEEE, MMMM do")}</p>
                            <div className="flex items-center gap-6">
                              <div className="bg-white/30 dark:bg-black/20 p-4 rounded-3xl shadow-inner backdrop-blur-md">
                                <WeatherIcon 
                                  weatherCode={weather.current.weatherCode} 
                                  isDay={weather.current.isDay} 
                                  className="w-20 h-20 text-blue-600 dark:text-blue-400 floating" 
                                />
                              </div>
                              <div>
                                <span className="font-display text-7xl md:text-8xl font-bold tracking-tighter text-slate-900 dark:text-white leading-none">
                                  {weather.current.temperature}°
                                </span>
                                <p className="text-xl font-medium text-slate-700 dark:text-slate-300 mt-1">
                                  {interpretation.description}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <DetailCard icon={Thermometer} label="Feels like" value={`${weather.current.apparentTemperature}°`} />
                            <DetailCard icon={Wind} label="Wind Speed" value={`${weather.current.windSpeed} km/h`} />
                            <DetailCard icon={Droplets} label="Humidity" value={`${weather.current.humidity}%`} />
                            <DetailCard icon={Gauge} label="Precipitation" value={`${weather.current.precipitation} mm`} />
                          </div>
                        </div>
                        <hr className="my-10 border-slate-900/5 dark:border-white/5" />
                        <div>
                          <h2 className="text-sm font-bold uppercase tracking-widest mb-6 text-slate-500 dark:text-slate-400">Hourly Forecast</h2>
                          <div className="flex overflow-x-auto space-x-2 pb-4 -mx-6 px-6 no-scrollbar snap-x">
                            {weather.hourly.map((hour, index) => (
                              <div key={index} className="flex flex-col items-center space-y-3 flex-shrink-0 w-24 text-center p-4 rounded-2xl hover:bg-white/30 dark:hover:bg-white/5 transition-all duration-200 snap-center cursor-default group">
                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{hour.time}</p>
                                <WeatherIcon weatherCode={hour.weatherCode} isDay={hour.isDay} className="w-8 h-8 text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{hour.temperature}°</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <hr className="my-10 border-slate-900/5 dark:border-white/5" />
                        <div>
                          <h2 className="text-sm font-bold uppercase tracking-widest mb-4 text-slate-500 dark:text-slate-400">7-Day Outlook</h2>
                          <div className="space-y-1">
                            {weather.daily.map((day, index) => (
                              <div key={index} className="grid grid-cols-3 items-center gap-4 p-4 rounded-2xl hover:bg-white/30 dark:hover:bg-white/5 transition-all duration-200 group">
                                <p className="font-semibold text-left text-slate-800 dark:text-slate-200">{day.time}</p>
                                <div className="flex justify-center items-center">
                                  <WeatherIcon weatherCode={day.weatherCode} isDay={true} className="w-7 h-7 text-blue-500 dark:text-blue-400 group-hover:rotate-12 transition-transform" />
                                </div>
                                <p className="font-bold text-right tabular-nums">
                                  <span className="text-slate-900 dark:text-white">{day.tempMax}°</span>
                                  <span className="text-slate-500/60 dark:text-slate-400/60 ml-3 text-sm">/ {day.tempMin}°</span>
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="flex flex-col items-center justify-center text-center py-20 bg-background/30 backdrop-blur-md rounded-3xl border border-dashed border-slate-400/30"
                  >
                    <AlertCircle className="w-16 h-16 text-slate-400/50 mb-4" />
                    <h2 className="text-2xl font-semibold mb-2 text-slate-800 dark:text-slate-200">Awaiting Search</h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-xs px-4">Press ⌘K or use the search bar above to find your city.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
            <footer className="text-center mt-12 text-slate-500/40 dark:text-slate-400/20 flex flex-col items-center space-y-1">
              <p className="text-xs font-medium tracking-widest uppercase">Nimbus Weather System</p>
              <p className="text-[10px]">Cloudflare Edge • Open-Meteo API</p>
              <p className="text-[8px] opacity-30 mt-4 italic">v1.0.4 • after private</p>
            </footer>
          </div>
        </div>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search global cities..." />
        <CommandList>
          <CommandEmpty>No cities found.</CommandEmpty>
          <CommandGroup heading="Quick Access">
            {['London', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Berlin', 'Dubai'].map((city) => (
              <CommandItem key={city} onSelect={() => handleSelectCity(city)} className="cursor-pointer">
                <MapPin className="mr-2 h-4 w-4 opacity-50" />
                <span>{city}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
      <Toaster richColors position="bottom-right" />
    </>
  );
}
const DetailCard = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
  <div className="flex items-center gap-4 p-4 bg-white/20 dark:bg-white/5 rounded-2xl border border-white/20 hover:bg-white/30 dark:hover:bg-white/10 transition-colors cursor-default">
    <div className="bg-white/40 dark:bg-white/10 p-2 rounded-lg">
      <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
    </div>
    <div>
      <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-slate-400">{label}</p>
      <p className="font-bold text-lg text-slate-900 dark:text-slate-100 leading-none mt-0.5">{value}</p>
    </div>
  </div>
);
const WeatherSkeleton = () => (
  <Card className="bg-white/40 dark:bg-black/20 backdrop-blur-xl border-white/30 shadow-lg">
    <CardContent className="p-6 md:p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col items-center md:items-start space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64 rounded-lg" />
            <Skeleton className="h-4 w-40 rounded-lg" />
          </div>
          <div className="flex items-center gap-6">
            <Skeleton className="w-24 h-24 rounded-3xl" />
            <div className="space-y-2">
              <Skeleton className="h-20 w-32 rounded-xl" />
              <Skeleton className="h-6 w-40 rounded-lg" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
        </div>
      </div>
      <hr className="my-10 border-slate-900/5" />
      <div className="space-y-6">
        <Skeleton className="h-4 w-32 rounded-lg" />
        <div className="flex space-x-4 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-4 flex-shrink-0 w-24">
              <Skeleton className="h-4 w-12 rounded-lg" />
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="h-6 w-10 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);