import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EcoCardGrid from '../components/EcoCardGrid';
import WeatherWidget from '../components/WeatherWidget';
import SustainabilityTips from '../components/SustainabilityTips';
import NearbyEvents from '../components/NearbyEvents';
import { backendServices, checkApiHealth } from '../services/api';

// Topic categories match the database (workshops + events category columns)
const TOPIC_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'gardening', label: 'Gardening' },
  { id: 'cooking', label: 'Cooking' },
  { id: 'education', label: 'Education' },
  { id: 'energy', label: 'Energy' },
  { id: 'water', label: 'Water' },
  { id: 'food', label: 'Food' },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'environment', label: 'Environment' },
  { id: 'market', label: 'Market' },
  { id: 'cleanup', label: 'Cleanup' },
  { id: 'transport', label: 'Transport' },
  { id: 'personal-care', label: 'Personal care' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'home', label: 'Home' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'clothing', label: 'Clothing' },
  { id: 'kitchen', label: 'Kitchen' },
];

const SORT_OPTIONS = [
  { id: 'default', label: 'Default' },
  { id: 'price-asc', label: 'Price (low to high)' },
  { id: 'price-desc', label: 'Price (high to low)' },
  { id: 'date-asc', label: 'Date (earliest first)' },
  { id: 'date-desc', label: 'Date (latest first)' },
  { id: 'name', label: 'Name (A–Z)' },
];

const parseDate = (val) => {
  if (val == null || val === '') return null;
  const ts = Date.parse(val);
  return Number.isNaN(ts) ? null : ts;
};

const getPrice = (item) => {
  const p = item?.price;
  if (p == null || p === '') return 0;
  const n = typeof p === 'number' ? p : parseFloat(String(p).replace(/[^\d.-]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

/** Normalise a raw item from internal items.json to the common list shape (for filter/sort/detailPath). */
function mapJsonItem(item) {
  const type = item.category === 'Workshop' ? 'workshop' : item.category === 'Event' ? 'event' : 'product';
  const detailPath = type === 'workshop' ? '/workshop' : type === 'event' ? '/event' : '/product';
    return {
    id: item.id,
    title: item.title,
    description: item.description,
    price: getPrice(item),
    category: item.category,
    topic: (item.topic || item.contentCategory || '').toLowerCase() || null,
    contentCategory: (item.contentCategory || 'lifestyle').toLowerCase(),
    date: item.date ?? null,
    location: item.location ?? null,
    image: item.image || '',
    type,
    detailPath,
    availableSpots: item.availableSpots ?? null,
    stock: item.stock ?? null,
    rating: item.rating ?? null,
  };
}

const Home = () => {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  const filteredByTopic = selectedTopic === 'all'
    ? items
    : items.filter(item => (item.topic || '').toLowerCase() === selectedTopic.toLowerCase());
  const filteredByType = selectedType === 'all'
    ? filteredByTopic
    : filteredByTopic.filter(item => (item.type || '').toLowerCase() === selectedType.toLowerCase());

  const filteredItems = [...filteredByType].sort((a, b) => {
    const locale = i18n.language?.startsWith('si') ? 'si' : 'en';
    if (sortBy === 'price-asc') {
      const diff = getPrice(a) - getPrice(b);
      return diff !== 0 ? diff : (a.id ?? 0) - (b.id ?? 0);
    }
    if (sortBy === 'price-desc') {
      const diff = getPrice(b) - getPrice(a);
      return diff !== 0 ? diff : (a.id ?? 0) - (b.id ?? 0);
    }
    if (sortBy === 'date-asc') {
      const ta = parseDate(a.date);
      const tb = parseDate(b.date);
      if (ta == null && tb == null) return (a.id ?? 0) - (b.id ?? 0);
      if (ta == null) return 1;
      if (tb == null) return -1;
      return ta - tb;
    }
    if (sortBy === 'date-desc') {
      const ta = parseDate(a.date);
      const tb = parseDate(b.date);
      if (ta == null && tb == null) return (b.id ?? 0) - (a.id ?? 0);
      if (ta == null) return 1;
      if (tb == null) return -1;
      return tb - ta;
    }
    if (sortBy === 'name') return (a.title || '').localeCompare(b.title || '', locale);
    // default: stable order by type then id
    const typeOrder = { workshop: 0, event: 1, product: 2 };
    const orderA = typeOrder[a.type] ?? 3;
    const orderB = typeOrder[b.type] ?? 3;
    if (orderA !== orderB) return orderA - orderB;
    return (a.id ?? 0) - (b.id ?? 0);
  });

  // Map DB workshop/event/product category to Home content filter (food | education | lifestyle)
  function mapToContentCategory(category) {
    if (!category) return 'lifestyle';
    const c = category.toLowerCase();
    if (['gardening', 'cooking', 'food'].includes(c)) return 'food';
    if (c === 'education') return 'education';
    if (['energy', 'water', 'environment', 'market', 'cleanup', 'lifestyle'].includes(c)) return 'lifestyle';
    return 'lifestyle';
  }

  useEffect(() => {
    setError(null);
    const loadFromJson = () =>
      import('../data/items.json')
        .then(module => {
          const raw = module.default ?? [];
          setItems(raw.map(mapJsonItem));
          setError(null);
        })
        .catch(() => {
          setItems([]);
          setError('Unable to load content. Please refresh the page.');
        });

    checkApiHealth().then(apiOk => {
      if (!apiOk) {
        // Backend not running – use internal JSON only (avoids 3 failed API requests)
        loadFromJson();
        setLoading(false);
        return;
      }
      Promise.all([
        backendServices.getWorkshops().then(r => (r?.data ?? []).map(w => ({
          id: w.id,
          title: w.title,
          description: w.description,
          price: parseFloat(w.price) ?? 0,
          category: w.category || 'workshop',
          topic: (w.category || '').toLowerCase() || null,
          contentCategory: mapToContentCategory(w.category),
          date: w.date,
          location: w.location,
          image: w.image_url || '',
          type: 'workshop',
          availableSpots: (w.max_participants ?? 20) - (w.current_participants ?? 0),
          detailPath: '/workshop',
        }))),
        backendServices.getEvents().then(r => (r?.data ?? []).map(e => ({
          id: e.id,
          title: e.title,
          description: e.description,
          price: parseFloat(e.price) ?? 0,
          category: e.category || 'event',
          topic: (e.category || '').toLowerCase() || null,
          contentCategory: mapToContentCategory(e.category),
          date: e.date,
          location: e.location,
          image: e.image_url || '',
          type: 'event',
          detailPath: '/event',
        }))),
        backendServices.getProducts().then(r => (r?.data ?? []).map(p => ({
          id: p.id,
          title: p.name,
          description: p.description,
          price: parseFloat(p.price) ?? 0,
          category: p.category || 'product',
          topic: (p.category || '').toLowerCase() || null,
          contentCategory: mapToContentCategory(p.category),
          image: p.image_url || '',
          type: 'product',
          rating: p.sustainability_rating,
          stock: p.stock_quantity ?? 0,
          detailPath: '/product',
        }))),
      ])
        .then(([workshops, events, products]) => setItems([...workshops, ...events, ...products]))
        .catch(() => loadFromJson())
        .finally(() => setLoading(false));
    });
  }, []);

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-eco-green to-fresh-teal dark:from-eco-green/90 dark:to-fresh-teal/90 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('home.title')}
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t('home.subtitle')}
          </p>
          <Link 
            to="/booking"
            className="bg-white text-eco-green px-8 py-3 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all transform hover:scale-105 inline-block"
          >
            {t('home.getStarted')}
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* API Integration Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-600 pb-2">
            {t('home.realTimeEcoData')}
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Weather Widget */}
            <div className="lg:col-span-2">
              <WeatherWidget showDetails={true} />
            </div>
            
            {/* Sustainability Tips */}
            <div>
              <SustainabilityTips />
            </div>
          </div>
          
          {/* Nearby Events */}
          <div className="mb-8">
            <NearbyEvents />
          </div>
          
          {/* API Status */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">{t('home.liveDataSources')}</span> Weather API • Geolocation • Sustainability Tips
            </p>
            <div className="flex justify-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                Open-Meteo API
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                OpenStreetMap
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                Browser Geolocation
              </span>
            </div>
          </div>
        </div>

        {/* Browse & filter – one card, clear labels, sort as dropdown */}
        <section
          className="mb-8"
          aria-labelledby="category-heading"
        >
          <h2 id="category-heading" className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
            {t('home.browseByCategory')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-5">
            {t('home.selectCategory')}
          </p>
          <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
            <div className="space-y-5">
              {/* Topic: matches DB categories (gardening, cooking, education, energy, water) */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 block mb-2">
                  {t('home.topic')}
                </span>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Topic category">
                  {TOPIC_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedTopic(cat.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-eco-green focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-gray-800 ${
                        selectedTopic === cat.id ? 'bg-eco-green text-white shadow-sm' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                      }`}
                      aria-pressed={selectedTopic === cat.id}
                      aria-label={`Filter by ${t('home.' + cat.id)}`}
                    >
                      {t('home.' + cat.id)}
                    </button>
                  ))}
                </div>
              </div>
              {/* Type: All, Workshop, Product, Event */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 block mb-2">
                  {t('home.type')}
                </span>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Item type">
                  {['all', 'workshop', 'product', 'event'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedType(type)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-eco-green focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-gray-800 ${
                        selectedType === type ? 'bg-eco-green text-white shadow-sm' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                      }`}
                      aria-pressed={selectedType === type}
                      aria-label={`Filter by type: ${t('home.' + (type === 'all' ? 'all' : type))}`}
                    >
                      {t('home.' + (type === 'all' ? 'all' : type))}
                    </button>
                  ))}
                </div>
              </div>
              {/* Sort: dropdown instead of 6 pills */}
              <div>
                <label htmlFor="home-sort" className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 block mb-2">
                  {t('home.sortBy')}
                </label>
                <select
                  id="home-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full max-w-xs px-4 py-2.5 rounded-lg text-sm font-medium bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-eco-green focus:border-transparent"
                  aria-label={t('home.sortBy')}
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>
                      {t('home.sort.' + opt.id)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700" role="alert">
            {error}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-2 underline font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-eco-green focus-visible:ring-offset-2 rounded"
            >
              Refresh page
            </button>
          </div>
        )}

        <section
          className="mb-12"
          aria-labelledby="results-heading"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 id="results-heading" className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {selectedTopic === 'all' ? t('home.allActivities') : `${t('home.' + selectedTopic)} – ${filteredItems.length} ${t('home.items')}`}
            </h2>
            <span className="text-gray-600 dark:text-gray-300" aria-live="polite">
              {filteredItems.length} {t('home.items')}
            </span>
          </div>

          <EcoCardGrid
            items={filteredItems}
            loading={loading}
            columns={3}
          />
        </section>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-earth-brown/10 to-fresh-teal/10 dark:from-earth-brown/20 dark:to-fresh-teal/20 rounded-2xl p-8 text-center dark:bg-gray-800/50">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">{t('home.readyToMakeDifference')}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            {t('home.readySubtext')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/workshops"
              className="bg-eco-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
            >
              {t('home.exploreWorkshops')}
            </Link>
            <Link 
              to="/products"
              className="bg-white text-eco-green border border-eco-green px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              {t('home.shopProducts')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;