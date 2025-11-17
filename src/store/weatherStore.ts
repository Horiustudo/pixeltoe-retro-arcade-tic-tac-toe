import { create } from 'zustand';
import { WeatherData } from '@/lib/weather';
interface Location {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}
interface WeatherState {
  location: Location | null;
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  setLocation: (location: Location) => void;
  setWeather: (weather: WeatherData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}
export const useWeatherStore = create<WeatherState>((set) => ({
  location: null,
  weather: null,
  loading: true,
  error: null,
  setLocation: (location) => set({ location }),
  setWeather: (weather) => set({ weather }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () => set({ location: null, weather: null, loading: true, error: null }),
}));