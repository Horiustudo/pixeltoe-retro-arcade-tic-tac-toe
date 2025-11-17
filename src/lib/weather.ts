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
  }[];
  daily: {
    time: string;
    weatherCode: number;
    tempMax: number;
    tempMin: number;
  }[];
}
export const processWeatherData = (apiData: any): WeatherData => {
  const { current, hourly, daily } = apiData;
  const processedCurrent = {
    time: current.time,
    temperature: Math.round(current.temperature_2m),
    apparentTemperature: Math.round(current.apparent_temperature),
    humidity: current.relative_humidity_2m,
    precipitation: current.precipitation,
    weatherCode: current.weather_code,
    windSpeed: Math.round(current.wind_speed_10m),
    isDay: current.is_day === 1,
  };
  const processedHourly = hourly.time.slice(0, 24).map((time: string, index: number) => ({
    time: format(parseISO(time), 'ha'),
    temperature: Math.round(hourly.temperature_2m[index]),
    weatherCode: hourly.weather_code[index],
  }));
  const processedDaily = daily.time.map((time: string, index: number) => ({
    time: format(parseISO(time), 'EEEE'),
    weatherCode: daily.weather_code[index],
    tempMax: Math.round(daily.temperature_2m_max[index]),
    tempMin: Math.round(daily.temperature_2m_min[index]),
  }));
  return {
    current: processedCurrent,
    hourly: processedHourly,
    daily: processedDaily,
  };
};
const WMO_CODES: { [key: number]: { description: string; icon: string; dayIcon?: string; nightIcon?: string } } = {
  0: { description: 'Clear sky', icon: 'Sun', dayIcon: 'Sun', nightIcon: 'Moon' },
  1: { description: 'Mainly clear', icon: 'CloudSun', dayIcon: 'CloudSun', nightIcon: 'CloudMoon' },
  2: { description: 'Partly cloudy', icon: 'Cloud', dayIcon: 'CloudSun', nightIcon: 'CloudMoon' },
  3: { description: 'Overcast', icon: 'Cloud' },
  45: { description: 'Fog', icon: 'CloudFog' },
  48: { description: 'Depositing rime fog', icon: 'CloudFog' },
  51: { description: 'Light drizzle', icon: 'CloudDrizzle' },
  53: { description: 'Moderate drizzle', icon: 'CloudDrizzle' },
  55: { description: 'Dense drizzle', icon: 'CloudDrizzle' },
  56: { description: 'Light freezing drizzle', icon: 'CloudDrizzle' },
  57: { description: 'Dense freezing drizzle', icon: 'CloudDrizzle' },
  61: { description: 'Slight rain', icon: 'CloudRain' },
  63: { description: 'Moderate rain', icon: 'CloudRain' },
  65: { description: 'Heavy rain', icon: 'CloudRain' },
  66: { description: 'Light freezing rain', icon: 'CloudRain' },
  67: { description: 'Heavy freezing rain', icon: 'CloudRain' },
  71: { description: 'Slight snow fall', icon: 'CloudSnow' },
  73: { description: 'Moderate snow fall', icon: 'CloudSnow' },
  75: { description: 'Heavy snow fall', icon: 'CloudSnow' },
  77: { description: 'Snow grains', icon: 'CloudSnow' },
  80: { description: 'Slight rain showers', icon: 'CloudRain' },
  81: { description: 'Moderate rain showers', icon: 'CloudRain' },
  82: { description: 'Violent rain showers', icon: 'CloudRain' },
  85: { description: 'Slight snow showers', icon: 'CloudSnow' },
  86: { description: 'Heavy snow showers', icon: 'CloudSnow' },
  95: { description: 'Thunderstorm', icon: 'CloudLightning' },
  96: { description: 'Thunderstorm with slight hail', icon: 'CloudHail' },
  99: { description: 'Thunderstorm with heavy hail', icon: 'CloudHail' },
};
export const getWeatherInterpretation = (code: number, isDay: boolean = true) => {
  const weather = WMO_CODES[code];
  if (!weather) return { description: 'Unknown', icon: 'Sun' };
  if (isDay && weather.dayIcon) {
    return { ...weather, icon: weather.dayIcon };
  }
  if (!isDay && weather.nightIcon) {
    return { ...weather, icon: weather.nightIcon };
  }
  return weather;
};