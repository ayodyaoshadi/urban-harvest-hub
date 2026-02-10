import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { backendServices, checkApiHealth } from '../services/api';
import EcoCardGrid from '../components/EcoCardGrid';

function mapEventToCard(e) {
  return {
    id: e.id,
    title: e.title,
    description: e.description,
    price: e.is_free ? 0 : parseFloat(e.price || 0),
    category: e.category || 'event',
    image: e.image_url || e.image || '',
    date: e.date,
    time: e.time || '',
    location: e.location,
    type: 'event',
  };
}

/** Map item from internal items.json (when API is down) to event card shape. */
function jsonToEventCard(item) {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    price: parseFloat(item.price) ?? 0,
    category: item.category || 'event',
    image: item.image || '',
    date: item.date || '',
    time: '',
    location: item.location || '',
    type: 'event',
  };
}

const Events = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkApiHealth().then((apiOk) => {
      if (!apiOk) {
        import('../data/items.json')
          .then((m) => (m.default ?? []).filter((i) => i.category === 'Event').map(jsonToEventCard))
          .then(setEvents)
          .catch(() => setEvents([]))
          .finally(() => setLoading(false));
        return;
      }
      backendServices
        .getEvents()
        .then((res) => setEvents((res?.data ?? []).map(mapEventToCard)))
        .catch(() => setEvents([]))
        .finally(() => setLoading(false));
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8" role="main" aria-label={t('nav.events')}>
      <h1 className="text-3xl font-bold mb-2">{t('nav.events')}</h1>
      <p className="text-gray-600 mb-8">
        {t('events.subtitle')}
      </p>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{t('events.upcomingEvents')}</h2>
          <span className="text-gray-600">{t('events.count', { count: events.length })}</span>
        </div>
        <EcoCardGrid
          items={events}
          loading={loading}
          columns={2}
          detailPath="/event"
        />
      </div>
    </div>
  );
};

export default Events;
