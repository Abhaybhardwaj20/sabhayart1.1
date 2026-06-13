export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePhone = (phone) => {
  return /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ""));
};

export const validatePincode = (pin) => {
  return /^\d{6}$/.test(pin);
};

export const validatePassword = (password) => {
  const errors = [];

  if (password.length < 6) {
    errors.push("At least 6 characters");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("One uppercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("One number");
  }

  return errors;
};

export const validateCheckoutForm = (form) => {
  const errors = {};

  if (!form.fullName?.trim()) {
    errors.fullName = "Full name is required";
  }

  if (!validateEmail(form.email || "")) {
    errors.email = "Valid email required";
  }

  if (!validatePhone(form.phone || "")) {
    errors.phone = "Valid 10-digit mobile required";
  }

  if (!form.address?.trim()) {
    errors.address = "Address is required";
  }

  if (!form.city?.trim()) {
    errors.city = "City is required";
  }

  if (!form.state?.trim()) {
    errors.state = "State is required";
  }

  if (!validatePincode(form.pincode || "")) {
    errors.pincode = "Valid 6-digit pincode required";
  }

  return errors;
};

/* Added because Checkout.jsx imports validateCheckout */
export const validateCheckout = (form) => {
  const errors = validateCheckoutForm(form);

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateProduct = (form) => {
  const errors = {};

  if (!form.title?.trim()) {
    errors.title = "Title is required";
  }

  if (!form.price || form.price <= 0) {
    errors.price = "Valid price required";
  }

  if (!form.category) {
    errors.category = "Category is required";
  }

  if (!form.description?.trim()) {
    errors.description = "Description is required";
  }

  return errors;
};