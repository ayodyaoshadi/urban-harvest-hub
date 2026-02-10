import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import { validationRules, sanitizeFormData, calculateTotal } from '../utils/validation';
import { formatPriceLKR } from '../utils/currency';
import { backendServices } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import PropTypes from 'prop-types';

const BookingForm = ({ workshop, onSuccess, isEvent = false }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Initial form state (workshopId must be string for select and validation)
  const initialFormData = {
    fullName: '',
    email: '',
    phone: '',
    bookingDate: '',
    participants: '1',
    workshopId: workshop?.id != null ? String(workshop.id) : '',
    specialRequirements: '',
    agreeToTerms: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  // Workshop options from location state or props
  const [availableWorkshops, setAvailableWorkshops] = useState([]);
  const successRef = useRef(null);
  const validationErrorRef = useRef(null);

  // When a workshop is pre-selected (e.g. from "Book now"), set Select Workshop and booking date
  useEffect(() => {
    if (workshop?.id != null) {
      setFormData((prev) => {
        const next = { ...prev, workshopId: String(workshop.id) };
        if (workshop.date) {
          const d = workshop.date;
          const ymd = typeof d === 'string' ? d.split('T')[0] : (d && d.toISOString?.().split('T')[0]);
          if (ymd) next.bookingDate = ymd;
        }
        return next;
      });
    }
  }, [workshop?.id, workshop?.date]);

  useEffect(() => {
    if (!workshop) {
      const mapToOption = (w) => ({
        id: w.id,
        title: w.title,
        price: parseFloat(w.price) ?? 0,
        date: w.date,
        availableSpots: (w.max_participants ?? 20) - (w.current_participants ?? 0),
      });
      const applyList = (list) => {
        setAvailableWorkshops(list);
        const queryParams = new URLSearchParams(location.search);
        const workshopId = queryParams.get('workshopId');
        if (workshopId) {
          const match = list.find((w) => w.id === parseInt(workshopId, 10));
          if (match) {
            const ymd = match.date ? (typeof match.date === 'string' ? match.date.split('T')[0] : match.date?.toISOString?.().split('T')[0]) : '';
            setFormData((prev) => ({ ...prev, workshopId, ...(ymd && { bookingDate: ymd }) }));
          }
        }
      };
      backendServices
        .getWorkshops()
        .then((r) => {
          const list = (r?.data ?? []).map(mapToOption);
          applyList(list);
        })
        .catch(() => {
          // API down – load workshops from internal items.json
          import('../data/items.json').then((m) => {
            const raw = m.default || [];
            const list = raw
              .filter((i) => i.category === 'Workshop')
              .map((i) => ({
                id: i.id,
                title: i.title,
                price: parseFloat(i.price) ?? 0,
                date: i.date,
                availableSpots: i.availableSpots ?? 10,
              }));
            applyList(list);
          });
        });
    }
  }, [workshop, location.search]);

  // Update total price when participants or selected workshop change
  const selectedWorkshopFromList = formData.workshopId
    ? availableWorkshops.find((w) => w.id === parseInt(formData.workshopId, 10))
    : null;
  const pricePerPerson = workshop?.price ?? selectedWorkshopFromList?.price ?? 10000;
  useEffect(() => {
    setTotalPrice(calculateTotal(formData.participants, pricePerPerson));
  }, [formData.participants, pricePerPerson]);

  // Get today's date in YYYY-MM-DD format for date input min
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get max date (6 months from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 6);
    return maxDate.toISOString().split('T')[0];
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => {
      const next = { ...prev, [name]: type === 'checkbox' ? checked : value };
      // When user selects a workshop from dropdown, set booking date to that workshop's date so they match
      if (name === 'workshopId' && value) {
        const selected = availableWorkshops.find((w) => w.id === parseInt(value, 10));
        if (selected?.date) {
          const ymd = typeof selected.date === 'string' ? selected.date.split('T')[0] : selected.date?.toISOString?.().split('T')[0];
          if (ymd) next.bookingDate = ymd;
        }
      }
      return next;
    });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle field blur (trigger validation)
  const handleFieldBlur = (fieldName) => {
    if (!validationRules[fieldName]) return;

    const error = validateField(fieldName, formData[fieldName], validationRules);
    
    if (error) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: error,
      }));
    }
  };

  // Validate single field
  const validateField = (name, value, rules) => {
    if (!rules[name]) return null;

    const fieldRules = rules[name];
    
    // Check required
    if (fieldRules.required && !value.trim()) {
      return fieldRules.required;
    }

    // Check pattern for email and phone
    if (fieldRules.pattern && !fieldRules.pattern.value.test(value)) {
      return fieldRules.pattern.message;
    }

    // Check min/max for participants
    if (name === 'participants') {
      const participants = parseInt(value);
      if (participants < 1) return 'At least 1 participant is required';
      if (participants > (workshop?.availableSpots || 10)) {
        return `Maximum ${workshop?.availableSpots || 10} participants available`;
      }
    }

    // Custom date validation
    if (name === 'bookingDate' && value) {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        return 'Date must be today or in the future';
      }
    }

    return null;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    let hasErrors = false;

    Object.keys(formData).forEach((field) => {
      if (field === 'agreeToTerms') {
        if (!formData[field]) {
          newErrors[field] = 'You must agree to the terms and conditions';
          hasErrors = true;
        }
        return;
      }

      if (field === 'specialRequirements') return; // Optional field
      
      const error = validateField(field, formData[field], validationRules);
      if (error) {
        newErrors[field] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    if (hasErrors) {
      setSubmitAttempted(true);
      // Scroll to validation message at top so user sees what went wrong
      requestAnimationFrame(() => {
        validationErrorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return;
    }

    setIsSubmitting(true);
    setErrors((prev) => ({ ...prev, submit: null }));

    try {
      const sanitizedData = sanitizeFormData(formData);
      const workshopIdNum = parseInt(formData.workshopId, 10);

      // Build API payload: server expects booking_date, workshop_id or event_id, participants (user_id from JWT)
      const bookingPayload = {
        booking_date: sanitizedData.bookingDate || formData.bookingDate,
        workshop_id: !isEvent && workshopIdNum ? workshopIdNum : undefined,
        event_id: isEvent && workshopIdNum ? workshopIdNum : undefined,
        participants: parseInt(formData.participants, 10) || 1,
        special_requirements: (sanitizedData.specialRequirements || formData.specialRequirements || '').trim() || null,
      };

      await backendServices.createBooking(bookingPayload);

      setErrors({});
      setSubmitAttempted(false);
      setSubmitSuccess(true);

      setTimeout(() => {
        setFormData(initialFormData);
        setSubmitSuccess(false);

        if (onSuccess) {
          onSuccess({ ...sanitizedData, totalPrice });
        } else {
          navigate('/booking-success', {
            state: {
              bookingData: { ...sanitizedData, totalPrice },
              totalPrice,
            },
          });
        }
      }, 3500);
    } catch (error) {
      console.error('Booking error:', error);
      const message = error?.response?.data?.message || error?.message || 'Failed to submit booking. Please try again.';
      setErrors({
        submit: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Workshop options for select
  const workshopOptions = workshop 
    ? [{ value: workshop.id.toString(), label: workshop.title }]
    : availableWorkshops.map(w => ({
        value: w.id.toString(),
        label: w.title,
      }));

  // Scroll success message into view when it appears (after DOM update)
  useEffect(() => {
    if (!submitSuccess) return;
    const id = requestAnimationFrame(() => {
      successRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    return () => cancelAnimationFrame(id);
  }, [submitSuccess]);

  if (submitSuccess) {
    return (
      <div
        ref={successRef}
        className="text-center py-12 px-4 rounded-xl bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700 text-gray-900 dark:text-gray-100"
        role="status"
        aria-live="polite"
      >
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h3 className="text-2xl font-bold mb-2">{t('bookingForm.bookingSuccessful')}</h3>
        <p className="text-gray-600 dark:text-gray-300">
          {t('bookingForm.confirmationSent')} {formData.email}.
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Redirecting to confirmation…
        </p>
      </div>
    );
  }

  const hasValidationErrors = Object.keys(errors).length > 0;

  return (
    <form 
      onSubmit={handleSubmit}
      className="space-y-6"
      noValidate
      aria-label="Booking form"
    >
      {/* Validation error summary – only when there are errors and we're not showing success */}
      {hasValidationErrors && !submitSuccess && (
        <div
          ref={validationErrorRef}
          className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800"
          role="alert"
          aria-live="assertive"
        >
          <p className="font-semibold text-red-800 dark:text-red-200">
            {errors.submit ? t('bookingForm.errorSubmit') : t('bookingForm.errorFixBelow')}
          </p>
          {errors.submit ? (
            <p className="mt-1 text-sm text-red-600 dark:text-red-300">{errors.submit}</p>
          ) : (
            <p className="mt-1 text-sm text-red-600 dark:text-red-300">
              {t('bookingForm.errorCheckFields')}
            </p>
          )}
        </div>
      )}

      {/* Personal Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
<h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-600 pb-2">
        {t('bookingForm.personalInfo')}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            onBlur={() => handleFieldBlur('fullName')}
            error={errors.fullName}
            placeholder="Enter your full name"
            required
            forceShowError={submitAttempted}
          />
          
          <FormInput
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={() => handleFieldBlur('email')}
            error={errors.email}
            placeholder="your.email@example.com"
            required
            forceShowError={submitAttempted}
          />
          
          <FormInput
            label="Phone Number"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            onBlur={() => handleFieldBlur('phone')}
            error={errors.phone}
            placeholder="Enter your phone number"
            required
            forceShowError={submitAttempted}
          />
        </div>
      </div>

      {/* Booking Details */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
<h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-600 pb-2">
        {t('bookingForm.bookingDetails')}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormSelect
            label={t(isEvent ? 'bookingForm.selectEvent' : 'bookingForm.selectWorkshop')}
            name="workshopId"
            value={formData.workshopId}
            onChange={handleInputChange}
            onBlur={() => handleFieldBlur('workshopId')}
            options={workshopOptions}
            error={errors.workshopId}
            required
            disabled={!!workshop}
            forceShowError={submitAttempted}
          />
          
          <FormInput
            label={t('bookingForm.bookingDate')}
            type="date"
            name="bookingDate"
            value={formData.bookingDate}
            onChange={handleInputChange}
            onBlur={() => handleFieldBlur('bookingDate')}
            error={errors.bookingDate}
            required
            min={getTodayDate()}
            max={getMaxDate()}
            disabled={!!(workshop?.date || (formData.workshopId && selectedWorkshopFromList?.date))}
            forceShowError={submitAttempted}
          />
          
          <FormInput
            label={t('bookingForm.participants')}
            type="number"
            name="participants"
            value={formData.participants}
            onChange={handleInputChange}
            onBlur={() => handleFieldBlur('participants')}
            error={errors.participants}
            required
            min="1"
            max={workshop?.availableSpots || "10"}
            step="1"
            forceShowError={submitAttempted}
          />
          
          <div className="flex flex-col justify-center">
            <p className="text-gray-600 dark:text-gray-300">{t('bookingForm.pricePerPerson')} <span className="font-bold">{formatPriceLKR(pricePerPerson)}</span></p>
            <p className="text-xl font-bold text-eco-green mt-2">
              {t('bookingForm.total')} {formatPriceLKR(totalPrice)}
            </p>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
<h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-600 pb-2">
        {t('bookingForm.additionalInfo')}
        </h3>
        
        <FormInput
          label={t('bookingForm.specialRequirements')}
          name="specialRequirements"
          value={formData.specialRequirements}
          onChange={handleInputChange}
          error={errors.specialRequirements}
          placeholder="Any dietary requirements, accessibility needs, or other notes..."
          multiline
          rows={3}
          forceShowError={submitAttempted}
        />
        
        {/* Terms and Conditions */}
        <div className="mt-6">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="mt-1 mr-3 h-5 w-5 rounded border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700 text-eco-green focus:ring-eco-green"
              aria-invalid={!!errors.agreeToTerms}
            />
            <label htmlFor="agreeToTerms" className="text-gray-700 dark:text-gray-300">
              {t('bookingForm.agreeToTerms')}
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
              {errors.agreeToTerms}
            </p>
          )}
        </div>
      </div>

      {/* Submit Button and Error */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 font-medium">{errors.submit}</p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            {t('bookingForm.cancel')}
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-8 py-3 rounded-lg font-bold transition-colors ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-eco-green text-white hover:bg-opacity-90'
            }`}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              `Confirm - ${formatPriceLKR(totalPrice)}`
            )}
          </button>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
          {t('bookingForm.confirmationNote')}
        </p>
      </div>
    </form>
  );
};

BookingForm.propTypes = {
  workshop: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    availableSpots: PropTypes.number,
  }),
  onSuccess: PropTypes.func,
  isEvent: PropTypes.bool,
};

export default BookingForm;