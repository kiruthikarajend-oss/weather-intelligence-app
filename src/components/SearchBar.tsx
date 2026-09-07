import React, { useState } from 'react';
import { Location } from '../types';
import { fetchLocations } from '../api';

interface SearchBarProps {
  onLocationSelect: (loc: Location) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onLocationSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const data = await fetchLocations(query);
      if (data.results && data.results.length > 0) {
        setResults(data.results);
      } else {
        setError('No results found. Try a different city.');
      }
    } catch (err) {
      setError('Network failure. Could not fetch locations.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (loc: Location) => {
    onLocationSelect(loc);
    setResults([]);
    setQuery('');
  };

  return (
    <div className="w-full max-w-xl mx-auto relative z-50">
      <form onSubmit={handleSearch} className="flex items-center space-x-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a city, e.g. Toronto"
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition disabled:opacity-70"
        >
          {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-search"></i>}
        </button>
      </form>

      {error && (
        <div className="absolute top-full mt-2 w-full p-4 bg-red-50 text-red-600 rounded-xl shadow-md border border-red-100">
          <i className="fa-solid fa-triangle-exclamation mr-2"></i>{error}
        </div>
      )}

      {results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden max-h-80 overflow-y-auto">
          {results.map((loc, idx) => (
            <button
              key={`${loc.id}-${idx}`}
              onClick={() => handleSelect(loc)}
              className="w-full text-left px-5 py-4 hover:bg-gray-50 border-b border-gray-50 flex flex-col transition"
            >
              <span className="font-semibold text-gray-800">{loc.name}</span>
              <span className="text-sm text-gray-500">
                {loc.admin1 ? `${loc.admin1}, ` : ''}{loc.country}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
