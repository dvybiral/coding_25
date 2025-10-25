import './FavoriteCities.css';

interface FavoriteCitiesProps {
  favorites: string[];
  onCityClick: (city: string) => void;
}

const FavoriteCities = ({ favorites, onCityClick }: FavoriteCitiesProps) => {
  const handleCityClick = (city: string) => {
    onCityClick(city);
  };

  return (
    <aside className="favorite-cities">
      <h3 className="favorite-title">Favorite Cities</h3>
      
      {favorites.length === 0 ? (
        <div className="favorite-empty">
          <p className="favorite-empty-text">No favorites yet</p>
          <p className="favorite-empty-hint">Search for cities and add them to favorites</p>
        </div>
      ) : (
        <ul className="favorite-list">
          {favorites.map((city) => (
            <li key={city} className="favorite-item" onClick={() => handleCityClick(city)}>
              <span className="favorite-city-name">{city}</span>
              <span className="favorite-arrow">→</span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};

export default FavoriteCities;

