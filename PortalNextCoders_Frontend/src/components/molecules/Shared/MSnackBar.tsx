import React from "react";
import { Snackbar, Alert, SnackbarProps, AlertProps, SnackbarCloseReason } from "@mui/material";

interface MSnackbarProps {
  open: SnackbarProps["open"];
  autoHideDuration: number;
  onClose: () => void;
  severity: AlertProps["severity"];
  message: string;
}

function MSnackbar({
  open,
  autoHideDuration,
  onClose,
  severity,
  message,
}: MSnackbarProps) {
  return (
    <Snackbar open={open} autoHideDuration={autoHideDuration} onClose={onClose}>
      <Alert severity={severity} onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default MSnackbar;
