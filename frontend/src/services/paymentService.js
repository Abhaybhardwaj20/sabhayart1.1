import API from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const paymentService = {
  createOrder: (amount) => API.post(ENDPOINTS.RAZORPAY_ORDER, { amount }),
  verifyPayment: (data) => API.post(ENDPOINTS.RAZORPAY_VERIFY, data),

  /**
   * Full Razorpay checkout flow.
   * @param {object} options
   * @param {number}   options.amount       - Amount in paise (e.g. 50000 = ₹500)
   * @param {object}   options.user         - { name, email, phone }
   * @param {Function} options.onSuccess    - Called with verifyPayment response data
   * @param {Function} options.onFailure    - Called with error message
   */
  initiateCheckout: async ({ amount, user, onSuccess, onFailure }) => {
    const loaded = await loadRazorpayScript();
    if (!loaded) return onFailure?.('Could not load payment gateway. Please try again.');

    try {
      const { data: order } = await API.post(ENDPOINTS.RAZORPAY_ORDER, { amount });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'Sabhaya Paintings',
        description: 'Handcrafted Canvas Paintings',
        order_id: order.id,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: { color: '#1a1a1a' },
        handler: async (response) => {
          try {
            const { data } = await API.post(ENDPOINTS.RAZORPAY_VERIFY, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            onSuccess?.(data);
          } catch {
            onFailure?.('Payment verification failed. Contact support if amount was deducted.');
          }
        },
        modal: {
          ondismiss: () => onFailure?.('Payment cancelled.'),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      onFailure?.('Could not initiate payment. Please try again.');
    }
  },
};

export default paymentService;