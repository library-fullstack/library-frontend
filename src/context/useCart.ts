export { useCart as useCartQuery } from "../features/borrow/components/hooks/useCart";

import { useCart as useReactQueryCart } from "../features/borrow/components/hooks/useCart";

export const useCart = () => {
  const { data: cart, isLoading: loading } = useReactQueryCart();
  return {
    cart: cart || { items: [], totalBooks: 0, totalCopies: 0 },
    loading,
    addItem: () => Promise.resolve(),
    removeItem: () => Promise.resolve(),
    updateQuantity: () => Promise.resolve(),
    clearCart: () => Promise.resolve(),
    refetch: () => Promise.resolve(),
  };
};
