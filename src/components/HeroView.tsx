import React from 'react';
import { DailyData, HourlyData } from '../types';
import { getWeatherIconClass, getWeatherDescription } from '../utils';
import { format, parseISO } from 'date-fns';

interface HeroViewProps {
  locationName: string;
  daily: DailyData;
  hourly: HourlyData;
  selectedDayIndex: number;
}

export const HeroView: React.FC<HeroViewProps> = ({ locationName, daily, hourly, selectedDayIndex }) => {
  const dateStr = daily.time[selectedDayIndex];
  const dateObj = parseISO(dateStr);
  const displayDate = format(dateObj, 'EEEE, MMMM do');
  
  const maxTemp = daily.temperature_2m_max[selectedDayIndex];
  const minTemp = daily.temperature_2m_min[selectedDayIndex];
  const weatherCode = daily.weather_code[selectedDayIndex];
  const precipProb = daily.precipitation_probability_max[selectedDayIndex];
  const sunrise = format(parseISO(daily.sunrise[selectedDayIndex]), 'h:mm a');
  const sunset = format(parseISO(daily.sunset[selectedDayIndex]), 'h:mm a');

  // To display the main temp, if today (index 0), find current hour temp, else show max temp
  let displayTemp = maxTemp;
  if (selectedDayIndex === 0) {
    const currentHourIndex = hourly.time.findIndex(t => new Date(t).getHours() === new Date().getHours());
    if (currentHourIndex !== -1) {
      displayTemp = hourly.temperature_2m[currentHourIndex];
    }
  }

  // Very rough day/night check for currently selected index if today
  const isNight = selectedDayIndex === 0 && (new Date().getHours() < 6 || new Date().getHours() > 20);

  return (
    <div className="w-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-sm border border-blue-100/50 mb-8 mt-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-5 pointer-events-none">
        <i className={`${getWeatherIconClass(weatherCode, isNight)} text-[300px]`}></i>
      </div>
      
      <h1 className="text-3xl md:text-5xl font-bold text-gray-800 tracking-tight z-10">{locationName}</h1>
      <p className="text-lg text-gray-500 mt-2 z-10">{displayDate}</p>

      <div className="flex flex-col md:flex-row items-center mt-8 space-y-4 md:space-y-0 md:space-x-8 z-10">
        <div className="text-6xl text-blue-600 drop-shadow-sm">
          <i className={getWeatherIconClass(weatherCode, isNight)}></i>
        </div>
        <div className="flex flex-col items-center md:items-start">
          <span className="text-6xl font-black text-gray-800">{Math.round(displayTemp)}°</span>
          <span className="text-xl text-gray-600 font-medium capitalize mt-1">
            {getWeatherDescription(weatherCode)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-3xl mt-12 z-10">
        <div className="flex flex-col items-center p-4 bg-white/60 rounded-2xl backdrop-blur-sm border border-white">
          <i className="fa-solid fa-temperature-arrow-up text-red-400 mb-2 text-xl"></i>
          <span className="text-sm text-gray-500 font-medium">High</span>
          <span className="text-lg font-bold text-gray-800">{Math.round(maxTemp)}°</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white/60 rounded-2xl backdrop-blur-sm border border-white">
          <i className="fa-solid fa-temperature-arrow-down text-blue-400 mb-2 text-xl"></i>
          <span className="text-sm text-gray-500 font-medium">Low</span>
          <span className="text-lg font-bold text-gray-800">{Math.round(minTemp)}°</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white/60 rounded-2xl backdrop-blur-sm border border-white">
          <i className="fa-solid fa-umbrella text-indigo-400 mb-2 text-xl"></i>
          <span className="text-sm text-gray-500 font-medium">Precipitation</span>
          <span className="text-lg font-bold text-gray-800">{precipProb}%</span>
        </div>
        <div className="flex flex-col items-center p-4 bg-white/60 rounded-2xl backdrop-blur-sm border border-white">
          <div className="flex space-x-2 text-orange-400 mb-2 text-xl">
            <i className="fa-solid fa-sunrise"></i>
            <i className="fa-solid fa-sunset"></i>
          </div>
          <span className="text-sm text-gray-500 font-medium">Sun</span>
          <span className="text-sm font-bold text-gray-800 text-center whitespace-nowrap">
            {sunrise} / {sunset}
          </span>
        </div>
      </div>
    </div>
  );
};
