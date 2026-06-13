export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateRegister = (data) => {
  const errors = [];
  if (!data.name || data.name.trim().length < 2)
    errors.push('Name must be at least 2 characters');
  if (!data.email || !validateEmail(data.email))
    errors.push('Valid email is required');
  if (!data.password || !validatePassword(data.password))
    errors.push('Password must be at least 6 characters');
  return errors;
};

export const validateLogin = (data) => {
  const errors = [];
  if (!data.email || !validateEmail(data.email))
    errors.push('Valid email is required');
  if (!data.password)
    errors.push('Password is required');
  return errors;
};

export const validatePainting = (data) => {
  const errors = [];
  if (!data.title || data.title.trim().length === 0)
    errors.push('Title is required');
  if (!data.description || data.description.trim().length === 0)
    errors.push('Description is required');
  if (!data.price || isNaN(data.price) || data.price < 0)
    errors.push('Valid price is required');
  if (!data.category)
    errors.push('Category is required');
  if (!data.artist || data.artist.trim().length === 0)
    errors.push('Artist name is required');
  return errors;
};

export const validateOrder = (data) => {
  const errors = [];
  if (!data.orderItems || data.orderItems.length === 0)
    errors.push('Order must have at least one item');
  if (!data.shippingAddress) {
    errors.push('Shipping address is required');
  } else {
    const { name, phone, street, city, state, pincode } = data.shippingAddress;
    if (!name) errors.push('Shipping name is required');
    if (!phone) errors.push('Phone number is required');
    if (!street) errors.push('Street address is required');
    if (!city) errors.push('City is required');
    if (!state) errors.push('State is required');
    if (!pincode) errors.push('Pincode is required');
  }
  return errors;
};