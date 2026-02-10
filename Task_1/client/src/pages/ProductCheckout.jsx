import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatPriceLKR } from '../utils/currency';

const ProductCheckout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 text-gray-900 dark:text-gray-100">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="mb-4">{t('productCheckout.noProduct')}</p>
          <Link to="/products" className="text-eco-green underline">
            {t('productCheckout.browseProducts')}
          </Link>
        </div>
      </div>
    );
  }

  const title = product.title || product.name;
  const image = product.image_url || product.image || '';
  const price = product.price ?? 0;
  const description = product.description;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 max-w-4xl">
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <button
                onClick={() => navigate('/')}
                className="text-gray-500 hover:text-eco-green"
              >
                Home
              </button>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <button
                onClick={() => navigate('/products')}
                className="text-gray-500 hover:text-eco-green"
              >
                {t('nav.products')}
              </button>
            </li>
            <li className="text-gray-400">/</li>
            <li className="font-medium text-eco-green">{t('productCheckout.completePurchase')}</li>
          </ol>
        </nav>

        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {t('productCheckout.completePurchase')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t('productCheckout.fillDetails')}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 border border-eco-green/20 dark:border-gray-700">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {image ? (
              <img
                src={image}
                alt={title}
                className="w-full md:w-48 h-48 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full md:w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
                No image
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{title}</h2>
              {description && (
                <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
              )}
              <p className="text-xl font-bold text-eco-green">{formatPriceLKR(price)}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-gray-800 rounded-xl p-6">
          <p className="text-gray-600 dark:text-gray-300">
            {t('productCheckout.contactToOrder')}{' '}
            <a href="mailto:orders@urbanharvesthub.com" className="text-eco-green hover:underline">
              orders@urbanharvesthub.com
            </a>
          </p>
          <Link
            to="/products"
            className="inline-block mt-4 bg-eco-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90"
          >
            {t('productCheckout.backToProducts')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCheckout;
