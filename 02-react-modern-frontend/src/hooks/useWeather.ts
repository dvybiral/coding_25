import { useState } from 'react';

interface WeatherData {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

interface UseWeatherReturn {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string;
  searchedCity: string;
  fetchWeather: (city: string) => Promise<void>;
  clearError: () => void;
}

const useWeather = (): UseWeatherReturn => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchedCity, setSearchedCity] = useState('');

  const fetchWeather = async (city: string) => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    
    if (!apiKey || apiKey === 'your_api_key_here') {
      setError('API key is missing. Please add your OpenWeatherMap API key to the .env file.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    setSearchedCity(city);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`City "${city}" not found. Please check the spelling and try again.`);
        } else if (response.status === 401) {
          throw new Error('Invalid API key. Please check your API key in the .env file.');
        } else {
          throw new Error('Failed to fetch weather data. Please try again later.');
        }
      }

      const data = await response.json();
      setWeatherData(data);
      setError('');
    } catch (err) {
      setWeatherData(null);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError('');
  };

  return {
    weatherData,
    loading,
    error,
    searchedCity,
    fetchWeather,
    clearError,
  };
};

export default useWeather;
export type { WeatherData };

