import { useState, useEffect } from 'react';
import { mockExternalAPIs, getUserLocation } from '../services/api';

const NearbyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const loadNearbyEvents = async () => {
    setLoading(true);
    
    try {
      // Try to get user's location
      const userLocation = await getUserLocation();
      setLocation(userLocation);
      
      // Get nearby events based on location
      const nearbyEvents = mockExternalAPIs.getNearbyEvents(
        userLocation.latitude,
        userLocation.longitude
      );
      setEvents(nearbyEvents);
      setError(null);
    } catch (err) {
      // Don't log when user denied/dismissed geolocation (code 1)
      if (err?.code !== 1) console.error('Location error:', err);
      setError('Unable to access your location');
      
      // Use default location as fallback
      const defaultEvents = mockExternalAPIs.getNearbyEvents(52.52, 13.41);
      setEvents(defaultEvents);
      setLocation({ latitude: 52.52, longitude: 13.41 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNearbyEvents();
  }, []);

  const getEventIcon = (type) => {
    switch (type) {
      case 'gardening': return '🌿';
      case 'recycling': return '♻️';
      case 'market': return '🛒';
      default: return '📍';
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'gardening': return 'bg-green-100 text-green-800';
      case 'recycling': return 'bg-blue-100 text-blue-800';
      case 'market': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <span className="mr-2">🗺️</span>
            Nearby Eco-Spots
          </h3>
          <p className="text-sm text-gray-600">
            {location ? 'Based on your location' : 'Loading location...'}
          </p>
        </div>
        
        <button
          onClick={loadNearbyEvents}
          className="text-gray-500 hover:text-eco-green p-2"
          aria-label="Refresh nearby events"
        >
          🔄
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">{error} - showing default locations</p>
        </div>
      )}

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center">
              <div className="h-10 w-10 bg-gray-300 rounded-full mr-3"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {events.map(event => (
            <div 
              key={event.id}
              className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${getEventColor(event.type)}`}>
                {getEventIcon(event.type)}
              </div>
              
              <div className="ml-3 flex-1">
                <h4 className="font-medium text-gray-800">{event.name}</h4>
                <p className="text-sm text-gray-600">{event.distance} away</p>
              </div>
              
              <a
                href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(event.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-eco-green hover:text-earth-brown font-medium text-sm"
              >
                View
              </a>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{error ? 'Using default location' : 'Using location data'}</span>
          {location && !error && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              ±{Math.round(location.accuracy || 100)}m accuracy
            </span>
          )}
        </div>
        
        <button
          onClick={() => window.open('https://www.openstreetmap.org/', '_blank')}
          className="w-full mt-4 text-center text-eco-green hover:text-earth-brown font-medium text-sm"
        >
          View on OpenStreetMap →
        </button>
      </div>
    </div>
  );
};

export default NearbyEvents;