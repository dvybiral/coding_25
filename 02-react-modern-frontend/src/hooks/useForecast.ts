import { useState } from 'react';

interface ForecastItem {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
}

interface ForecastData {
  list: ForecastItem[];
  city: {
    name: string;
    country: string;
  };
}

interface DailyForecast {
  date: string;
  dayName: string;
  tempMin: number;
  tempMax: number;
  condition: string;
  icon: string;
}

interface UseForecastReturn {
  forecastData: DailyForecast[] | null;
  loading: boolean;
  error: string;
  fetchForecast: (city: string) => Promise<void>;
}

const useForecast = (): UseForecastReturn => {
  const [forecastData, setForecastData] = useState<DailyForecast[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const processForecastData = (data: ForecastData): DailyForecast[] => {
    // Group forecast items by day
    const dailyData = new Map<string, ForecastItem[]>();
    
    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
      
      if (!dailyData.has(dateKey)) {
        dailyData.set(dateKey, []);
      }
      dailyData.get(dateKey)?.push(item);
    });

    // Convert to daily forecast (get 5 days)
    const dailyForecasts: DailyForecast[] = [];
    const sortedDates = Array.from(dailyData.keys()).sort().slice(0, 5);

    sortedDates.forEach((dateKey) => {
      const dayItems = dailyData.get(dateKey) || [];
      
      if (dayItems.length === 0) return;

      // Calculate min/max temps for the day
      const temps = dayItems.map(item => item.main.temp);
      const tempMin = Math.round(Math.min(...temps));
      const tempMax = Math.round(Math.max(...temps));

      // Get most common weather condition
      const weatherCounts = new Map<string, number>();
      dayItems.forEach(item => {
        const condition = item.weather[0].main;
        weatherCounts.set(condition, (weatherCounts.get(condition) || 0) + 1);
      });
      
      let mostCommonCondition = dayItems[0].weather[0].main;
      let mostCommonIcon = dayItems[0].weather[0].icon;
      let maxCount = 0;

      weatherCounts.forEach((count, condition) => {
        if (count > maxCount) {
          maxCount = count;
          mostCommonCondition = condition;
          // Find the icon for this condition
          const itemWithCondition = dayItems.find(item => item.weather[0].main === condition);
          if (itemWithCondition) {
            mostCommonIcon = itemWithCondition.weather[0].icon;
          }
        }
      });

      // Get day name
      const date = new Date(dateKey);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

      dailyForecasts.push({
        date: dateKey,
        dayName,
        tempMin,
        tempMax,
        condition: mostCommonCondition,
        icon: mostCommonIcon,
      });
    });

    return dailyForecasts;
  };

  const fetchForecast = async (city: string) => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    
    if (!apiKey || apiKey === 'your_api_key_here') {
      setError('API key is missing. Please add your OpenWeatherMap API key to the .env file.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`City "${city}" not found. Please check the spelling and try again.`);
        } else if (response.status === 401) {
          throw new Error('Invalid API key. Please check your API key in the .env file.');
        } else {
          throw new Error('Failed to fetch forecast data. Please try again later.');
        }
      }

      const data = await response.json();
      const processedData = processForecastData(data);
      setForecastData(processedData);
      setError('');
    } catch (err) {
      setForecastData(null);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    forecastData,
    loading,
    error,
    fetchForecast,
  };
};

export default useForecast;
export type { DailyForecast };

