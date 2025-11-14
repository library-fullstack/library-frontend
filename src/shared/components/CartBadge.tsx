import React from "react";
import { Box, BoxProps } from "@mui/material";
import { getCartBadgeValue, getCartBadgeStyles } from "../utils/cartBadgeUtils";

interface CartBadgeProps extends BoxProps {
  count?: number | null;
  children: React.ReactNode;
}

export const CartBadge: React.FC<CartBadgeProps> = ({
  count,
  children,
  sx,
  ...props
}) => {
  const badge = getCartBadgeValue(count);
  const badgeStyles = getCartBadgeStyles();

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        ...sx,
      }}
      {...props}
    >
      {children}
      {badge && <Box sx={badgeStyles}>{badge}</Box>}
    </Box>
  );
};

export default CartBadge;
