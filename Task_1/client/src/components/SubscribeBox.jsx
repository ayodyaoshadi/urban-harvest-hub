import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { backendServices, handleApiError } from '../services/api';

function SubscribeBox({ productId }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [frequency, setFrequency] = useState('monthly');
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setMessage('');
    try {
      await backendServices.createSubscription({ product_id: productId, frequency, quantity });
      setMessage(t('common.success'));
    } catch (err) {
      setMessage(handleApiError(err).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <section className="mt-6 border-t border-gray-200 pt-6" aria-labelledby="subscribe-heading">
      <h2 id="subscribe-heading" className="text-lg font-bold mb-3">{t('subscriptions.subscribe')}</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {message && (
          <p className={`text-sm ${message === t('common.success') ? 'text-green-600' : 'text-red-600'}`} role="status">
            {message}
          </p>
        )}
        <label className="block">
          <span className="text-gray-700 font-medium">{t('subscriptions.frequency')}</span>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
            aria-label={t('subscriptions.frequency')}
          >
            <option value="weekly">{t('subscriptions.weekly')}</option>
            <option value="biweekly">{t('subscriptions.biweekly')}</option>
            <option value="monthly">{t('subscriptions.monthly')}</option>
          </select>
        </label>
        <label className="block">
          <span className="text-gray-700 font-medium">{t('subscriptions.quantity')}</span>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value) || 1)}
            className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
            aria-label={t('subscriptions.quantity')}
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="bg-eco-green text-white px-4 py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50"
        >
          {submitting ? t('common.loading') : t('subscriptions.subscribe')}
        </button>
      </form>
    </section>
  );
}

export default SubscribeBox;
