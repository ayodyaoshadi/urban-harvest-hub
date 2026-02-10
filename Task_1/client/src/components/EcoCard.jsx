import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { formatPriceLKR } from '../utils/currency';

const EcoCard = ({ item, showButton = true, compact = false, detailPath }) => {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);
  const pathBase = item.detailPath ?? detailPath;
  const detailTo = pathBase ? `${pathBase}/${item.id}` : null;
  const showImage = item.image && !imageError;

  // Get category color (entity type: Workshop/Event/Product; or DB topic: gardening, cooking, education, energy, water)
  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'workshop':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200';
      case 'product':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
      case 'event':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200';
      case 'gardening':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200';
      case 'cooking':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200';
      case 'education':
        return 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-200';
      case 'energy':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200';
      case 'water':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200';
      case 'food':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200';
      case 'lifestyle':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200';
      case 'environment':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200';
      case 'market':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200';
      case 'cleanup':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-200';
      case 'transport':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200';
      case 'personal-care':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-200';
      case 'accessories':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-200';
      case 'home':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200';
      case 'electronics':
        return 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-200';
      case 'clothing':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200';
      case 'kitchen':
        return 'bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div 
      className={`card-eco rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-gray-100 flex flex-col ${compact ? '' : 'h-full'}`}
      role="article"
      aria-label={`${item.title} - ${item.category}`}
    >
      {/* Card Image */}
      <div className="relative flex-shrink-0">
        {showImage ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-48 object-cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm" aria-hidden="true">
            {t('ecoCard.noImage')}
          </div>
        )}
        
        {/* Category Badge */}
        <span 
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(item.category)}`}
        >
          {item.category}
        </span>

        {/* Price Tag */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="font-bold text-eco-green">
            {formatPriceLKR(item.price)}
          </span>
        </div>
      </div>

      {/* Card Content - flex so button sticks to bottom */}
      <div className="p-4 flex flex-col flex-1 min-h-0">
        <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">
          {item.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {item.description}
        </p>

        {/* Additional Information */}
        <div className="flex flex-wrap gap-2 mb-4">
          {item.date && (
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-1">📅</span>
              {new Date(item.date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short'
              })}
            </div>
          )}
          
          {item.location && (
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-1">📍</span>
              {item.location}
            </div>
          )}
          
          {item.availableSpots !== undefined && (
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-1">👥</span>
              {item.availableSpots} spots left
            </div>
          )}
        </div>

        {showButton && (!compact || detailTo) && (
            <div className="flex justify-between items-center mt-auto">
                {detailTo ? (
                  <Link 
                    to={detailTo}
                    className="w-full bg-eco-green text-white text-center py-3 rounded-lg hover:bg-earth-brown transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-eco-green focus:ring-offset-2"
                    aria-label={`View ${item.title}`}
                  >
                    {t('ecoCard.viewDetails')}
                  </Link>
                ) : (
                  <Link 
                    to="/booking"
                    state={{ workshop: item, bookingType: item.type === 'event' ? 'event' : 'workshop' }}
                    className="w-full bg-eco-green text-white text-center py-3 rounded-lg hover:bg-earth-brown transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-eco-green focus:ring-offset-2"
                    aria-label={`Book ${item.title}`}
                  >
                    {item.category === 'Product' ? 'Buy Now' : 'Book Now'}
                  </Link>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

// PropTypes for better development
EcoCard.propTypes = {
  detailPath: PropTypes.string,
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string,
    date: PropTypes.string,
    location: PropTypes.string,
    availableSpots: PropTypes.number,
    stock: PropTypes.number,
    rating: PropTypes.number,
    participants: PropTypes.number,
  }).isRequired,
  showButton: PropTypes.bool,
  compact: PropTypes.bool,
};

export default EcoCard;