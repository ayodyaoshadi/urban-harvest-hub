import WeatherWidget from '../components/WeatherWidget';
import SustainabilityTips from '../components/SustainabilityTips';
import NearbyEvents from '../components/NearbyEvents';
import ApiDocumentation from '../components/ApiDocumentation';

const ApiDemo = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">External API Integration Demo</h1>
      <p className="text-gray-600 mb-8">
        This demonstrates integration with multiple external APIs as required for Task 1.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <WeatherWidget showDetails={true} />
          <SustainabilityTips />
          <NearbyEvents />
        </div>
        
        <div>
          <ApiDocumentation />
          
          <div className="mt-8 bg-green-50 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">API Integration Features</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Real-time weather data from Open-Meteo</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>User location detection with browser geolocation</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Reverse geocoding with OpenStreetMap</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Graceful fallback to mock data when APIs fail</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Automatic data refresh and caching</span>
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Comprehensive error handling</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDemo;