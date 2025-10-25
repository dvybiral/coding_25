import { useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import Forecast from './components/Forecast';
import Loading from './components/Loading';
import ErrorMessage from './components/ErrorMessage';
import FavoriteCities from './components/FavoriteCities';
import useWeather from './hooks/useWeather';
import useForecast from './hooks/useForecast';
import useFavorites from './hooks/useFavorites';
import './App.css';

const App = () => {
  const { weatherData, loading, error, searchedCity, fetchWeather } = useWeather();
  const { forecastData, loading: forecastLoading, fetchForecast } = useForecast();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const handleSearch = (city: string) => {
    fetchWeather(city);
  };

  const handleRetry = () => {
    if (searchedCity) {
      fetchWeather(searchedCity);
    }
  };

  const handleToggleFavorite = (city: string) => {
    toggleFavorite(city);
  };

  const handleFavoriteClick = (city: string) => {
    fetchWeather(city);
  };

  // Automatically fetch forecast when weather data is loaded
  useEffect(() => {
    if (weatherData) {
      fetchForecast(weatherData.name);
    }
  }, [weatherData]);

  return (
    <div className="app">
      <Header />
      
      <main className="main-container">
        <div className="content-wrapper">
          <div className="main-content">
            <SearchBar onSearch={handleSearch} />
            
            {loading && <Loading />}
            
            {!loading && error && (
              <ErrorMessage message={error} onRetry={searchedCity ? handleRetry : undefined} />
            )}
            
            {!loading && !error && (
              <>
                <WeatherCard 
                  weather={weatherData} 
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={weatherData ? isFavorite(weatherData.name) : false}
                />
                <Forecast forecast={forecastData} loading={forecastLoading} />
              </>
            )}
          </div>
          
          <div className="sidebar">
            <FavoriteCities 
              favorites={favorites}
              onCityClick={handleFavoriteClick}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
