import axios from 'axios';
import { GeocodingResponse, WeatherResponse } from './types';

export const fetchLocations = async (query: string): Promise<GeocodingResponse> => {
  const response = await axios.get(`https://geocoding-api.open-meteo.com/v1/search`, {
    params: {
      name: query,
      count: 10,
      language: 'en',
      format: 'json'
    }
  });
  return response.data;
};

export const fetchWeather = async (lat: number, lon: number): Promise<WeatherResponse> => {
  const response = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
    params: {
      latitude: lat,
      longitude: lon,
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunset,sunrise,precipitation_probability_max',
      hourly: 'temperature_2m,precipitation_probability',
      timezone: 'auto'
    }
  });
  return response.data;
};

export const fetchRecommendations = async (
  locationName: string,
  date: string,
  maxTemp: number,
  minTemp: number,
  weatherCode: number,
  precipitationProb: number
): Promise<string> => {
  const response = await axios.post('/api/recommendations', {
    locationName,
    date,
    maxTemp,
    minTemp,
    weatherCode,
    precipitationProb
  });
  return response.data.recommendations;
};
