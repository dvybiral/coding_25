import { WeatherData } from '../hooks/useWeather';
import { Thermometer, Droplet, Wind, Heart } from 'lucide-react';
import './WeatherCard.css';

interface WeatherCardProps {
  weather: WeatherData | null;
  onToggleFavorite?: (city: string) => void;
  isFavorite?: boolean;
}

const WeatherCard = ({ weather, onToggleFavorite, isFavorite = false }: WeatherCardProps) => {
  if (!weather) {
    return (
      <div className="weather-card weather-card-empty">
        <div className="weather-placeholder">
          <div className="weather-icon-placeholder">☀️</div>
          <h2 className="weather-empty-title">Search for a city to see weather!</h2>
          <p className="weather-empty-subtitle">Enter any city name to get started</p>
        </div>
      </div>
    );
  }

  const { name, sys, main, weather: weatherInfo, wind } = weather;
  const weatherIcon = weatherInfo[0]?.icon;
  const weatherDescription = weatherInfo[0]?.description;
  const weatherMain = weatherInfo[0]?.main;

  const handleFavoriteClick = () => {
    if (onToggleFavorite) {
      onToggleFavorite(name);
    }
  };

  return (
    <div className="weather-card">
      <div className="weather-card-header">
        <div className="weather-header-content">
          <h2 className="weather-location">
            {name}, {sys.country}
          </h2>
          <p className="weather-description">{weatherDescription}</p>
        </div>
        {onToggleFavorite && (
          <button
            onClick={handleFavoriteClick}
            className="weather-favorite-button"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart 
              size={24} 
              strokeWidth={2}
              fill={isFavorite ? 'currentColor' : 'none'}
              className={isFavorite ? 'heart-filled' : 'heart-outline'}
            />
          </button>
        )}
      </div>

      <div className="weather-main">
        {weatherIcon && (
          <img
            src={`https://openweathermap.org/img/wn/${weatherIcon}@4x.png`}
            alt={weatherDescription}
            className="weather-icon-large"
          />
        )}
        <div className="weather-temp-container">
          <span className="weather-temp">{Math.round(main.temp)}°</span>
          <span className="weather-main-description">{weatherMain}</span>
        </div>
      </div>

      <div className="weather-details">
        <div className="weather-detail-item">
          <Thermometer className="weather-detail-icon icon-thermometer" size={24} strokeWidth={2} />
          <div className="weather-detail-content">
            <span className="weather-detail-label">Feels like</span>
            <span className="weather-detail-value">{Math.round(main.feels_like)}°</span>
          </div>
        </div>

        <div className="weather-detail-item">
          <Droplet className="weather-detail-icon icon-droplet" size={24} strokeWidth={2} />
          <div className="weather-detail-content">
            <span className="weather-detail-label">Humidity</span>
            <span className="weather-detail-value">{main.humidity}%</span>
          </div>
        </div>

        <div className="weather-detail-item">
          <Wind className="weather-detail-icon icon-wind" size={24} strokeWidth={2} />
          <div className="weather-detail-content">
            <span className="weather-detail-label">Wind Speed</span>
            <span className="weather-detail-value">{wind.speed} m/s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;

