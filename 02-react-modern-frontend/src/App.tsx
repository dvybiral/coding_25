import { useState } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import FavoriteCities from './components/FavoriteCities';
import { getMockWeatherByCity } from './mockData';
import './App.css';

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

const App = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState('');

  const handleSearch = (city: string) => {
    console.log('Searching for:', city);
    
    // Clear previous error
    setError('');
    
    // Simulate API call with mock data
    const mockWeather = getMockWeatherByCity(city);
    
    if (mockWeather) {
      setWeatherData(mockWeather);
    } else {
      setWeatherData(null);
      setError(`City "${city}" not found. Try: London, Tokyo, Paris, New York, Sydney, Dubai, Moscow, Singapore, Reykjavik, or Mumbai`);
      console.log('Available cities:', ['London', 'Tokyo', 'Paris', 'New York', 'Sydney', 'Dubai', 'Moscow', 'Singapore', 'Reykjavik', 'Mumbai']);
    }
  };

  return (
    <div className="app">
      <Header />
      
      <main className="main-container">
        <div className="content-wrapper">
          <div className="main-content">
            <SearchBar onSearch={handleSearch} />
            {error && (
              <div style={{
                padding: '1rem',
                marginBottom: '1rem',
                background: '#FEE',
                border: '2px solid #FCC',
                borderRadius: '10px',
                color: '#C33',
                textAlign: 'center',
                fontSize: '0.95rem',
              }}>
                {error}
              </div>
            )}
            <WeatherCard weather={weatherData} />
          </div>
          
          <div className="sidebar">
            <FavoriteCities />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
