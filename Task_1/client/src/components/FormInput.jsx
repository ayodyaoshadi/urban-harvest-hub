import { useState } from 'react';
import PropTypes from 'prop-types';

const FormInput = ({
  label,
  type = 'text',
  name,
  id,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  forceShowError = false,
  min,
  max,
  step,
  multiline = false,
  rows,
  className = '',
  ...rest
}) => {
  const [touched, setTouched] = useState(false);
  const showError = (touched || forceShowError) && error;
  const inputId = id || name;

  const handleBlur = () => {
    setTouched(true);
  };

  const inputClassName = `w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
    showError
      ? 'border-red-500 focus:ring-red-500'
      : 'border-gray-300 dark:border-gray-600 focus:border-eco-green focus:ring-eco-green'
  } ${disabled ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-70' : ''}`;

  return (
    <div className={`mb-4 ${className}`}>
      <label 
        htmlFor={inputId}
        className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {multiline ? (
        <textarea
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows ?? 3}
          {...rest}
          className={inputClassName}
          aria-invalid={!!showError}
          aria-describedby={showError ? `${inputId}-error` : undefined}
        />
      ) : (
        <input
          id={inputId}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          {...rest}
          className={inputClassName}
          aria-invalid={!!showError}
          aria-describedby={showError ? `${inputId}-error` : undefined}
        />
      )}
      
      {showError && (
        <p 
          id={`${inputId}-error`}
          className="mt-2 text-sm text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

FormInput.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  forceShowError: PropTypes.bool,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  multiline: PropTypes.bool,
  rows: PropTypes.number,
  className: PropTypes.string,
};

export default FormInput;