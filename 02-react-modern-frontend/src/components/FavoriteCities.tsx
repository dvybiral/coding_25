import './FavoriteCities.css';

const FavoriteCities = () => {
  return (
    <aside className="favorite-cities">
      <h3 className="favorite-title">Favorite Cities</h3>
      <div className="favorite-empty">
        <p className="favorite-empty-text">No favorites yet</p>
        <p className="favorite-empty-hint">Search for cities and add them to favorites</p>
      </div>
    </aside>
  );
};

export default FavoriteCities;

