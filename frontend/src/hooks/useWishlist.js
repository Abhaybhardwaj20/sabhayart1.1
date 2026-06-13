import { useSelector, useDispatch } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../redux/wishlistSlice";

export const useWishlist = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.wishlist);

  const add = (product) => dispatch(addToWishlist(product));

  const remove = (productId) => dispatch(removeFromWishlist(productId));

  const toggle = (product) => {
    if (isInWishlist(product._id)) {
      remove(product._id);
    } else {
      add(product);
    }
  };

  const clear = () => dispatch(clearWishlist());

  const isInWishlist = (productId) =>
    items.some((i) => i._id === productId);

  return {
    items,
    count: items.length,
    add,
    remove,
    toggle,
    clear,
    isInWishlist,
  };
};

export default useWishlist;