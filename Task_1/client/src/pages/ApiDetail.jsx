import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { backendServices, checkApiHealth } from '../services/api';
import { formatPriceLKR } from '../utils/currency';
import Reviews from '../components/Reviews';
import SubscribeBox from '../components/SubscribeBox';
import LocationMap from '../components/LocationMap';

const CATEGORY_BY_TYPE = { workshop: 'Workshop', event: 'Event', product: 'Product' };

/** Map item from items.json to the shape ApiDetail expects (title/name, image_url, etc.). */
function mapJsonToDetailItem(jsonItem) {
  return {
    ...jsonItem,
    title: jsonItem.title,
    name: jsonItem.title,
    image_url: jsonItem.image,
    image: jsonItem.image,
    sustainability_rating: jsonItem.rating,
    time: jsonItem.time || '',
  };
}

function ApiDetail() {
  const { id } = useParams();
  const location = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Route is /workshop/:id, /event/:id, or /product/:id – so type is not in params, derive from pathname
  const type = location.pathname.startsWith('/workshop') ? 'workshop' : location.pathname.startsWith('/event') ? 'event' : location.pathname.startsWith('/product') ? 'product' : null;

  useEffect(() => {
    if (!type || !id) return;
    const numId = parseInt(id, 10);
    if (Number.isNaN(numId)) {
      setItem(null);
      setLoading(false);
      return;
    }

    const categoryMatch = CATEGORY_BY_TYPE[type];

    checkApiHealth().then((apiOk) => {
      if (!apiOk) {
        // API down – load from internal items.json and find by type + id
        import('../data/items.json')
          .then((m) => {
            const list = m.default ?? [];
            const found = list.find((x) => Number(x.id) === numId && x.category === categoryMatch);
            return found ? mapJsonToDetailItem(found) : null;
          })
          .then(setItem)
          .catch(() => setItem(null))
          .finally(() => setLoading(false));
        return;
      }

      let promise;
      if (type === 'workshop') promise = backendServices.getWorkshops().then((r) => (r?.data ?? []).find((x) => Number(x.id) === numId));
      else if (type === 'event') promise = backendServices.getEvents().then((r) => (r?.data ?? []).find((x) => Number(x.id) === numId));
      else if (type === 'product') promise = backendServices.getProducts().then((r) => (r?.data ?? []).find((x) => Number(x.id) === numId));
      else { setLoading(false); return; }
      promise.then((data) => setItem(data || null)).catch(() => setItem(null)).finally(() => setLoading(false));
    });
  }, [type, id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-4" />
          <div className="h-64 bg-gray-300 rounded mb-4" />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">{t('apiDetail.notFound')}</h1>
        <button type="button" onClick={() => navigate(-1)} className="text-eco-green underline">
          {t('apiDetail.goBack')}
        </button>
      </div>
    );
  }

  const title = item.title || item.name;
  const description = item.description;
  const price = item.price ?? 0;
  const image = item.image_url || item.image || '';
  const itemLocation = item.location;
  const date = item.date;
  const time = item.time;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-72 object-cover rounded-xl shadow-lg"
          />
        ) : (
          <div className="w-full h-72 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400">
            No image
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-2xl font-bold text-eco-green">
              {formatPriceLKR(price)}
            </span>
            {item.sustainability_rating != null && (
              <span className="flex items-center gap-1" aria-label={`Sustainability ${item.sustainability_rating} stars`}>
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('apiDetail.sustainability')}:</span>
                <span className="text-yellow-500">
                  {'★'.repeat(item.sustainability_rating)}{'☆'.repeat(5 - item.sustainability_rating)}
                </span>
              </span>
            )}
          </div>
          <p className="text-gray-600 mb-6">{description}</p>
          {(date || time || itemLocation) && (
            <div className="space-y-2 mb-6">
              {date && (
                <p><strong>Date:</strong> {new Date(date).toLocaleDateString()} {time && new Date(`1970-01-01T${time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              )}
              {itemLocation && (
                <>
                  <p><strong>Location:</strong> {itemLocation}</p>
                  <LocationMap address={itemLocation} title="Map" className="mt-2" />
                </>
              )}
            </div>
          )}
          <div className="flex gap-4">
            {type === 'product' ? (
              <Link
                to="/order-product"
                state={{
                  product: {
                    id: item.id,
                    title: title,
                    name: title,
                    description,
                    price,
                    image: item.image_url || item.image,
                    image_url: item.image_url || item.image,
                  },
                }}
                className="bg-eco-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90"
              >
                {t('apiDetail.buyNow')}
              </Link>
            ) : (
              <Link
                to="/booking"
                state={{
                  workshop: {
                    id: item.id,
                    title: title,
                    description,
                    price,
                    date: item.date,
                    location: item.location || item.itemLocation,
                    image: item.image_url || item.image,
                    availableSpots: (item.max_participants ?? 20) - (item.current_participants ?? 0),
                  },
                  bookingType: type,
                }}
                className="bg-eco-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90"
              >
                {t('apiDetail.bookNow')}
              </Link>
            )}
          </div>
          {type === 'product' && <SubscribeBox productId={item.id} />}
        </div>
      </div>
      <Reviews
        workshopId={type === 'workshop' ? item.id : undefined}
        eventId={type === 'event' ? item.id : undefined}
        productId={type === 'product' ? item.id : undefined}
      />
    </div>
  );
}

export default ApiDetail;
