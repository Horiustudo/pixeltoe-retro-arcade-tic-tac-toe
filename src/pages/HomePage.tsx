import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { format } from 'date-fns';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useWeatherStore } from '@/store/weatherStore';
import { useWeather } from '@/hooks/useWeather';
import { getWeatherInterpretation } from '@/lib/weather';
import { WeatherIcon } from '@/components/WeatherIcon';
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
  const weatherInterpretation = weather ? getWeatherInterpretation(weather.current.weatherCode, weather.current.isDay) : null;
  return (
    <>
      <div className="min-h-screen w-full bg-gradient-animated">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <header className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Nimbus Weather</h1>
              <Button variant="outline" onClick={() => setOpen(true)} className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span>Search city...</span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>
            </header>
            <main>
              <AnimatePresence mode="wait">
                {loading ? (
                  <WeatherSkeleton />
                ) : weather && location && weatherInterpretation ? (
                  <motion.div
                    key={location.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="bg-card/60 dark:bg-card/40 backdrop-blur-sm border-white/20 dark:border-black/20 shadow-lg">
                      <CardContent className="p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Left Side: Current Weather */}
                          <div className="flex flex-col items-center justify-center text-center md:items-start md:text-left">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="h-5 w-5" />
                              <p className="text-xl font-medium text-foreground">{location.name}, {location.country}</p>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">{format(new Date(), "eeee, MMMM do")}</p>
                            <div className="flex items-center gap-4">
                              <WeatherIcon weatherCode={weather.current.weatherCode} isDay={weather.current.isDay} className="w-24 h-24 text-blue-400" />
                              <div>
                                <span className="font-display text-7xl md:text-8xl font-bold">{weather.current.temperature}°</span>
                                <p className="text-lg font-semibold text-foreground -mt-2">{weatherInterpretation.description}</p>
                              </div>
                            </div>
                          </div>
                          {/* Right Side: Details */}
                          <div className="grid grid-cols-2 gap-4 text-center md:text-left">
                            <DetailCard icon={Thermometer} label="Feels like" value={`${weather.current.apparentTemperature}°`} />
                            <DetailCard icon={Wind} label="Wind" value={`${weather.current.windSpeed} km/h`} />
                            <DetailCard icon={Droplets} label="Humidity" value={`${weather.current.humidity}%`} />
                            <DetailCard icon={Gauge} label="Precipitation" value={`${weather.current.precipitation} mm`} />
                          </div>
                        </div>
                        <hr className="my-8 border-border/50" />
                        {/* Hourly Forecast */}
                        <div>
                          <h2 className="text-lg font-semibold mb-4">Hourly Forecast</h2>
                          <div className="flex overflow-x-auto space-x-4 pb-4 -mx-6 px-6">
                            {weather.hourly.map((hour, index) => (
                              <div key={index} className="flex flex-col items-center space-y-2 flex-shrink-0 w-20 text-center p-2 rounded-lg hover:bg-accent/50 transition-colors">
                                <p className="text-sm font-medium text-muted-foreground">{hour.time}</p>
                                <WeatherIcon weatherCode={hour.weatherCode} isDay={weather.current.isDay} className="w-8 h-8 text-blue-400" />
                                <p className="text-lg font-bold">{hour.temperature}°</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <hr className="my-8 border-border/50" />
                        {/* 7-Day Forecast */}
                        <div>
                          <h2 className="text-lg font-semibold mb-4">7-Day Forecast</h2>
                          <div className="space-y-2">
                            {weather.daily.map((day, index) => (
                              <div key={index} className="grid grid-cols-3 items-center gap-4 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                                <p className="font-medium text-left">{day.time}</p>
                                <div className="flex justify-center items-center gap-2">
                                  <WeatherIcon weatherCode={day.weatherCode} className="w-7 h-7 text-blue-400" />
                                </div>
                                <p className="font-medium text-right">
                                  <span className="font-bold">{day.tempMax}°</span>
                                  <span className="text-muted-foreground"> / {day.tempMin}°</span>
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-20">
                    <AlertCircle className="w-16 h-16 text-destructive mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
                    <p className="text-muted-foreground">Could not load weather data. Please try searching for a city.</p>
                  </div>
                )}
              </AnimatePresence>
            </main>
            <footer className="text-center mt-12 text-sm text-muted-foreground">
              <p>Built with ❤️ at Cloudflare</p>
            </footer>
          </div>
        </div>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a city name..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => handleSelectCity('New York')}>New York</CommandItem>
            <CommandItem onSelect={() => handleSelectCity('London')}>London</CommandItem>
            <CommandItem onSelect={() => handleSelectCity('Tokyo')}>Tokyo</CommandItem>
            <CommandItem onSelect={() => handleSelectCity('Paris')}>Paris</CommandItem>
            <CommandItem onSelect={() => handleSelectCity('Sydney')}>Sydney</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
      <Toaster richColors />
    </>
  );
}
const DetailCard = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
  <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
    <Icon className="w-6 h-6 text-blue-400" />
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-bold text-lg">{value}</p>
    </div>
  </div>
);
const WeatherSkeleton = () => (
  <Card className="bg-card/60 dark:bg-card/40 backdrop-blur-sm">
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
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
      <hr className="my-8" />
      <div>
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="flex space-x-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-6 w-8" />
            </div>
          ))}
        </div>
      </div>
      <hr className="my-8" />
      <div>
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-2">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="w-7 h-7 rounded-full" />
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);