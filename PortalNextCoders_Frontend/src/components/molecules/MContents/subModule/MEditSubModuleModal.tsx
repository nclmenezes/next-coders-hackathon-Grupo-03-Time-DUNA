import React, { useState } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  Switch,
} from "@mui/material";
import {SubModule } from "../../../../interfaces/courses/responses/Course";
import MLoading from "../../MLoading";


interface EditSubModuleModalProps {
  subModule: SubModule;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedSubModule: Partial<SubModule>) => void;
  loading: boolean;
}

export function MEditSubModuleModal({
  subModule,
  isOpen,
  onClose,
  onSave,
  loading,
}: EditSubModuleModalProps) {
  const [editedSubModule, setEditedSubModule] = useState<Partial<SubModule>>(subModule);

  const handleSave = () => {
    onSave(editedSubModule);
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <h2 style={{ marginBottom: '16px' }} >Editar Seção</h2>
        {loading ? (
          <MLoading />
        ) : (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Nome"
                  fullWidth
                  value={editedSubModule.name || ""}
                  sx={{ marginBottom: 2 }}
                  onChange={(e) => setEditedSubModule({ 
                    ...editedSubModule, 
                    name: e.target.value 
                    })} />
                <TextField
                  label="Descrição"
                  fullWidth
                  multiline
                  rows={4}
                  value={editedSubModule.description || ""}
                  sx={{ marginBottom: 2 }}
                  onChange={(e) => setEditedSubModule({
                    ...editedSubModule,
                    description: e.target.value,
                  })} />
                <Typography variant="subtitle1">Ativar/Desativar</Typography>
                  <Switch
                    checked={editedSubModule.isActive || false}
                    onChange={(e) =>
                      setEditedSubModule({
                        ...editedSubModule,
                        isActive: e.target.checked,
                      })
                    }
                    color="primary"
                />                      
                <TextField
                  label="Ordem Seção"
                  fullWidth
                  type="number" // Define o tipo como "number"
                  value={editedSubModule.orderNumber || ""}
                  sx={{ marginBottom: 2 }}
                  onChange={(e) => setEditedSubModule({
                    ...editedSubModule,
                    orderNumber: parseInt(e.target.value) || 0,
                  })} />                  
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button variant="contained" onClick={onClose} fullWidth>
                  Cancelar
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    handleSave();
                  } }
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                >
                  Salvar
                </Button>
              </Grid>
            </Grid>
          </>            
        )}
      </Box>
    </Modal>
  );
}
