import React from 'react';
import { DailyData } from '../types';
import { getWeatherIconClass } from '../utils';
import { format, parseISO } from 'date-fns';

interface ForecastBarProps {
  daily: DailyData;
  selectedDayIndex: number;
  onSelectDay: (index: number) => void;
}

export const ForecastBar: React.FC<ForecastBarProps> = ({ daily, selectedDayIndex, onSelectDay }) => {
  return (
    <div className="w-full mt-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4 px-2">7-Day Forecast</h3>
      <div className="flex overflow-x-auto pb-6 pt-2 px-2 space-x-4 snap-x snap-mandatory hide-scrollbar">
        {daily.time.map((dateStr, idx) => {
          const isSelected = selectedDayIndex === idx;
          const dateObj = parseISO(dateStr);
          const dayName = idx === 0 ? 'Today' : format(dateObj, 'EEE');
          const maxT = Math.round(daily.temperature_2m_max[idx]);
          const minT = Math.round(daily.temperature_2m_min[idx]);
          const iconClass = getWeatherIconClass(daily.weather_code[idx]);

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDay(idx)}
              className={`flex-shrink-0 snap-center w-28 p-4 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border-2 ${
                isSelected 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105' 
                  : 'bg-white text-gray-700 border-gray-100 shadow-sm hover:border-blue-300'
              }`}
            >
              <span className={`text-sm font-medium mb-3 ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                {dayName}
              </span>
              <div className="text-3xl mb-3 drop-shadow-sm">
                <i className={`${iconClass} ${isSelected && iconClass.includes('text-') ? '!text-white' : ''}`}></i>
              </div>
              <div className="flex space-x-2 text-sm font-bold">
                <span>{maxT}°</span>
                <span className={isSelected ? 'text-blue-200' : 'text-gray-400'}>{minT}°</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
