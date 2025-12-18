import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid"; // Importe o componente Grid do MUI

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  name: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function MDeleteConfirmationModal({
  isOpen,
  name,
  onCancel,
  onConfirm,
}: DeleteConfirmationModalProps) {
  return (
    <Modal open={isOpen} 
      onClose={onCancel}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          border: "10px solid #ccc", // Adicione uma borda ao redor do modal
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          textAlign: "center", // Centralize o conteúdo
        }}
      >
        <h2 style={{ marginBottom: "16px" }}>Confirmação de exclusão</h2>
        <p style={{ marginBottom: "16px" }} >Tem certeza de que deseja excluir, o {name}?</p>

        {/* Use o componente Grid para centralizar os botões horizontalmente */}
        <Grid container justifyContent="center" spacing={2}>
          <Grid item>
            <Button variant="contained" color="error" onClick={onCancel}>
              Cancelar
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={() => {
                onConfirm();
                onCancel();
              }}
            >
              Confirmar
            </Button>
          </Grid>          
        </Grid>
      </Box>
    </Modal>
  );
}
