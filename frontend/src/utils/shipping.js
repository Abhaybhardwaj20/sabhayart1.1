import { SHIPPING_CHARGES } from "./constants";
import formatPrice from "./currencyFormatter";

export const calcShipping = (subtotal, method = "standard") => {
  if (subtotal >= SHIPPING_CHARGES.free_threshold) return 0;
  return SHIPPING_CHARGES[method] || SHIPPING_CHARGES.standard;
};

export const calculateShipping = calcShipping;

export const isFreeShipping = (subtotal) =>
  subtotal >= SHIPPING_CHARGES.free_threshold;

export const getShippingLabel = (method) => {
  const labels = {
    standard: "Standard Delivery (5–7 days)",
    express: "Express Delivery (2–3 days)",
  };
  return labels[method] || "Standard Delivery";
};

export const getShippingOptions = (subtotal) => [
  {
    id: "standard",
    label: "Standard Delivery",
    eta: "5–7 business days",
    price: isFreeShipping(subtotal) ? 0 : SHIPPING_CHARGES.standard,
    priceLabel: isFreeShipping(subtotal)
      ? "FREE"
      : formatPrice(SHIPPING_CHARGES.standard),
  },
  {
    id: "express",
    label: "Express Delivery",
    eta: "2–3 business days",
    price: isFreeShipping(subtotal) ? 0 : SHIPPING_CHARGES.express,
    priceLabel: isFreeShipping(subtotal)
      ? "FREE"
      : formatPrice(SHIPPING_CHARGES.express),
  },
];

export const estimateDeliveryDate = (method = "standard") => {
  const days = method === "express" ? 3 : 7;
  const date = new Date();
  date.setDate(date.getDate() + days);

  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
};