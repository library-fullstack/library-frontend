import { useContext } from "react";
import CartContext from "../../../../context/CartContext";

export function useBorrowCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useBorrowCart must be used within CartProvider");
  }
  return context;
}
