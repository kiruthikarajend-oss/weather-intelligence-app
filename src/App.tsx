import React, { useState, useEffect } from 'react';
import { Location, WeatherResponse } from './types';
import { fetchWeather } from './api';
import { SearchBar } from './components/SearchBar';
import { HeroView } from './components/HeroView';
import { ForecastBar } from './components/ForecastBar';
import { GraphView } from './components/GraphView';
import { RecommendationsView } from './components/RecommendationsView';

function App() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  useEffect(() => {
    const savedLocation = localStorage.getItem('lastSelectedLocation');
    if (savedLocation) {
      try {
        const loc = JSON.parse(savedLocation);
        handleLocationSelect(loc);
      } catch (e) {
        // Ignore JSON parse error
      }
    }
  }, []);

  const handleLocationSelect = async (loc: Location) => {
    setSelectedLocation(loc);
    localStorage.setItem('lastSelectedLocation', JSON.stringify(loc));
    setSelectedDayIndex(0); // Reset to today when new location selected
    
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(loc.latitude, loc.longitude);
      setWeather(data);
    } catch (err) {
      setError('Network failure. Could not fetch weather data.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header / Search */}
        <div className="flex flex-col items-center justify-center mb-10 pt-4">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-md transform rotate-3">
              <i className="fa-solid fa-cloud-sun"></i>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-gray-800">
              Weather Intelligence
            </h1>
          </div>
          
          <SearchBar onLocationSelect={handleLocationSelect} />
        </div>

        {/* Empty State */}
        {!selectedLocation && !loading && !error && (
          <div className="flex flex-col items-center justify-center mt-20 text-center opacity-60">
            <i className="fa-solid fa-earth-americas text-6xl text-gray-300 mb-6"></i>
            <h2 className="text-xl font-medium text-gray-600">No Location Selected</h2>
            <p className="text-gray-400 mt-2">Search for a city above to get your 7-day forecast.</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center mt-32 text-blue-600">
            <i className="fa-solid fa-spinner fa-spin text-4xl mb-4"></i>
            <p className="font-medium">Fetching atmosphere data...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center mt-32 text-red-500">
            <i className="fa-solid fa-triangle-exclamation text-4xl mb-4"></i>
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Weather Dashboard */}
        {selectedLocation && weather && !loading && (
          <div className="w-full flex flex-col pb-16 fade-in-up">
            <HeroView 
              locationName={selectedLocation.name}
              daily={weather.daily}
              hourly={weather.hourly}
              selectedDayIndex={selectedDayIndex}
            />

            <ForecastBar 
              daily={weather.daily}
              selectedDayIndex={selectedDayIndex}
              onSelectDay={setSelectedDayIndex}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full mt-2">
              <GraphView 
                hourly={weather.hourly}
                selectedDateStr={weather.daily.time[selectedDayIndex]}
              />
              
              <RecommendationsView 
                locationName={selectedLocation.name}
                daily={weather.daily}
                selectedDayIndex={selectedDayIndex}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
