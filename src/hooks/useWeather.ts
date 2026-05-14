import { useEffect, useCallback, useRef } from 'react';
import { useWeatherStore } from '@/store/weatherStore';
import { processWeatherData } from '@/lib/weather';
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';
export function useWeather() {
  const setLocation = useWeatherStore(s => s.setLocation);
  const setWeather = useWeatherStore(s => s.setWeather);
  const setLoading = useWeatherStore(s => s.setLoading);
  const setError = useWeatherStore(s => s.setError);
  const reset = useWeatherStore(s => s.reset);
  const location = useWeatherStore(s => s.location);
  const hasInitialized = useRef(false);
  const fetchWeatherForCoords = useCallback(async (latitude: number, longitude: number, name: string, country: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m',
        hourly: 'temperature_2m,weather_code,is_day',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min',
        timezone: 'auto',
      });
      const response = await fetch(`${WEATHER_API}?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch weather data from service.');
      const data = await response.json();
      const processedData = processWeatherData(data);
      setWeather(processedData);
      setLocation({ name, country, latitude, longitude });
    } catch (err) {
      console.error('[WEATHER_FETCH_ERROR]', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching weather.');
    } finally {
      setLoading(false);
    }
  }, [setLocation, setWeather, setLoading, setError]);
  const fetchWeatherForCity = useCallback(async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const geoResponse = await fetch(`${GEOCODING_API}?name=${encodeURIComponent(city)}&count=1`);
      if (!geoResponse.ok) throw new Error('Failed to reach geocoding service.');
      const geoData = await geoResponse.json();
      if (!geoData.results || geoData.results.length === 0) {
        throw new Error(`Could not find location: ${city}`);
      }
      const { latitude, longitude, name, country } = geoData.results[0];
      await fetchWeatherForCoords(latitude, longitude, name, country);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during search.');
      setLoading(false);
    }
  }, [fetchWeatherForCoords, setLoading, setError]);
  const fetchWeatherForCurrentUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported. Showing default location.');
      fetchWeatherForCity('London');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherForCoords(latitude, longitude, 'Your Location', '');
      },
      (error) => {
        console.warn('[GEOLOCATION_DENIED]', error);
        setError('Location access denied. Showing default location.');
        fetchWeatherForCity('London');
      },
      { timeout: 10000 }
    );
  }, [fetchWeatherForCity, fetchWeatherForCoords, setLoading, setError]);
  useEffect(() => {
    if (!location && !hasInitialized.current) {
      hasInitialized.current = true;
      fetchWeatherForCurrentUserLocation();
    }
  }, [location, fetchWeatherForCurrentUserLocation]);
  return { fetchWeatherForCity, fetchWeatherForCurrentUserLocation, reset };
}