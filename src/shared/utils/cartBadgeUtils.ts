/**
 * Unified Cart Badge Utilities
 * Centralized handling for cart badge display across the application
 * Use this file to calculate and format cart badge values
 */

/**
 * Get cart badge value to display
 * @param totalBooks - Total number of books in cart
 * @returns Badge value or undefined if no badge should be shown
 */
export function getCartBadgeValue(
  totalBooks: number | undefined | null
): number | undefined {
  if (!totalBooks || totalBooks <= 0) {
    return undefined;
  }
  return totalBooks;
}

/**
 * Check if cart has items (for badge visibility)
 * @param totalBooks - Total number of books in cart
 * @returns true if cart has items
 */
export function hasCartItems(totalBooks: number | undefined | null): boolean {
  return (totalBooks || 0) > 0;
}

/**
 * Format cart count for display
 * @param totalBooks - Total number of books in cart
 * @returns Formatted string for display
 */
export function formatCartCount(totalBooks: number | undefined | null): string {
  const count = totalBooks || 0;
  return count > 99 ? "99+" : String(count);
}

/**
 * Get badge styling for cart
 * @returns MUI sx prop styling object
 */
export function getCartBadgeStyles() {
  return {
    position: "absolute" as const,
    top: -6,
    right: -4,
    bgcolor: "error.main",
    color: "white",
    borderRadius: "50%",
    width: 18,
    height: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.7rem",
    fontWeight: 700,
  };
}
