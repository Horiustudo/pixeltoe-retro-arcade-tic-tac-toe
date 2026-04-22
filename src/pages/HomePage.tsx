import React, { useEffect, useState } from 'react';
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
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);
  const handleSelectCity = (city: string) => {
    fetchWeatherForCity(city);
    setOpen(false);
  };
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
      <div className={cn("min-h-screen w-full transition-colors duration-1000", bgClass)}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <header className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Nimbus Weather</h1>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setOpen(true)} className="flex items-center gap-2 bg-background/50 backdrop-blur-sm">
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline">Search city...</span>
                  <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </Button>
                <ThemeToggle className="static" />
              </div>
            </header>
            <main>
              <AnimatePresence mode="wait">
                {loading ? (
                  <WeatherSkeleton />
                ) : weather && location && interpretation ? (
                  <motion.div
                    key={location.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="bg-white/40 dark:bg-black/20 backdrop-blur-md border-white/20 dark:border-white/10 shadow-2xl overflow-hidden">
                      <CardContent className="p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="flex flex-col items-center justify-center text-center md:items-start md:text-left">
                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                              <MapPin className="h-5 w-5" />
                              <p className="text-xl font-medium">{location.name}, {location.country}</p>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{format(new Date(), "eeee, MMMM do")}</p>
                            <div className="flex items-center gap-4">
                              <WeatherIcon weatherCode={weather.current.weatherCode} isDay={weather.current.isDay} className="w-24 h-24 text-blue-500 dark:text-blue-400 floating" />
                              <div>
                                <span className="font-display text-7xl md:text-8xl font-bold tracking-tighter text-slate-900 dark:text-white">{weather.current.temperature}°</span>
                                <p className="text-lg font-semibold text-slate-800 dark:text-slate-200 -mt-2">{interpretation.description}</p>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <DetailCard icon={Thermometer} label="Feels like" value={`${weather.current.apparentTemperature}°`} />
                            <DetailCard icon={Wind} label="Wind" value={`${weather.current.windSpeed} km/h`} />
                            <DetailCard icon={Droplets} label="Humidity" value={`${weather.current.humidity}%`} />
                            <DetailCard icon={Gauge} label="Rain" value={`${weather.current.precipitation} mm`} />
                          </div>
                        </div>
                        <hr className="my-8 border-slate-200/50 dark:border-slate-800/50" />
                        <div>
                          <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Hourly Forecast</h2>
                          <div className="flex overflow-x-auto space-x-4 pb-4 -mx-6 px-6 no-scrollbar">
                            {weather.hourly.map((hour, index) => (
                              <div key={index} className="flex flex-col items-center space-y-2 flex-shrink-0 w-20 text-center p-3 rounded-xl hover:bg-white/20 dark:hover:bg-white/5 transition-colors">
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{hour.time}</p>
                                <WeatherIcon weatherCode={hour.weatherCode} isDay={weather.current.isDay} className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                                <p className="text-base font-bold text-slate-800 dark:text-slate-100">{hour.temperature}°</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <hr className="my-8 border-slate-200/50 dark:border-slate-800/50" />
                        <div>
                          <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">7-Day Forecast</h2>
                          <div className="space-y-1">
                            {weather.daily.map((day, index) => (
                              <div key={index} className="grid grid-cols-3 items-center gap-4 p-3 rounded-xl hover:bg-white/20 dark:hover:bg-white/5 transition-colors">
                                <p className="font-medium text-left text-slate-700 dark:text-slate-300">{day.time}</p>
                                <div className="flex justify-center items-center gap-2">
                                  <WeatherIcon weatherCode={day.weatherCode} className="w-7 h-7 text-blue-500 dark:text-blue-400" />
                                </div>
                                <p className="font-medium text-right">
                                  <span className="font-bold text-slate-900 dark:text-white">{day.tempMax}°</span>
                                  <span className="text-slate-400 ml-2">/ {day.tempMin}°</span>
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-20 bg-background/50 backdrop-blur-sm rounded-3xl border border-dashed border-muted-foreground/20">
                    <AlertCircle className="w-16 h-16 text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">No data found</h2>
                    <p className="text-muted-foreground max-w-xs">Please search for a city to see the weather forecast.</p>
                  </div>
                )}
              </AnimatePresence>
            </main>
            <footer className="text-center mt-12 text-sm text-slate-500/60">
              <p>Built with ❤️ at Cloudflare • Open-Meteo API</p>
            </footer>
          </div>
        </div>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search city..." />
        <CommandList>
          <CommandEmpty>No cities found.</CommandEmpty>
          <CommandGroup heading="Quick Access">
            {['New York', 'London', 'Tokyo', 'Paris', 'Sydney', 'Berlin', 'Dubai'].map((city) => (
              <CommandItem key={city} onSelect={() => handleSelectCity(city)}>
                <MapPin className="mr-2 h-4 w-4" />
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
  <div className="flex items-center gap-3 p-3 bg-white/30 dark:bg-white/5 rounded-xl border border-white/20">
    <Icon className="w-6 h-6 text-blue-500 dark:text-blue-400" />
    <div>
      <p className="text-2xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">{label}</p>
      <p className="font-bold text-lg text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  </div>
);
const WeatherSkeleton = () => (
  <Card className="bg-white/40 dark:bg-black/20 backdrop-blur-md border-white/20">
    <CardContent className="p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center md:items-start space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
          <div className="flex items-center gap-4">
            <Skeleton className="w-24 h-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-20 w-32" />
              <Skeleton className="h-6 w-40" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
        </div>
      </div>
      <hr className="my-8 border-slate-200/50" />
      <div>
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="flex space-x-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-2 flex-shrink-0 w-20">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-6 w-8" />
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);