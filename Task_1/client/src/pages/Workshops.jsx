import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { backendServices, checkApiHealth } from '../services/api';
import EcoCardGrid from '../components/EcoCardGrid';

function mapWorkshopToCard(w) {
  return {
    id: w.id,
    title: w.title,
    description: w.description,
    price: parseFloat(w.price),
    category: w.category || 'workshop',
    image: w.image_url || w.image || '',
    date: w.date,
    time: w.time || '',
    location: w.location,
    type: 'workshop',
  };
}

/** Map item from internal items.json (when API is down) to workshop card shape. */
function jsonToWorkshopCard(item) {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    price: parseFloat(item.price) || 0,
    category: item.category || 'workshop',
    image: item.image || '',
    date: item.date || '',
    time: '',
    location: item.location || '',
    type: 'workshop',
  };
}

const Workshops = () => {
  const { t } = useTranslation();
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkApiHealth().then((apiOk) => {
      if (!apiOk) {
        import('../data/items.json')
          .then((m) => (m.default ?? []).filter((i) => i.category === 'Workshop').map(jsonToWorkshopCard))
          .then(setWorkshops)
          .catch(() => setWorkshops([]))
          .finally(() => setLoading(false));
        return;
      }
      backendServices.getWorkshops()
        .then((res) => setWorkshops((res?.data ?? []).map(mapWorkshopToCard)))
        .catch(() => setWorkshops([]))
        .finally(() => setLoading(false));
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8" role="main" aria-label={t('nav.workshops')}>
      <h1 className="text-3xl font-bold mb-2">{t('nav.workshops')}</h1>
      <p className="text-gray-600 mb-8">
        {t('products.sustainableProducts')}
      </p>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{t('workshops.availableWorkshops')}</h2>
          <span className="text-gray-600">
            {t('workshops.count', { count: workshops.length })}
          </span>
        </div>
        
        <EcoCardGrid items={workshops} loading={loading} columns={2} detailPath="/workshop" />
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">{t('workshops.workshopInfo')}</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>{t('workshops.includeMaterials')}</li>
          <li>{t('workshops.certificates')}</li>
          <li>{t('workshops.skillLevels')}</li>
          <li>{t('workshops.groupDiscounts')}</li>
        </ul>
      </div>
    </div>
  );
};

export default Workshops;