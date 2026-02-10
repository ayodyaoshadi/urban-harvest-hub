import axios from 'axios';

// Open-Meteo API (no API key required)
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

// Backend API base URL (we'll create this later)
const BACKEND_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AUTH_TOKEN_KEY = 'auth_token';

export function getToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
  else localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

// Create axios instances
export const weatherApi = axios.create({
  baseURL: WEATHER_API_URL,
  timeout: 5000,
});

export const backendApi = axios.create({
  baseURL: BACKEND_API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

backendApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

backendApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) clearToken();
    return Promise.reject(err);
  }
);

/** Shared health-check promise so multiple callers (Home, Navbar, AuthContext) trigger only one request. */
let healthPromise = null;

/** Check if the backend API is running (e.g. GET /health). Returns true if reachable. */
export const checkApiHealth = async () => {
  if (healthPromise !== null) return healthPromise;
  healthPromise = (async () => {
    try {
      const res = await backendApi.get('/health');
      return res?.data?.status === 'online' || res?.status === 200;
    } catch {
      return false;
    }
  })();
  return healthPromise;
};

// Weather API functions
export const fetchWeather = async (latitude = 52.52, longitude = 13.41) => {
  try {
    const response = await weatherApi.get('', {
      params: {
        latitude,
        longitude,
        current_weather: true,
        hourly: 'temperature_2m,weathercode',
        daily: 'weathercode,temperature_2m_max,temperature_2m_min',
        timezone: 'Europe/London',
      },
    });

    return {
      temperature: response.data.current_weather.temperature,
      weatherCode: response.data.current_weather.weathercode,
      windSpeed: response.data.current_weather.windspeed,
      time: response.data.current_weather.time,
      hourly: response.data.hourly,
      daily: response.data.daily,
      location: 'Local Area', // We'll enhance this with geolocation
    };
  } catch (error) {
    console.error('Weather API error:', error);
    throw new Error('Failed to fetch weather data');
  }
};

// Get weather description from weather code
export const getWeatherDescription = (weatherCode) => {
  const weatherMap = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };

  return weatherMap[weatherCode] || 'Unknown';
};

// Get weather icon from weather code
export const getWeatherIcon = (weatherCode) => {
  if (weatherCode === 0 || weatherCode === 1) return '☀️';
  if (weatherCode === 2) return '⛅';
  if (weatherCode === 3) return '☁️';
  if (weatherCode >= 45 && weatherCode <= 48) return '🌫️';
  if (weatherCode >= 51 && weatherCode <= 57) return '🌧️';
  if (weatherCode >= 61 && weatherCode <= 67) return '🌧️';
  if (weatherCode >= 71 && weatherCode <= 77) return '❄️';
  if (weatherCode >= 80 && weatherCode <= 82) return '🌦️';
  if (weatherCode >= 85 && weatherCode <= 86) return '🌨️';
  if (weatherCode >= 95 && weatherCode <= 99) return '⛈️';
  return '🌡️';
};

// Get user's location
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  });
};

// Get city name from coordinates (using Open-Meteo's geocoding)
export const getCityName = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
    );
    return response.data.address.city || 
           response.data.address.town || 
           response.data.address.village || 
           'Local Area';
  } catch (error) {
    console.error('Geocoding error:', error);
    return 'Local Area';
  }
};

// Combined function to get weather with location
export const getWeatherWithLocation = async () => {
  try {
    const location = await getUserLocation();
    const weather = await fetchWeather(location.latitude, location.longitude);
    const cityName = await getCityName(location.latitude, location.longitude);
    
    return {
      ...weather,
      location: cityName,
      coordinates: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
    };
  } catch (error) {
    // Only log when not a user-initiated denial (code 1 = PERMISSION_DENIED)
    if (error?.code !== 1) console.log('Using default location:', error.message);
    // Fallback to default location
    const weather = await fetchWeather();
    return {
      ...weather,
      location: 'Stafford (Default)',
      coordinates: {
        latitude: 52.52,
        longitude: 13.41,
      },
    };
  }
};

// Mock external APIs for development/demo
export const mockExternalAPIs = {
  // Weather API fallback (for when real API fails)
  getMockWeather: () => ({
    temperature: Math.floor(Math.random() * 25) + 10,
    weatherCode: [0, 1, 2, 3, 45, 61, 71, 80, 95][Math.floor(Math.random() * 9)],
    windSpeed: Math.random() * 20 + 5,
    time: new Date().toISOString(),
    location: 'Stafford',
    description: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Snowy'][Math.floor(Math.random() * 5)],
  }),

  // Map/Geolocation mock
  getNearbyEvents: (latitude, longitude, radius = 10) => {
    return [
      {
        id: 1,
        name: 'Community Garden',
        distance: '2.5 km',
        type: 'gardening',
      },
      {
        id: 2,
        name: 'Recycling Center',
        distance: '4.1 km',
        type: 'recycling',
      },
      {
        id: 3,
        name: 'Farmers Market',
        distance: '3.2 km',
        type: 'market',
      },
    ];
  },

  // Sustainability tips API mock
  getSustainabilityTips: () => {
    const tips = [
      'Reduce water usage by taking shorter showers',
      'Use reusable bags when shopping',
      'Turn off lights when leaving a room',
      'Compost food waste to reduce landfill',
      'Use public transport or carpool when possible',
      'Plant native species in your garden',
      'Repair items instead of replacing them',
      'Buy local and seasonal produce',
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  },
};

// Extract list from API response (backend returns { success: true, data: [...] })
function getDataArray(res) {
  if (!res) return [];
  return Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : [];
}

// Backend API functions – all data comes from the API (MySQL database)
export const backendServices = {
  // Workshops
  getWorkshops: async () => {
    const response = await backendApi.get('/workshops');
    const data = getDataArray(response.data);
    return { data };
  },

  createWorkshop: async (workshopData) => {
    const response = await backendApi.post('/workshops', workshopData);
    return response.data;
  },

  updateWorkshop: async (id, workshopData) => {
    const response = await backendApi.put(`/workshops/${id}`, workshopData);
    return response.data;
  },

  deleteWorkshop: async (id) => {
    const response = await backendApi.delete(`/workshops/${id}`);
    return response.data;
  },

  // Bookings
  createBooking: async (bookingData) => {
    const response = await backendApi.post('/bookings', bookingData);
    return response.data;
  },

  getBookings: async () => {
    const response = await backendApi.get('/bookings');
    return response.data;
  },

  // Products
  getProducts: async () => {
    const response = await backendApi.get('/products');
    const data = getDataArray(response.data);
    return { data };
  },

  // Events
  getEvents: async () => {
    const response = await backendApi.get('/events');
    const data = getDataArray(response.data);
    return { data };
  },

  createEvent: async (data) => {
    const response = await backendApi.post('/events', data);
    return response.data;
  },

  updateEvent: async (id, data) => {
    const response = await backendApi.put(`/events/${id}`, data);
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await backendApi.delete(`/events/${id}`);
    return response.data;
  },

  updateWorkshop: async (id, data) => {
    const response = await backendApi.put(`/workshops/${id}`, data);
    return response.data;
  },

  deleteWorkshop: async (id) => {
    const response = await backendApi.delete(`/workshops/${id}`);
    return response.data;
  },

  createProduct: async (data) => {
    const response = await backendApi.post('/products', data);
    return response.data;
  },

  updateProduct: async (id, data) => {
    const response = await backendApi.put(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await backendApi.delete(`/products/${id}`);
    return response.data;
  },

  // Auth
  login: async (username, password) => {
    const response = await backendApi.post('/auth/login', { username, password });
    return response.data;
  },

  register: async (data) => {
    const response = await backendApi.post('/auth/register', data);
    return response.data;
  },

  getMe: async () => {
    try {
      const response = await backendApi.get('/auth/me');
      return response.data;
    } catch (err) {
      // Backend down (ERR_CONNECTION_REFUSED), 404, or other – treat as not logged in
      return { success: false, data: null };
    }
  },

  // Reviews
  getReviews: async (params) => {
    const response = await backendApi.get('/reviews', { params });
    return response.data;
  },

  createReview: async (data) => {
    const response = await backendApi.post('/reviews', data);
    return response.data;
  },

  // Subscriptions
  getSubscriptions: async () => {
    const response = await backendApi.get('/subscriptions');
    return response.data;
  },

  createSubscription: async (data) => {
    const response = await backendApi.post('/subscriptions', data);
    return response.data;
  },

  updateSubscription: async (data) => {
    const response = await backendApi.put('/subscriptions', data);
    return response.data;
  },
};

// Error handling utilities
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    console.error('API Error Response:', {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers,
    });
    
    return {
      message: error.response.data?.message || 'Server error occurred',
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    // Request made but no response
    console.error('API No Response:', error.request);
    return {
      message: 'No response from server. Please check your connection.',
      status: 0,
    };
  } else {
    // Request setup error
    console.error('API Request Error:', error.message);
    return {
      message: error.message || 'Request failed',
      status: 500,
    };
  }
};