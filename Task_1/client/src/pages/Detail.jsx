import { useParams, useLocation, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import EcoCard from '../components/EcoCard';
import LocationMap from '../components/LocationMap';
import { backendServices } from '../services/api';
import { formatPriceLKR } from '../utils/currency';

function mapWorkshop(w) {
  return {
    id: w.id,
    title: w.title,
    description: w.description,
    price: parseFloat(w.price) ?? 0,
    category: 'Workshop',
    type: 'workshop',
    date: w.date,
    location: w.location,
    image: w.image_url || '',
    availableSpots: (w.max_participants ?? 20) - (w.current_participants ?? 0),
    detailPath: '/workshop',
  };
}

function mapEvent(e) {
  return {
    id: e.id,
    title: e.title,
    description: e.description,
    price: parseFloat(e.price) ?? 0,
    category: 'Event',
    type: 'event',
    date: e.date,
    location: e.location,
    image: e.image_url || '',
    detailPath: '/event',
  };
}

function mapProduct(p) {
  return {
    id: p.id,
    title: p.name,
    description: p.description,
    price: parseFloat(p.price) ?? 0,
    category: 'Product',
    type: 'product',
    image: p.image_url || '',
    rating: p.sustainability_rating,
    stock: p.stock_quantity ?? 0,
    detailPath: '/product',
  };
}

const Detail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const location = useLocation();
  const isProductRoute = location.pathname.startsWith('/products/');
  const [item, setItem] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    const numId = parseInt(id, 10);
    if (Number.isNaN(numId)) {
      setItem(null);
      setLoading(false);
      return;
    }

    if (isProductRoute) {
      backendServices
        .getProducts()
        .then((r) => {
          const list = (r?.data ?? []).map(mapProduct);
          const found = list.find((i) => i.id === numId);
          setItem(found ?? null);
          setRelatedItems(
            found ? list.filter((i) => i.id !== numId && (i.category === found.category || i.type === found.type)).slice(0, 3) : []
          );
        })
        .catch((err) => {
          console.error('Failed to load product:', err);
          setError('Unable to load this item. Please try again.');
          setItem(null);
          setRelatedItems([]);
        })
        .finally(() => setLoading(false));
      return;
    }

    Promise.all([
      backendServices.getWorkshops().then((r) => (r?.data ?? []).map(mapWorkshop)),
      backendServices.getEvents().then((r) => (r?.data ?? []).map(mapEvent)),
      backendServices.getProducts().then((r) => (r?.data ?? []).map(mapProduct)),
    ])
      .then(([workshops, events, products]) => {
        const all = [...workshops, ...events, ...products];
        const found = all.find((i) => i.id === numId);
        setItem(found ?? null);
        const related = found
          ? all.filter((i) => i.id !== numId && i.type === found.type).slice(0, 3)
          : [];
        setRelatedItems(related);
      })
      .catch((err) => {
        console.error('Failed to load item:', err);
        setError('Unable to load this item. Please try again.');
        setItem(null);
        setRelatedItems([]);
      })
      .finally(() => setLoading(false));
  }, [id, isProductRoute]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8" role="status" aria-live="polite" aria-label="Loading">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-4" />
          <div className="h-64 bg-gray-300 rounded mb-4" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center" role="alert">
        <h1 className="text-2xl font-bold mb-4">{t('detail.somethingWentWrong')}</h1>
        <p className="text-gray-600 mb-4">{error}</p>
        <Link to="/" className="text-eco-green font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-eco-green focus-visible:ring-offset-2 rounded inline-block">
          {t('detail.backToHome')}
        </Link>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">{t('detail.itemNotFound')}</h1>
        <p className="text-gray-600">{t('detail.itemNotFoundDesc')}</p>
        <Link to="/" className="text-eco-green font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-eco-green focus-visible:ring-offset-2 rounded mt-4 inline-block">
          {t('detail.backToHome')}
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-gray-900 dark:text-gray-100">
      <article
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        aria-labelledby="detail-title"
      >
        <section aria-label="Item image">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-96 object-cover rounded-2xl shadow-lg"
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl flex items-center justify-center text-gray-500 dark:text-gray-400">
              No image
            </div>
          )}
        </section>

        <section aria-label="Item details">
          <div className="mb-4">
            <span className="bg-eco-green text-white px-3 py-1 rounded-full text-sm font-semibold">
              {item.category}
            </span>
          </div>

          <h1 id="detail-title" className="text-3xl font-bold mb-4">{item.title}</h1>

          <div className="flex items-center gap-4 mb-6" aria-label="Pricing and rating">
            <span className="text-3xl font-bold text-eco-green">
              {formatPriceLKR(item.price)}
            </span>
            {item.rating != null && (
              <span className="text-yellow-500" aria-label={`Rating ${item.rating} out of 5`}>
                ★ {item.rating}/5.0
              </span>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">{item.description}</p>

          <dl className="space-y-4 mb-8">
            {item.date && (
              <div className="flex items-start gap-3">
                <span className="text-xl" aria-hidden="true">📅</span>
                <div>
                  <dt className="font-semibold">{t('detail.date')}</dt>
                  <dd className="text-gray-600">
                    {new Date(item.date).toLocaleDateString('en-GB', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </dd>
                </div>
              </div>
            )}
            {item.location && (
              <div className="flex items-start gap-3">
                <span className="text-xl" aria-hidden="true">📍</span>
                <div className="flex-1">
                  <dt className="font-semibold">{t('detail.location')}</dt>
                  <dd className="text-gray-600">{item.location}</dd>
                  <LocationMap address={item.location} title="Map" className="mt-2" />
                </div>
              </div>
            )}
            {item.availableSpots !== undefined && (
              <div className="flex items-start gap-3">
                <span className="text-xl" aria-hidden="true">👥</span>
                <div>
                  <dt className="font-semibold">{t('detail.availability')}</dt>
                  <dd className="text-gray-600">
                    {item.availableSpots > 0 ? `${item.availableSpots} ${t('detail.spotsAvailable')}` : t('detail.fullyBooked')}
                  </dd>
                </div>
              </div>
            )}
            {item.stock != null && (
              <div className="flex items-start gap-3">
                <span className="text-xl" aria-hidden="true">📦</span>
                <div>
                  <dt className="font-semibold">{t('detail.stock')}</dt>
                  <dd className="text-gray-600">{item.stock > 0 ? `${item.stock} ${t('detail.inStock')}` : t('detail.outOfStock')}</dd>
                </div>
              </div>
            )}
          </dl>

          <div className="space-y-4">
            {(item.type === 'workshop' || item.type === 'event') && (
              <Link
                to="/booking"
                state={{ workshop: item, bookingType: item.type }}
                className="block w-full bg-eco-green text-white py-3 rounded-lg font-bold text-center hover:bg-opacity-90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-eco-green focus-visible:ring-offset-2"
                aria-label="Book or register for this item"
              >
                {t('detail.bookNow')}
              </Link>
            )}
            {item.type === 'product' && (
              <Link
                to="/booking"
                state={{ workshop: null }}
                className="block w-full bg-eco-green text-white py-3 rounded-lg font-bold text-center hover:bg-opacity-90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-eco-green focus-visible:ring-offset-2"
                aria-label={t('detail.addToCart')}
              >
                {t('detail.addToCart')}
              </Link>
            )}
            <button
              type="button"
              className="w-full border border-eco-green text-eco-green py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-eco-green focus-visible:ring-offset-2"
              aria-label={t('detail.addToWishlist')}
            >
              {t('detail.addToWishlist')}
            </button>
          </div>
        </section>
      </article>

      {relatedItems.length > 0 && (
        <section aria-labelledby="related-heading" className="mb-12">
          <h2 id="related-heading" className="text-2xl font-bold mb-6">
            {t('detail.related')} {item.category}s
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 list-none p-0 m-0">
            {relatedItems.map((relatedItem) => (
              <li key={`${relatedItem.type}-${relatedItem.id}`}>
                <EcoCard item={relatedItem} compact showButton />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8 bg-blue-50 dark:bg-gray-800 rounded-xl p-6" aria-labelledby="weather-heading">
        <h2 id="weather-heading" className="text-lg font-bold mb-4 flex items-center">
          <span className="mr-2" aria-hidden="true">🌦️</span> {t('detail.weatherImpact')}
        </h2>
        <p className="text-gray-600 mb-4">
          {t('detail.weatherImpactDesc')}
        </p>
        <button
          type="button"
          onClick={() => window.scrollTo(0, 0)}
          className="text-eco-green hover:text-earth-brown font-medium flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-eco-green focus-visible:ring-offset-2 rounded"
          aria-label={t('detail.viewWeather')}
        >
          <span className="mr-2" aria-hidden="true">⬆️</span>
          {t('detail.viewWeather')}
        </button>
      </section>
    </div>
  );
};

export default Detail;
