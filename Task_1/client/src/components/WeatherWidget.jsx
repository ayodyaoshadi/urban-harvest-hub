import { useState, useEffect } from 'react';
import { 
  fetchWeather, 
  getWeatherDescription, 
  getWeatherIcon, 
  getWeatherWithLocation,
  mockExternalAPIs 
} from '../services/api';

const WeatherWidget = ({ showDetails = false, autoRefresh = true }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useMock, setUseMock] = useState(false);
  const [locationName, setLocationName] = useState('');

  const loadWeather = async (useMockApi = false) => {
    setLoading(true);
    setError(null);

    try {
      let weatherData;
      
      if (useMockApi) {
        // Use mock data for demo/fallback
        weatherData = mockExternalAPIs.getMockWeather();
        weatherData.description = getWeatherDescription(weatherData.weatherCode);
        setLocationName('Demo Location');
      } else {
        // Try to get real weather data
        weatherData = await getWeatherWithLocation();
        weatherData.description = getWeatherDescription(weatherData.weatherCode);
        setLocationName(weatherData.location);
      }

      setWeather(weatherData);
    } catch (err) {
      console.error('Weather loading error:', err);
      setError(err.message);
      
      // Fallback to mock data
      if (!useMockApi) {
        setTimeout(() => {
          setUseMock(true);
          loadWeather(true);
        }, 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather(useMock);

    // Auto-refresh every 5 minutes
    let refreshInterval;
    if (autoRefresh) {
      refreshInterval = setInterval(() => {
        loadWeather(useMock);
      }, 5 * 60 * 1000); // 5 minutes
    }

    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [useMock, autoRefresh]);

  const refreshWeather = () => {
    loadWeather(useMock);
  };

  const toggleDataSource = () => {
    setUseMock(!useMock);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error && !weather) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">
          <div className="text-4xl mb-3">🌡️</div>
          <h3 className="text-lg font-bold mb-2">Weather Unavailable</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => loadWeather(true)}
            className="bg-eco-green text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
          >
            Use Demo Data
          </button>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-lg p-6 border border-blue-100">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <span className="mr-2">🌤️</span> 
            Local Weather
            {useMock && (
              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                Demo Data
              </span>
            )}
          </h3>
          <p className="text-sm text-gray-600">{locationName}</p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={refreshWeather}
            className="text-gray-500 hover:text-eco-green p-1"
            aria-label="Refresh weather"
            title="Refresh weather data"
          >
            🔄
          </button>
          <button
            onClick={toggleDataSource}
            className="text-gray-500 hover:text-eco-green p-1"
            aria-label="Toggle data source"
            title="Toggle between real and demo data"
          >
            {useMock ? '📡' : '🎮'}
          </button>
        </div>
      </div>

      {/* Current Weather */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <span className="text-5xl mr-4">
            {getWeatherIcon(weather.weatherCode)}
          </span>
          <div>
            <div className="text-3xl font-bold text-gray-800">
              {Math.round(weather.temperature)}°C
            </div>
            <div className="text-gray-600">{weather.description}</div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-500">Wind</div>
          <div className="font-medium">{Math.round(weather.windSpeed)} km/h</div>
        </div>
      </div>

      {/* Additional Details */}
      {showDetails && weather.daily && (
        <div className="border-t border-blue-100 pt-4 mt-4">
          <h4 className="font-medium text-gray-700 mb-3">5-Day Forecast</h4>
          <div className="grid grid-cols-5 gap-2">
            {weather.daily.time.slice(0, 5).map((date, index) => (
              <div key={date} className="text-center">
                <div className="text-xs text-gray-500">
                  {new Date(date).toLocaleDateString('en-GB', { weekday: 'short' })}
                </div>
                <div className="text-xl my-1">
                  {getWeatherIcon(weather.daily.weathercode[index])}
                </div>
                <div className="text-sm font-medium">
                  {Math.round(weather.daily.temperature_2m_max[index])}°
                </div>
                <div className="text-xs text-gray-500">
                  {Math.round(weather.daily.temperature_2m_min[index])}°
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hourly Forecast (simplified) */}
      {showDetails && weather.hourly && (
        <div className="border-t border-blue-100 pt-4 mt-4">
          <h4 className="font-medium text-gray-700 mb-3">Today's Forecast</h4>
          <div className="flex overflow-x-auto space-x-4 pb-2">
            {weather.hourly.time.slice(0, 8).map((time, index) => (
              <div key={time} className="flex-shrink-0 text-center">
                <div className="text-xs text-gray-500">
                  {new Date(time).toLocaleTimeString('en-GB', { 
                    hour: '2-digit',
                    hour12: false 
                  })}
                </div>
                <div className="text-lg my-1">
                  {getWeatherIcon(weather.hourly.weathercode[index])}
                </div>
                <div className="text-sm font-medium">
                  {Math.round(weather.hourly.temperature_2m[index])}°
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weather Impact Note */}
      <div className="border-t border-blue-100 pt-4 mt-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Eco-Tip:</span> {weather.temperature < 15 
            ? 'Consider indoor gardening activities today.' 
            : 'Perfect weather for outdoor workshops and planting!'}
        </p>
      </div>

      {/* Last Updated */}
      <div className="text-xs text-gray-400 mt-4 text-center">
        Last updated: {new Date(weather.time).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </div>
    </div>
  );
};

export default WeatherWidget;