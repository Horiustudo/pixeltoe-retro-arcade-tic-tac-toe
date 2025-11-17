import React from 'react';
import {
  Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, Wind, CloudDrizzle, SunSnow, CloudSun, CloudHail, Tornado, LucideProps, Moon, CloudMoon
} from 'lucide-react';
import { getWeatherInterpretation } from '@/lib/weather';
interface WeatherIconProps extends LucideProps {
  weatherCode: number;
  isDay?: boolean;
}
const iconMap: { [key: string]: React.ElementType } = {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Wind,
  CloudDrizzle,
  SunSnow,
  CloudSun,
  CloudHail,
  Tornado,
  Moon,
  CloudMoon,
};
export function WeatherIcon({ weatherCode, isDay = true, ...props }: WeatherIconProps) {
  const interpretation = getWeatherInterpretation(weatherCode, isDay);
  if (!interpretation) return <Sun {...props} />;
  const IconComponent = iconMap[interpretation.icon];
  if (!IconComponent) return <Sun {...props} />;
  return <IconComponent {...props} />;
}