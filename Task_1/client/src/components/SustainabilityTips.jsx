import { useState, useEffect } from 'react';
import { mockExternalAPIs } from '../services/api';

const SustainabilityTips = () => {
  const [currentTip, setCurrentTip] = useState('');
  const [loading, setLoading] = useState(true);
  const [tipHistory, setTipHistory] = useState([]);

  const loadTip = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newTip = mockExternalAPIs.getSustainabilityTips();
      setCurrentTip(newTip);
      
      // Add to history (keep last 3)
      setTipHistory(prev => [newTip, ...prev.slice(0, 2)]);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    loadTip();
    
    // Refresh tip every 30 seconds
    const interval = setInterval(loadTip, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-6 border border-green-100">
      <div className="flex items-center mb-4">
        <div className="text-2xl mr-3">🌱</div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Sustainability Tip</h3>
          <p className="text-sm text-gray-600">Updated every 30 seconds</p>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse">
          <div className="h-4 bg-green-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-green-200 rounded w-5/6"></div>
        </div>
      ) : (
        <>
          <p className="text-gray-700 mb-6 text-lg italic">"{currentTip}"</p>
          
          <div className="flex justify-between items-center">
            <button
              onClick={loadTip}
              className="text-eco-green hover:text-earth-brown font-medium flex items-center"
            >
              <span className="mr-2">🔄</span>
              New Tip
            </button>
            
            <span className="text-xs text-gray-500">
              Tip #{tipHistory.length + 1}
            </span>
          </div>

          {/* Tip History */}
          {tipHistory.length > 0 && (
            <div className="mt-6 pt-4 border-t border-green-100">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Tips</h4>
              <ul className="space-y-2">
                {tipHistory.slice(1).map((tip, index) => (
                  <li 
                    key={index} 
                    className="text-sm text-gray-600 line-clamp-2 opacity-70"
                  >
                    "{tip}"
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SustainabilityTips;