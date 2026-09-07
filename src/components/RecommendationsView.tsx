import React, { useEffect, useState } from 'react';
import { DailyData } from '../types';
import { fetchRecommendations } from '../api';
import { format, parseISO } from 'date-fns';

interface RecommendationsViewProps {
  locationName: string;
  daily: DailyData;
  selectedDayIndex: number;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({ locationName, daily, selectedDayIndex }) => {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const loadRecommendations = async () => {
      setLoading(true);
      setError(null);
      setRecommendations([]);

      try {
        const dateStr = daily.time[selectedDayIndex];
        const dateObj = parseISO(dateStr);
        const formattedDate = format(dateObj, 'MMMM do, yyyy');
        
        const recText = await fetchRecommendations(
          locationName,
          formattedDate,
          daily.temperature_2m_max[selectedDayIndex],
          daily.temperature_2m_min[selectedDayIndex],
          daily.weather_code[selectedDayIndex],
          daily.precipitation_probability_max[selectedDayIndex]
        );

        if (!isMounted) return;

        // Split by newlines, clean up dashes and empty lines
        const bulletPoints = recText
          .split('\n')
          .map(line => line.replace(/^-/, '').trim())
          .filter(line => line.length > 0);

        setRecommendations(bulletPoints);
      } catch (err) {
        if (isMounted) setError('Could not generate recommendations for this day.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadRecommendations();

    return () => {
      isMounted = false;
    };
  }, [locationName, daily, selectedDayIndex]);

  return (
    <div className="w-full bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-3xl shadow-sm border border-amber-100/50 mt-8">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-amber-500">
          <i className="fa-solid fa-wand-magic-sparkles"></i>
        </div>
        <h3 className="text-lg font-bold text-gray-800">AI Daily Recommendations</h3>
      </div>
      
      {loading ? (
        <div className="flex items-center space-x-3 text-amber-600 font-medium py-4">
          <i className="fa-solid fa-circle-notch fa-spin"></i>
          <span>Analyzing weather patterns...</span>
        </div>
      ) : error ? (
        <div className="text-red-500 text-sm py-4">{error}</div>
      ) : (
        <ul className="space-y-3">
          {recommendations.map((rec, idx) => (
            <li key={idx} className="flex items-start">
              <i className="fa-solid fa-check text-amber-500 mt-1 mr-3 text-sm"></i>
              <span className="text-gray-700 leading-relaxed">{rec}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
