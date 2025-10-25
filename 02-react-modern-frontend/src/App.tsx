import Header from './components/Header';
import SearchBar from './components/SearchBar';
import WeatherDisplay from './components/WeatherDisplay';
import FavoriteCities from './components/FavoriteCities';
import './App.css';

const App = () => {
  const handleSearch = (city: string) => {
    console.log('Searching for:', city);
    // Weather API integration will go here
  };

  return (
    <div className="app">
      <Header />
      
      <main className="main-container">
        <div className="content-wrapper">
          <div className="main-content">
            <SearchBar onSearch={handleSearch} />
            <WeatherDisplay />
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
