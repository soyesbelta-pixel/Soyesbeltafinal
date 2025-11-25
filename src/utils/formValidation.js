/**
 * Form Validation Utilities
 */

/**
 * Validate full name
 * @param {string} name - Name to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validateName = (name) => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'El nombre es requerido' };
  }

  if (name.trim().length < 3) {
    return { isValid: false, error: 'El nombre debe tener al menos 3 caracteres' };
  }

  // Allow letters, spaces, accents, and common Spanish characters
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
  if (!nameRegex.test(name.trim())) {
    return { isValid: false, error: 'El nombre solo puede contener letras y espacios' };
  }

  return { isValid: true, error: '' };
};

/**
 * Validate WhatsApp number
 * @param {string} whatsapp - WhatsApp number to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validateWhatsApp = (whatsapp) => {
  if (!whatsapp || whatsapp.trim().length === 0) {
    return { isValid: false, error: 'El número de WhatsApp es requerido' };
  }

  // Remove spaces, dashes, parentheses
  const cleaned = whatsapp.replace(/[\s\-()]/g, '');

  // Check if it contains only digits (with optional + prefix)
  const whatsappRegex = /^\+?[0-9]{10,15}$/;
  if (!whatsappRegex.test(cleaned)) {
    return {
      isValid: false,
      error: 'Ingresa un número válido (10-15 dígitos, ej: +52 55 1234 5678)'
    };
  }

  return { isValid: true, error: '' };
};

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {Object} { isValid: boolean, error: string }
 */
export const validateEmail = (email) => {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'El correo electrónico es requerido' };
  }

  // Standard email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Ingresa un correo electrónico válido' };
  }

  return { isValid: true, error: '' };
};

/**
 * Validate all contact form fields
 * @param {Object} formData - Form data object
 * @param {string} formData.userName - User's full name
 * @param {string} formData.whatsapp - WhatsApp number
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateContactForm = (formData) => {
  const nameValidation = validateName(formData.userName);
  const whatsappValidation = validateWhatsApp(formData.whatsapp);

  const errors = {
    userName: nameValidation.error,
    whatsapp: whatsappValidation.error
  };

  const isValid = nameValidation.isValid && whatsappValidation.isValid;

  return { isValid, errors };
};

/**
 * Format WhatsApp number for display
 * @param {string} whatsapp - Raw WhatsApp number
 * @returns {string} Formatted number
 */
export const formatWhatsApp = (whatsapp) => {
  const cleaned = whatsapp.replace(/[\s\-()]/g, '');

  // Format as +XX XX XXXX XXXX if it has country code
  if (cleaned.startsWith('+')) {
    const countryCode = cleaned.substring(0, 3);
    const rest = cleaned.substring(3);
    return `${countryCode} ${rest.substring(0, 2)} ${rest.substring(2, 6)} ${rest.substring(6)}`.trim();
  }

  // Format as XX XXXX XXXX for 10 digits
  if (cleaned.length === 10) {
    return `${cleaned.substring(0, 2)} ${cleaned.substring(2, 6)} ${cleaned.substring(6)}`;
  }

  return cleaned;
};
