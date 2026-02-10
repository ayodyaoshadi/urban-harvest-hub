import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
  disabled = false,
  forceShowError = false,
  className = '',
}) => {
  const { t } = useTranslation();
  const [touched, setTouched] = useState(false);
  const showError = (touched || forceShowError) && error;

  const handleBlur = () => {
    setTouched(true);
  };

  return (
    <div className={`mb-4 ${className}`}>
      <label 
        htmlFor={name}
        className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        disabled={disabled}
        className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 transition-colors appearance-none ${
          showError
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 dark:border-gray-600 focus:border-eco-green focus:ring-eco-green'
        } ${disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-70' : ''}`}
        aria-invalid={!!showError}
        aria-describedby={showError ? `${name}-error` : undefined}
      >
        <option value="">{t('form.selectOption')}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {showError && (
        <p 
          id={`${name}-error`}
          className="mt-2 text-sm text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

FormSelect.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  error: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  forceShowError: PropTypes.bool,
  className: PropTypes.string,
};

export default FormSelect;