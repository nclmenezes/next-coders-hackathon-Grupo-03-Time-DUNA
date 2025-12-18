import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  Grid,
} from "@mui/material";
import { CreateCourseDto } from "../../../../interfaces/courses/requests/CreatesDto";
import MLoading from "../../MLoading";


interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: CreateCourseDto) => void;
  loading: boolean;
}

export function MCreateCourseModal({
  isOpen,
  onClose,
  onCreate,
  loading,
}: CreateCourseModalProps) {
  const [formData, setFormData] = useState<CreateCourseDto>({
    name: "",
    description: "",
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
        name: "",
        description: "",
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
    
  const handleCreateCourse = () => {
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
        <h2 style={{ marginBottom: '16px' }}>Criar Trilha</h2>
        {loading ? (
          <MLoading />
        ) : (
          <form>
            <TextField
              label="Nome da trilha"
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
                    handleCreateCourse();
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
