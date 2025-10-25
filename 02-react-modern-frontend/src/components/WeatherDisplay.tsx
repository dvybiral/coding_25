import './WeatherDisplay.css';

const WeatherDisplay = () => {
  return (
    <div className="weather-display">
      <div className="weather-placeholder">
        <div className="weather-icon">☀️</div>
        <h2 className="weather-title">Search for a city</h2>
        <p className="weather-subtitle">Enter a city name to see current weather conditions</p>
      </div>
    </div>
  );
};

export default WeatherDisplay;

