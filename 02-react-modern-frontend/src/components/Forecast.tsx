import { DailyForecast } from '../hooks/useForecast';
import './Forecast.css';

interface ForecastProps {
  forecast: DailyForecast[] | null;
  loading: boolean;
}

const Forecast = ({ forecast, loading }: ForecastProps) => {
  if (loading) {
    return (
      <div className="forecast-container">
        <h3 className="forecast-title">5-Day Forecast</h3>
        <div className="forecast-loading">
          <div className="forecast-skeleton">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="forecast-card-skeleton"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!forecast || forecast.length === 0) {
    return null;
  }

  return (
    <div className="forecast-container">
      <h3 className="forecast-title">5-Day Forecast</h3>
      <div className="forecast-grid">
        {forecast.map((day) => (
          <div key={day.date} className="forecast-card">
            <div className="forecast-day">{day.dayName}</div>
            <img
              src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
              alt={day.condition}
              className="forecast-icon"
            />
            <div className="forecast-condition">{day.condition}</div>
            <div className="forecast-temps">
              <span className="forecast-temp-max">{day.tempMax}°</span>
              <span className="forecast-temp-divider">/</span>
              <span className="forecast-temp-min">{day.tempMin}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;

