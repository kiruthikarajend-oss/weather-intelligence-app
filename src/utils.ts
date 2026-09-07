export const getWeatherIconClass = (code: number, isNight: boolean = false): string => {
  if (code === 0) {
    return isNight ? 'fa-solid fa-moon' : 'fa-solid fa-sun text-yellow-500';
  }
  if (code >= 1 && code <= 3) {
    // 1: Mainly clear, 2: partly cloudy, 3: overcast
    if (code === 3) return 'fa-solid fa-cloud text-gray-500';
    return isNight ? 'fa-solid fa-cloud-moon text-indigo-300' : 'fa-solid fa-cloud-sun text-yellow-500';
  }
  if (code >= 45 && code <= 48) {
    // Fog
    return 'fa-solid fa-smog text-gray-400';
  }
  if (code >= 51 && code <= 67) {
    // Drizzle / Rain
    return 'fa-solid fa-cloud-rain text-blue-400';
  }
  if (code >= 71 && code <= 77) {
    // Snow
    return 'fa-solid fa-snowflake text-blue-200';
  }
  if (code >= 80 && code <= 82) {
    // Rain showers
    return 'fa-solid fa-cloud-showers-heavy text-blue-600';
  }
  if (code >= 85 && code <= 86) {
    // Snow showers
    return 'fa-solid fa-snowflake text-blue-300';
  }
  if (code >= 95 && code <= 99) {
    // Thunderstorm
    return 'fa-solid fa-bolt text-yellow-600';
  }
  return 'fa-solid fa-cloud text-gray-400'; // Default
};

export const getWeatherDescription = (code: number): string => {
  if (code === 0) return 'Clear sky';
  if (code === 1) return 'Mainly clear';
  if (code === 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if (code >= 45 && code <= 48) return 'Fog';
  if (code >= 51 && code <= 55) return 'Drizzle';
  if (code >= 56 && code <= 57) return 'Freezing Drizzle';
  if (code >= 61 && code <= 65) return 'Rain';
  if (code >= 66 && code <= 67) return 'Freezing Rain';
  if (code >= 71 && code <= 75) return 'Snow fall';
  if (code === 77) return 'Snow grains';
  if (code >= 80 && code <= 82) return 'Rain showers';
  if (code >= 85 && code <= 86) return 'Snow showers';
  if (code >= 95 && code <= 99) return 'Thunderstorm';
  return 'Unknown';
};
