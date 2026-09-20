export const isRequired = (value) => {
  return value !== null &&
    value !== undefined &&
    String(value).trim() !== "";
};

export const isValidEmail = (email) => {
  if (!email) {
    return false;
  }

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailPattern.test(email.trim());
};

export const isValidPhone = (phone) => {
  if (!phone) {
    return false;
  }

  const phonePattern = /^[6-9]\d{9}$/;

  return phonePattern.test(
    String(phone).replace(/\s+/g, "")
  );
};

export const isValidName = (name) => {
  if (!name) {
    return false;
  }

  const namePattern = /^[A-Za-zÀ-ÿ\s.'-]+$/;

  return namePattern.test(name.trim());
};

export const validateRequiredFields = (
  data,
  fields
) => {
  const errors = {};

  fields.forEach((field) => {
    if (!isRequired(data[field])) {
      errors[field] = "This field is required.";
    }
  });

  return errors;
};