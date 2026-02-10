import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { backendServices, checkApiHealth } from '../services/api';
import EcoCardGrid from '../components/EcoCardGrid';

function mapProductToCard(p) {
  return {
    id: p.id,
    title: p.name || p.title,
    description: p.description,
    price: parseFloat(p.price),
    category: p.category || 'product',
    image: p.image_url || p.image || '',
    rating: p.sustainability_rating ?? p.rating,
    type: 'product',
  };
}

/** Map item from internal items.json (when API is down) to product card shape. */
function jsonToProductCard(item) {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    price: parseFloat(item.price) || 0,
    category: item.category || 'product',
    image: item.image || '',
    rating: item.rating ?? null,
    type: 'product',
  };
}

const Products = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkApiHealth().then((apiOk) => {
      if (!apiOk) {
        import('../data/items.json')
          .then((m) => (m.default ?? []).filter((i) => i.category === 'Product').map(jsonToProductCard))
          .then(setProducts)
          .catch(() => setProducts([]))
          .finally(() => setLoading(false));
        return;
      }
      backendServices.getProducts()
        .then((res) => setProducts((res?.data ?? []).map(mapProductToCard)))
        .catch(() => setProducts([]))
        .finally(() => setLoading(false));
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8" role="main" aria-label={t('nav.products')}>
      <h1 className="text-3xl font-bold mb-2">{t('nav.products')}</h1>
      <p className="text-gray-600 mb-8">
        {t('products.sustainableProducts')}
      </p>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{t('products.ourProducts')}</h2>
          <span className="text-gray-600">{t('products.count', { count: products.length })}</span>
        </div>
        <EcoCardGrid items={products} loading={loading} columns={3} detailPath="/product" />
      </div>
    </div>
  );
};

export default Products;