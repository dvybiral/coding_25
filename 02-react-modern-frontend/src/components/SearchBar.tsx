import { useState } from 'react';
import { Search } from 'lucide-react';
import './SearchBar.css';

interface SearchBarProps {
  onSearch: (city: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
      setSearchTerm('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <Search className="search-icon" aria-hidden="true" size={20} strokeWidth={2} />
          <input
            type="text"
            value={searchTerm}
            onChange={handleChange}
            placeholder="Search for a city..."
            className="search-input"
            aria-label="Search for a city"
          />
        </div>
        <button type="submit" className="search-button" disabled={!searchTerm.trim()}>
          <Search className="button-icon" size={20} strokeWidth={2} />
          <span className="button-text">Search</span>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;

