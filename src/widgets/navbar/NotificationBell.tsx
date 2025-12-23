import React, { useState } from "react";
import {
  IconButton,
  Popper,
  ClickAwayListener,
  Fade,
  Box,
} from "@mui/material";
import { NotificationsOutlined } from "@mui/icons-material";
import { useNotifications } from "../../shared/hooks/useNotifications";
import CartBadge from "../../shared/components/CartBadge";
import NotificationPanel from "./NotificationPanel";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { unreadCount } = useNotifications();

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton
        onClick={handleToggle}
        sx={{
          color: open ? "primary.main" : "inherit",
        }}
      >
        <CartBadge count={unreadCount || undefined}>
          <NotificationsOutlined />
        </CartBadge>
      </IconButton>

      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
        transition
        sx={{ zIndex: 1300 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            <Box sx={{ mt: 1 }}>
              <ClickAwayListener onClickAway={handleClose}>
                <div>
                  <NotificationPanel onClose={handleClose} />
                </div>
              </ClickAwayListener>
            </Box>
          </Fade>
        )}
      </Popper>
    </>
  );
}
