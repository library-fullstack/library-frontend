import { useCart as useCartRQ } from "../../features/borrow/components/hooks/useCart";
import useAuth from "../../features/auth/hooks/useAuth";

export function useCartQuery() {
  const { user } = useAuth();
  const { data: cart, isLoading } = useCartRQ(!!user);

  return {
    cart: cart || { items: [], totalBooks: 0, totalCopies: 0 },
    loading: isLoading,
  };
}
