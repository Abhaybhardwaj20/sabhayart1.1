import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProducts,
  fetchProductById,
  setFilters,
  clearFilters,
  setPage,
} from "../redux/productSlice";

export const useProducts = (autoFetch = true) => {
  const dispatch = useDispatch();
  const {
    items,
    selectedProduct,
    loading,
    error,
    filters,
    pagination,
    totalCount,
  } = useSelector((s) => s.products);

  useEffect(() => {
    if (autoFetch) {
      dispatch(fetchProducts({ ...filters, page: pagination.page }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.page, autoFetch]);

  const fetchAll = useCallback(
    (params = {}) => dispatch(fetchProducts(params)),
    [dispatch]
  );

  const fetchOne = useCallback(
    (id) => dispatch(fetchProductById(id)),
    [dispatch]
  );

  const updateFilters = useCallback(
    (newFilters) => {
      dispatch(setFilters(newFilters));
      dispatch(setPage(1));
    },
    [dispatch]
  );

  const resetFilters = useCallback(
    () => dispatch(clearFilters()),
    [dispatch]
  );

  const goToPage = useCallback(
    (page) => dispatch(setPage(page)),
    [dispatch]
  );

  // Only run client-side filter when NOT using server-side filtering.
  // If your backend handles category/price/search, just return `items` directly
  // and remove filteredItems entirely to avoid showing incomplete paginated data.
  const filteredItems = items.filter((p) => {
    if (filters.category && p.category !== filters.category) return false;
    if (filters.minPrice != null && p.price < filters.minPrice) return false;
    if (filters.maxPrice != null && p.price > filters.maxPrice) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      return (
        p.title?.toLowerCase().includes(q) ||
        p.artist?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return {
    items,
    filteredItems,
    selectedProduct,
    loading,
    error,
    filters,
    pagination,
    totalCount,
    fetchAll,
    fetchOne,
    updateFilters,
    resetFilters,
    goToPage,
  };
};

export default useProducts;