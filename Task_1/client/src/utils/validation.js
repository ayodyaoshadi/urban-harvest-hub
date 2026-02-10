// Validation rules (used by BookingForm and other forms)
export const validationRules = {
    name: {
      required: 'Name is required',
      minLength: { value: 2, message: 'Name must be at least 2 characters' },
      maxLength: { value: 50, message: 'Name cannot exceed 50 characters' },
      pattern: { value: /^[A-Za-z\s'-]+$/, message: 'Name can only contain letters, spaces, hyphens, and apostrophes' },
    },
    fullName: {
      required: 'Full name is required',
      minLength: { value: 2, message: 'Name must be at least 2 characters' },
      maxLength: { value: 80, message: 'Name cannot exceed 80 characters' },
    },
    workshopId: {
      required: 'Please select a workshop',
    },
    bookingDate: {
      required: 'Booking date is required',
    },
    email: {
      required: 'Email is required',
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address',
      },
    },
    
    phone: {
      required: 'Phone number is required',
      pattern: {
        value: /^[\+]?[0-9][\d\s\-\(\)\.]{6,}$/,
        message: 'Please enter a valid phone number (e.g. 0712345678 or +94712345678)',
      },
    },
    
    date: {
      required: 'Date is required',
      futureDate: (value) => {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today || 'Date must be today or in the future';
      },
    },
    
    participants: {
      required: 'Number of participants is required',
      min: {
        value: 1,
        message: 'At least 1 participant is required',
      },
      max: {
        value: 10,
        message: 'Maximum 10 participants',
      },
    },
    
    comments: {
      maxLength: {
        value: 500,
        message: 'Comments cannot exceed 500 characters',
      },
    },
  };
  
  // Validate a single field (value is coerced to string so .trim/length/pattern never throw)
  export const validateField = (name, value, rules) => {
    if (!rules[name]) return null;
  
    const fieldRules = rules[name];
    const str = value != null && value !== '' ? String(value) : '';
    let error = null;
  
    // Check required
    if (fieldRules.required && !str.trim()) {
      return fieldRules.required;
    }
  
    // Check minLength
    if (fieldRules.minLength && str.length < fieldRules.minLength.value) {
      error = fieldRules.minLength.message;
    }
  
    // Check maxLength
    if (fieldRules.maxLength && str.length > fieldRules.maxLength.value) {
      error = fieldRules.maxLength.message;
    }
  
    // Check pattern (only if we have something to test)
    if (fieldRules.pattern && str && !fieldRules.pattern.value.test(str)) {
      error = fieldRules.pattern.message;
    }
  
    // Check min
    if (fieldRules.min && parseInt(str, 10) < fieldRules.min.value) {
      error = fieldRules.min.message;
    }
  
    // Check max
    if (fieldRules.max && parseInt(str, 10) > fieldRules.max.value) {
      error = fieldRules.max.message;
    }
  
    // Custom validation function
    if (typeof fieldRules === 'function') {
      error = fieldRules(value);
    }
  
    return error;
  };
  
  // Validate all fields
  export const validateForm = (formData, rules) => {
    const errors = {};
    let isValid = true;
  
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field], rules);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    });
  
    return { isValid, errors };
  };
  
  // Format phone number for display
  export const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{4})(\d{3})(\d{3})$/);
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]}`;
    }
    return phone;
  };
  
  // Sanitize form data
  export const sanitizeFormData = (data) => {
    const sanitized = { ...data };
    
    Object.keys(sanitized).forEach((key) => {
      if (typeof sanitized[key] === 'string') {
        sanitized[key] = sanitized[key].trim();
        
        // Prevent XSS attacks
        sanitized[key] = sanitized[key]
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
      }
    });
    
    return sanitized;
  };
  
  // Calculate booking total (pricePerPerson in LKR, e.g. 10000 = Rs. 10,000)
  export const calculateTotal = (participants, pricePerPerson = 10000) => {
    const participantsCount = parseInt(participants) || 0;
    return participantsCount * pricePerPerson;
  };