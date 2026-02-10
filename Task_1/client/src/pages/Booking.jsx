import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import BookingForm from '../components/BookingForm';
import { backendServices } from '../services/api';
import { formatPriceLKR } from '../utils/currency';

function mapWorkshop(w) {
  return {
    id: w.id,
    title: w.title,
    description: w.description,
    price: parseFloat(w.price) ?? 0,
    date: w.date,
    location: w.location,
    image: w.image_url || '',
    availableSpots: (w.max_participants ?? 20) - (w.current_participants ?? 0),
  };
}

const Booking = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);

  const workshop = location.state?.workshop;
  const bookingType = location.state?.bookingType ?? workshop?.type ?? 'workshop';
  const isEvent = bookingType === 'event';

  // Require login: redirect to login and return here after login with same state
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login', {
        state: { from: '/booking', bookingState: location.state },
        replace: true,
      });
      return;
    }
  }, [user, authLoading, navigate, location.state]);

  useEffect(() => {
    if (location.state?.workshop) {
      setSelectedWorkshop(location.state.workshop);
      return;
    }
    const queryParams = new URLSearchParams(location.search);
    const workshopId = queryParams.get('workshopId');
    if (workshopId) {
      backendServices
        .getWorkshops()
        .then((r) => {
          const list = (r?.data ?? []).map(mapWorkshop);
          const workshop = list.find((w) => w.id === parseInt(workshopId, 10));
          if (workshop) setSelectedWorkshop(workshop);
        })
        .catch(() => {});
    }
  }, [location]);

  const handleBookingSuccess = (bookingData) => {
    navigate('/booking-success', {
      state: { bookingData, totalPrice: bookingData?.totalPrice },
    });
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
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
                onClick={() => navigate(isEvent ? '/events' : '/workshops')}
                className="text-gray-500 hover:text-eco-green"
              >
                {isEvent ? t('nav.events') : t('nav.workshops')}
              </button>
            </li>
            <li className="text-gray-400">/</li>
            <li className="font-medium text-eco-green">{t('booking.booking')}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {isEvent ? t('booking.bookYourEvent') : t('booking.bookYourWorkshop')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t('booking.fillDetails')}
          </p>
        </div>

        {/* Workshop Summary */}
        {selectedWorkshop && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 border border-eco-green/20 dark:border-gray-700">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {selectedWorkshop.image ? (
                <img
                  src={selectedWorkshop.image}
                  alt={selectedWorkshop.title}
                  className="w-full md:w-48 h-48 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full md:w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
                  No image
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{selectedWorkshop.title}</h2>
                <p className="text-gray-600 mb-4">{selectedWorkshop.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">{t('booking.date')}</p>
                    <p className="font-medium">
                      {new Date(selectedWorkshop.date).toLocaleDateString('en-GB', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('booking.location')}</p>
                    <p className="font-medium">{selectedWorkshop.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('booking.availableSpots')}</p>
                    <p className="font-medium">{selectedWorkshop.availableSpots}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t('booking.price')}</p>
                    <p className="text-xl font-bold text-eco-green">{formatPriceLKR(selectedWorkshop.price)} per person</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Booking Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <BookingForm 
            workshop={selectedWorkshop}
            onSuccess={handleBookingSuccess}
            isEvent={isEvent}
          />
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-blue-50 dark:bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <span className="mr-2">ℹ️</span> {t('booking.bookingInfo')}
          </h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>{t('booking.confirmEmail')}</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>{t('booking.cancellations')}</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>{t('booking.clothing')}</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>{t('booking.materials')}</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>{t('booking.contactEmail')} <a href="mailto:bookings@urbanharvesthub.com" className="text-eco-green hover:underline">bookings@urbanharvesthub.com</a></span>
            </li>
          </ul>
        </div>

        {/* Accessibility Note */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            {t('booking.needAccessibility')}{' '}
            <button 
              onClick={() => navigate('/accessibility')}
              className="text-eco-green hover:underline"
            >
              {t('booking.contactUs')}
            </button>
            {' '}{t('booking.daysBefore')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Booking;