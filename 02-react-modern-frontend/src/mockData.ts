// Mock weather data for testing the UI

export const mockWeatherData = {
  london: {
    name: 'London',
    sys: {
      country: 'GB',
    },
    main: {
      temp: 15,
      feels_like: 13,
      humidity: 72,
    },
    weather: [
      {
        main: 'Clouds',
        description: 'overcast clouds',
        icon: '04d',
      },
    ],
    wind: {
      speed: 5.2,
    },
  },
  
  tokyo: {
    name: 'Tokyo',
    sys: {
      country: 'JP',
    },
    main: {
      temp: 22,
      feels_like: 21,
      humidity: 65,
    },
    weather: [
      {
        main: 'Clear',
        description: 'clear sky',
        icon: '01d',
      },
    ],
    wind: {
      speed: 3.5,
    },
  },
  
  newYork: {
    name: 'New York',
    sys: {
      country: 'US',
    },
    main: {
      temp: 18,
      feels_like: 17,
      humidity: 58,
    },
    weather: [
      {
        main: 'Rain',
        description: 'light rain',
        icon: '10d',
      },
    ],
    wind: {
      speed: 6.8,
    },
  },
  
  paris: {
    name: 'Paris',
    sys: {
      country: 'FR',
    },
    main: {
      temp: 16,
      feels_like: 15,
      humidity: 70,
    },
    weather: [
      {
        main: 'Clouds',
        description: 'few clouds',
        icon: '02d',
      },
    ],
    wind: {
      speed: 4.1,
    },
  },
  
  sydney: {
    name: 'Sydney',
    sys: {
      country: 'AU',
    },
    main: {
      temp: 25,
      feels_like: 26,
      humidity: 55,
    },
    weather: [
      {
        main: 'Clear',
        description: 'clear sky',
        icon: '01d',
      },
    ],
    wind: {
      speed: 7.2,
    },
  },
  
  dubai: {
    name: 'Dubai',
    sys: {
      country: 'AE',
    },
    main: {
      temp: 35,
      feels_like: 38,
      humidity: 45,
    },
    weather: [
      {
        main: 'Clear',
        description: 'sunny',
        icon: '01d',
      },
    ],
    wind: {
      speed: 4.5,
    },
  },
  
  moscow: {
    name: 'Moscow',
    sys: {
      country: 'RU',
    },
    main: {
      temp: 8,
      feels_like: 5,
      humidity: 80,
    },
    weather: [
      {
        main: 'Snow',
        description: 'light snow',
        icon: '13d',
      },
    ],
    wind: {
      speed: 8.5,
    },
  },
  
  singapore: {
    name: 'Singapore',
    sys: {
      country: 'SG',
    },
    main: {
      temp: 30,
      feels_like: 35,
      humidity: 85,
    },
    weather: [
      {
        main: 'Thunderstorm',
        description: 'thunderstorm with rain',
        icon: '11d',
      },
    ],
    wind: {
      speed: 5.8,
    },
  },
  
  reykjavik: {
    name: 'Reykjavik',
    sys: {
      country: 'IS',
    },
    main: {
      temp: 5,
      feels_like: 2,
      humidity: 75,
    },
    weather: [
      {
        main: 'Mist',
        description: 'mist',
        icon: '50d',
      },
    ],
    wind: {
      speed: 9.2,
    },
  },
  
  mumbai: {
    name: 'Mumbai',
    sys: {
      country: 'IN',
    },
    main: {
      temp: 32,
      feels_like: 36,
      humidity: 78,
    },
    weather: [
      {
        main: 'Rain',
        description: 'moderate rain',
        icon: '10d',
      },
    ],
    wind: {
      speed: 6.5,
    },
  },
};

// Helper function to get random city data
export const getRandomCityWeather = () => {
  const cities = Object.values(mockWeatherData);
  return cities[Math.floor(Math.random() * cities.length)];
};

// Helper function to get weather by city name (case insensitive)
export const getMockWeatherByCity = (cityName: string) => {
  const normalizedSearch = cityName.toLowerCase().trim();
  
  const cityMap: { [key: string]: keyof typeof mockWeatherData } = {
    london: 'london',
    tokyo: 'tokyo',
    'new york': 'newYork',
    newyork: 'newYork',
    paris: 'paris',
    sydney: 'sydney',
    dubai: 'dubai',
    moscow: 'moscow',
    singapore: 'singapore',
    reykjavik: 'reykjavik',
    mumbai: 'mumbai',
  };
  
  const cityKey = cityMap[normalizedSearch];
  
  if (cityKey) {
    return mockWeatherData[cityKey];
  }
  
  return null;
};

// Favorite cities mock data
export const mockFavoriteCities = [
  'London',
  'Tokyo',
  'Paris',
  'Sydney',
];

// Recent searches mock data
export const mockRecentSearches = [
  'New York',
  'Dubai',
  'London',
  'Singapore',
  'Moscow',
];

