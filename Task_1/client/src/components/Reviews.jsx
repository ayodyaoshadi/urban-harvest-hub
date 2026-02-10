import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { backendServices, handleApiError } from '../services/api';

function Reviews({ workshopId, eventId, productId }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const params = {};
  if (workshopId) params.workshop_id = workshopId;
  if (eventId) params.event_id = eventId;
  if (productId) params.product_id = productId;

  useEffect(() => {
    if (!workshopId && !eventId && !productId) return;
    setLoading(true);
    backendServices
      .getReviews(params)
      .then((res) => setReviews(res?.data ?? []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [workshopId, eventId, productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setMessage('');
    try {
      await backendServices.createReview({
        rating,
        comment,
        ...(workshopId && { workshop_id: workshopId }),
        ...(eventId && { event_id: eventId }),
        ...(productId && { product_id: productId }),
      });
      setComment('');
      const res = await backendServices.getReviews(params);
      setReviews(res?.data ?? []);
      setMessage(t('common.success'));
    } catch (err) {
      setMessage(handleApiError(err).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-8" aria-labelledby="reviews-heading">
      <h2 id="reviews-heading" className="text-xl font-bold mb-4">{t('reviews.title')}</h2>
      {loading ? (
        <p className="text-gray-600">{t('common.loading')}</p>
      ) : (
        <>
          <ul className="space-y-3 mb-6" role="list">
            {reviews.length === 0 ? (
              <li className="text-gray-600">{t('reviews.leaveReview')}</li>
            ) : (
              reviews.map((r) => (
                <li key={r.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{r.full_name || r.username || 'User'}</span>
                    <span className="text-yellow-500" aria-label={`${r.rating} stars`}>
                      {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                    </span>
                  </div>
                  {r.comment && <p className="text-gray-600 text-sm">{r.comment}</p>}
                </li>
              ))
            )}
          </ul>
          {user && (
            <form onSubmit={handleSubmit} className="space-y-3">
              {message && (
                <p className={`text-sm ${message === t('common.success') ? 'text-green-600' : 'text-red-600'}`} role="status">
                  {message}
                </p>
              )}
              <label className="block">
                <span className="text-gray-700 font-medium">{t('reviews.rating')}</span>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
                  aria-label={t('reviews.rating')}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-gray-700 font-medium">{t('reviews.comment')}</span>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
                  aria-label={t('reviews.comment')}
                />
              </label>
              <button
                type="submit"
                disabled={submitting}
                className="bg-eco-green text-white px-4 py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50"
              >
                {submitting ? t('common.loading') : t('reviews.submit')}
              </button>
            </form>
          )}
        </>
      )}
    </section>
  );
}

export default Reviews;
