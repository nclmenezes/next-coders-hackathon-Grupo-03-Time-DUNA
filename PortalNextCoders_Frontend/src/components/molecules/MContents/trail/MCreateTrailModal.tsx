import { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  Grid,
} from "@mui/material";
import { CreateTrailDto } from "../../../../interfaces/courses/requests/CreatesDto";
import MLoading from "../../MLoading";


interface CreateTrailModalProps {
  courseId: number;
  orderNumber: number;
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: CreateTrailDto) => void;
  loading: boolean;
}

export function MCreateTrailModal({
  courseId,
  orderNumber,
  isOpen,
  onClose,
  onCreate,
  loading,
}: CreateTrailModalProps) {
  const [formData, setFormData] = useState<CreateTrailDto>({
    courseId: courseId,
    name: "",
    description: "",
    workload: 120,
    orderNumber: orderNumber,
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
        courseId: courseId,
        name: "",
        description: "",
        workload: 120,
        orderNumber: orderNumber,
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
        <h2 style={{ marginBottom: '16px' }}>Criar Módulo</h2>
        {loading ? (
          <MLoading />
        ) : (
          <form>
            <TextField
              label="Nome do Módulo"
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

            <TextField
              label="Ordem do Módulo"
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
