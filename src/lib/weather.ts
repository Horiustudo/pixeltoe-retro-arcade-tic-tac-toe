import { format, parseISO } from 'date-fns';
export interface WeatherData {
  current: {
    time: string;
    temperature: number;
    apparentTemperature: number;
    humidity: number;
    precipitation: number;
    weatherCode: number;
    windSpeed: number;
    isDay: boolean;
  };
  hourly: {
    time: string;
    temperature: number;
    weatherCode: number;
    isDay: boolean;
  }[];
  daily: {
    time: string;
    weatherCode: number;
    tempMax: number;
    tempMin: number;
  }[];
}
export const processWeatherData = (apiData: any): WeatherData => {
  const current = apiData?.current ?? {};
  const hourly = apiData?.hourly ?? { time: [], temperature_2m: [], weather_code: [], is_day: [] };
  const daily = apiData?.daily ?? { time: [], weather_code: [], temperature_2m_max: [], temperature_2m_min: [] };
  const processedCurrent = {
    time: current.time ?? new Date().toISOString(),
    temperature: Math.round(current.temperature_2m ?? 0),
    apparentTemperature: Math.round(current.apparent_temperature ?? 0),
    humidity: current.relative_humidity_2m ?? 0,
    precipitation: current.precipitation ?? 0,
    weatherCode: current.weather_code ?? 0,
    windSpeed: Math.round(current.wind_speed_10m ?? 0),
    isDay: current.is_day === 1,
  };
  const processedHourly = (hourly.time || []).slice(0, 24).map((time: string, index: number) => ({
    time: time ? format(parseISO(time), 'ha') : '--',
    temperature: Math.round(hourly.temperature_2m?.[index] ?? 0),
    weatherCode: hourly.weather_code?.[index] ?? 0,
    isDay: hourly.is_day?.[index] === 1,
  }));
  const processedDaily = (daily.time || []).map((time: string, index: number) => ({
    time: time ? format(parseISO(time), 'EEEE') : '--',
    weatherCode: daily.weather_code?.[index] ?? 0,
    tempMax: Math.round(daily.temperature_2m_max?.[index] ?? 0),
    tempMin: Math.round(daily.temperature_2m_min?.[index] ?? 0),
  }));
  return {
    current: processedCurrent,
    hourly: processedHourly,
    daily: processedDaily,
  };
};
const WMO_CODES: { [key: number]: { description: string; icon: string; dayIcon?: string; nightIcon?: string; theme?: string } } = {
  0: { description: 'Clear sky', icon: 'Sun', dayIcon: 'Sun', nightIcon: 'Moon', theme: 'sunny' },
  1: { description: 'Mainly clear', icon: 'CloudSun', dayIcon: 'CloudSun', nightIcon: 'CloudMoon', theme: 'sunny' },
  2: { description: 'Partly cloudy', icon: 'Cloud', dayIcon: 'CloudSun', nightIcon: 'CloudMoon', theme: 'cloudy' },
  3: { description: 'Overcast', icon: 'Cloud', theme: 'cloudy' },
  45: { description: 'Fog', icon: 'CloudFog', theme: 'cloudy' },
  48: { description: 'Depositing rime fog', icon: 'CloudFog', theme: 'cloudy' },
  51: { description: 'Light drizzle', icon: 'CloudDrizzle', theme: 'rainy' },
  53: { description: 'Moderate drizzle', icon: 'CloudDrizzle', theme: 'rainy' },
  55: { description: 'Dense drizzle', icon: 'CloudDrizzle', theme: 'rainy' },
  56: { description: 'Light freezing drizzle', icon: 'CloudDrizzle', theme: 'snowy' },
  57: { description: 'Dense freezing drizzle', icon: 'CloudDrizzle', theme: 'snowy' },
  61: { description: 'Slight rain', icon: 'CloudRain', theme: 'rainy' },
  63: { description: 'Moderate rain', icon: 'CloudRain', theme: 'rainy' },
  65: { description: 'Heavy rain', icon: 'CloudRain', theme: 'rainy' },
  66: { description: 'Light freezing rain', icon: 'CloudRain', theme: 'snowy' },
  67: { description: 'Heavy freezing rain', icon: 'CloudRain', theme: 'snowy' },
  71: { description: 'Slight snow fall', icon: 'CloudSnow', theme: 'snowy' },
  73: { description: 'Moderate snow fall', icon: 'CloudSnow', theme: 'snowy' },
  75: { description: 'Heavy snow fall', icon: 'CloudSnow', theme: 'snowy' },
  77: { description: 'Snow grains', icon: 'CloudSnow', theme: 'snowy' },
  80: { description: 'Slight rain showers', icon: 'CloudRain', theme: 'rainy' },
  81: { description: 'Moderate rain showers', icon: 'CloudRain', theme: 'rainy' },
  82: { description: 'Violent rain showers', icon: 'CloudRain', theme: 'rainy' },
  85: { description: 'Slight snow showers', icon: 'CloudSnow', theme: 'snowy' },
  86: { description: 'Heavy snow showers', icon: 'CloudSnow', theme: 'snowy' },
  95: { description: 'Thunderstorm', icon: 'CloudLightning', theme: 'stormy' },
  96: { description: 'Thunderstorm with slight hail', icon: 'CloudHail', theme: 'stormy' },
  99: { description: 'Thunderstorm with heavy hail', icon: 'CloudHail', theme: 'stormy' },
};
export const getWeatherInterpretation = (code: number, isDay: boolean = true) => {
  const weather = WMO_CODES[code] ?? { description: 'Unknown', icon: 'Sun', theme: 'sunny' };
  if (!isDay && weather.nightIcon) {
    return { ...weather, icon: weather.nightIcon };
  }
  if (isDay && weather.dayIcon) {
    return { ...weather, icon: weather.dayIcon };
  }
  return weather;
};
export const getWeatherTheme = (code: number, isDay: boolean): string => {
  if (!isDay) return 'night';
  const weather = WMO_CODES[code];
  return weather?.theme ?? 'sunny';
};