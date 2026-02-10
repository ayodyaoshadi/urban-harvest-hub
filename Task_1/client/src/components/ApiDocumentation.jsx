const ApiDocumentation = () => {
    const apis = [
      {
        name: 'Open-Meteo Weather API',
        description: 'Provides real-time weather data without API key',
        endpoint: 'https://api.open-meteo.com/v1/forecast',
        method: 'GET',
        usage: 'Current weather, hourly & daily forecasts',
        free: true,
      },
      {
        name: 'OpenStreetMap Nominatim',
        description: 'Reverse geocoding to get location names from coordinates',
        endpoint: 'https://nominatim.openstreetmap.org/reverse',
        method: 'GET',
        usage: 'Get city/town names from latitude/longitude',
        free: true,
      },
      {
        name: 'Browser Geolocation API',
        description: 'Native browser API for getting user location',
        endpoint: 'navigator.geolocation.getCurrentPosition()',
        method: 'Browser API',
        usage: 'Get precise user coordinates with permission',
        free: true,
      },
    ];
  
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
          API Integration Documentation
        </h3>
        
        <div className="space-y-6">
          {apis.map((api, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-lg text-gray-800">{api.name}</h4>
                  <p className="text-gray-600 text-sm">{api.description}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  api.free ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {api.free ? 'FREE' : 'PAID'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-500">Endpoint</p>
                  <p className="font-mono text-sm bg-gray-50 p-2 rounded">{api.endpoint}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Method</p>
                  <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {api.method}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Usage</p>
                  <p className="text-sm">{api.usage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
  
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-bold mb-2">Implementation Notes:</h4>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>All APIs are CORS-enabled and work in browsers</li>
            <li>Error handling includes fallback to mock data</li>
            <li>User location is requested with permission</li>
            <li>Weather data auto-refreshes every 5 minutes</li>
            <li>Data is cached locally for offline use</li>
          </ul>
        </div>
      </div>
    );
  };
  
  export default ApiDocumentation;