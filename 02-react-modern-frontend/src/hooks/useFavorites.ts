import useLocalStorage from './useLocalStorage';

interface UseFavoritesReturn {
  favorites: string[];
  addFavorite: (city: string) => void;
  removeFavorite: (city: string) => void;
  toggleFavorite: (city: string) => void;
  isFavorite: (city: string) => boolean;
}

const useFavorites = (): UseFavoritesReturn => {
  const [favorites, setFavorites] = useLocalStorage<string[]>('favoriteCities', []);

  const addFavorite = (city: string) => {
    if (!favorites.includes(city)) {
      setFavorites([...favorites, city]);
    }
  };

  const removeFavorite = (city: string) => {
    setFavorites(favorites.filter(fav => fav !== city));
  };

  const toggleFavorite = (city: string) => {
    if (favorites.includes(city)) {
      removeFavorite(city);
    } else {
      addFavorite(city);
    }
  };

  const isFavorite = (city: string) => {
    return favorites.includes(city);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };
};

export default useFavorites;

