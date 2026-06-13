import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../redux/cartSlice";
import { calculateShipping } from "../utils/shipping";

export const useCart = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.cart);

  const add = (product, quantity = 1) => {
    dispatch(addToCart({ ...product, quantity }));
  };

  const remove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const updateQty = (productId, quantity) => {
    if (quantity < 1) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(updateQuantity({ productId, quantity }));
    }
  };

  const clear = () => dispatch(clearCart());

  const isInCart = (productId) =>
    items.some((i) => i._id === productId);

  const getQuantity = (productId) =>
    items.find((i) => i._id === productId)?.quantity || 0;

  const subtotal = items.reduce(
    (sum, i) => sum + (i.salePrice || i.price) * i.quantity,
    0
  );

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const shipping = calculateShipping(subtotal);

  const total = subtotal + shipping;

  return {
    items,
    subtotal,
    shipping,
    total,
    totalItems,
    add,
    remove,
    updateQty,
    clear,
    isInCart,
    getQuantity,
  };
};

export default useCart;