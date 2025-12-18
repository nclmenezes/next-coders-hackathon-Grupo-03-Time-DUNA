import { Box, Button, Grid, Modal, Paper, Typography } from "@mui/material";

interface IPropsMModalConfirm {
  actionTitle: string;
  isModalOpen: boolean;
  onClose: () => void;
  onExecute: () => void;
}

export function MModalConfirm({ actionTitle, isModalOpen, onClose, onExecute }: IPropsMModalConfirm) {
  return (
    <Modal open={isModalOpen} onClose={onClose}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '16px',
        width: '20rem',
        height: '10rem',
        borderRadius: '10px',
      }}>
        <Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom:'2rem'
            }}
          >
            <Typography variant="h5">Confirmar Ação</Typography>
            <Typography>{actionTitle}</Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button variant="contained" onClick={onClose} fullWidth>
                Cancelar
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                onClick={onExecute}
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
              >
                Enviar
              </Button>
            </Grid>
          </Grid>  
        </Box>         
      </div>
    </Modal>
  );
}
