import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { formatPriceLKR } from '../utils/currency';

const BookingSuccess = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state?.bookingData;
  const totalPrice = location.state?.totalPrice || 0;

  useEffect(() => {
    // If no booking data, redirect to home
    if (!bookingData) {
      navigate('/');
    }
  }, [bookingData, navigate]);

  if (!bookingData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {t('bookingSuccess.bookingConfirmed')}
        </h1>
        
        <p className="text-gray-600 mb-8">
          {t('bookingSuccess.thankYouBooking')}, <span className="font-semibold">{bookingData.fullName}</span>.
          {t('bookingSuccess.confirmationSentTo')} <span className="font-semibold">{bookingData.email}</span>.
        </p>

        {/* Booking Details */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
          <h2 className="font-bold text-lg mb-4 text-gray-800">{t('bookingSuccess.bookingSummary')}</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('bookingSuccess.bookingRef')}</span>
              <span className="font-mono font-bold text-eco-green">
                UHH-{Date.now().toString().slice(-6)}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">{t('bookingSuccess.participants')}</span>
              <span className="font-bold">{bookingData.participants}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">{t('bookingSuccess.totalAmount')}</span>
              <span className="text-xl font-bold text-eco-green">{formatPriceLKR(totalPrice)}</span>
            </div>
            
            {bookingData.bookingDate && (
              <div className="flex justify-between">
                <span className="text-gray-600">{t('bookingSuccess.bookingDate')}</span>
                <span className="font-bold">
                  {new Date(bookingData.bookingDate).toLocaleDateString('en-GB', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="mb-8">
          <h3 className="font-bold text-lg mb-3 text-gray-800">{t('bookingSuccess.whatsNext')}</h3>
          <ol className="text-left list-decimal pl-5 space-y-2 text-gray-600">
            <li>{t('bookingSuccess.checkEmail')}</li>
            <li>{t('bookingSuccess.arriveEarly')}</li>
            <li>{t('bookingSuccess.bringRef')}</li>
            <li>{t('bookingSuccess.wearClothing')}</li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/workshops')}
            className="w-full bg-eco-green text-white py-3 rounded-lg font-bold hover:bg-opacity-90 transition-colors"
          >
            {t('bookingSuccess.bookAnotherWorkshop')}
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors"
          >
            {t('bookingSuccess.returnToHomepage')}
          </button>
        </div>

        {/* Contact Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            {t('bookingSuccess.questionsEmail')}{' '}
            <a href="mailto:support@urbanharvesthub.com" className="text-eco-green hover:underline">
              support@urbanharvesthub.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;