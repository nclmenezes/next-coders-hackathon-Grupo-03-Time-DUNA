import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: any;
  message: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  message,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>[!] Confirmação</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm}>Sim</Button>
        <Button onClick={onClose}>Não</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
