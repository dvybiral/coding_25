import './WeatherCard.css';

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

interface WeatherCardProps {
  weather: WeatherData | null;
}

const WeatherCard = ({ weather }: WeatherCardProps) => {
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

  return (
    <div className="weather-card">
      <div className="weather-card-header">
        <h2 className="weather-location">
          {name}, {sys.country}
        </h2>
        <p className="weather-description">{weatherDescription}</p>
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
          <span className="weather-detail-icon">🌡️</span>
          <div className="weather-detail-content">
            <span className="weather-detail-label">Feels like</span>
            <span className="weather-detail-value">{Math.round(main.feels_like)}°</span>
          </div>
        </div>

        <div className="weather-detail-item">
          <span className="weather-detail-icon">💧</span>
          <div className="weather-detail-content">
            <span className="weather-detail-label">Humidity</span>
            <span className="weather-detail-value">{main.humidity}%</span>
          </div>
        </div>

        <div className="weather-detail-item">
          <span className="weather-detail-icon">💨</span>
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

