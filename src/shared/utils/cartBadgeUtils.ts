export function getCartBadgeValue(
  totalBooks: number | undefined | null
): number | undefined {
  if (!totalBooks || totalBooks <= 0) {
    return undefined;
  }
  return totalBooks;
}

export function hasCartItems(totalBooks: number | undefined | null): boolean {
  return (totalBooks || 0) > 0;
}

export function formatCartCount(totalBooks: number | undefined | null): string {
  const count = totalBooks || 0;
  return count > 99 ? "99+" : String(count);
}

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
