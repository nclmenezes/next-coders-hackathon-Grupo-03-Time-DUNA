import { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  Grid,
  Select,
  MenuItem,
} from "@mui/material";
import { CreateSubModuleDto } from "../../../../interfaces/courses/requests/CreatesDto";
import MLoading from "../../MLoading";


interface CreateSubModuleModalProps {
  moduleId: number;
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: CreateSubModuleDto) => void;
  loading: boolean;
}

export function MCreateSubModuleModal({
  moduleId,
  isOpen,
  onClose,
  onCreate,
  loading,
}: CreateSubModuleModalProps) {
  const [formData, setFormData] = useState<CreateSubModuleDto>({
    moduleId: moduleId,
    name: "",
    subModuleTypeId: 1,
    description: "",
    orderNumber: 0,
    createdAt: null,
    createdBy: "",
    updatedAt: null,
    updatedBy: "",
    deletedAt: null,
    deletedBy: "",
    isDeleted: null,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        moduleId: moduleId,
        name: "",
        subModuleTypeId: 1,
        description: "",
        orderNumber: 0,
        createdAt: null,
        createdBy: "",
        updatedAt: null,
        updatedBy: "",
        deletedAt: null,
        deletedBy: "",
        isDeleted: null,
      });
    }
  }, [isOpen]);
    
  const handleCreateTrail = () => {
    onCreate(formData);
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <h2 style={{ marginBottom: '16px' }}>Criar Seção</h2>
        {loading ? (
          <MLoading />
        ) : (
          <form>
            <TextField
              label="Nome da Seção"
              fullWidth
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ marginBottom: 2 }}
            />

            <TextField
              label="Descrição"
              fullWidth
              multiline
              rows={4}
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              sx={{ marginBottom: 2 }}
            />

          <Select
            label="Tipo de Seção"
            fullWidth
            value={formData.subModuleTypeId}
            onChange={(e) =>
              setFormData({
                ...formData,
                subModuleTypeId: e.target.value as number,
              })
            }
            sx={{ marginBottom: 2 }}
          >
            <MenuItem value={1}>Normal</MenuItem>
            <MenuItem value={2}>HandsOn</MenuItem>
          </Select>

            <TextField
              label="Ordem da Seção"
              fullWidth
              type="number" // Define o tipo como "number"
              value={formData.orderNumber || ""}
              sx={{ marginBottom: 2 }}
              onChange={(e) => setFormData({
                ...formData,
                orderNumber: parseInt(e.target.value) || 0,
              })} />                 

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
                    handleCreateTrail();
                  }}
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                >
                  Criar
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Box>
    </Modal>
  );
}
