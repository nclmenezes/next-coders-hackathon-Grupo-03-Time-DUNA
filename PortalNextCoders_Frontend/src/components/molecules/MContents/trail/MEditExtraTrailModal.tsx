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
import {ExtraTrail} from "../../../../interfaces/courses/responses/Course";
import MLoading from "../../MLoading";


interface EditExtraTrailModalProps {
    trail: ExtraTrail;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedTrail: Partial<ExtraTrail>) => void;
    loading: boolean;
}

export function MEditExtraTrailModal({
                                    trail,
                                    isOpen,
                                    onClose,
                                    onSave,
                                    loading,
                                }: EditExtraTrailModalProps) {
    const [editedTrail, setEditedTrail] = useState<Partial<ExtraTrail>>(trail);

    const handleSave = () => {
        onSave(editedTrail);
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
                <h2 style={{ marginBottom: '16px' }} >Editar Módulo</h2>
                {loading ? (
                    <MLoading />
                ) : (
                    <>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Nome"
                                    fullWidth
                                    value={editedTrail.name || ""}
                                    sx={{ marginBottom: 2 }}
                                    onChange={(e) =>
                                        setEditedTrail({ ...editedTrail, name: e.target.value })
                                    }
                                />
                                <TextField
                                    label="Descrição"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    value={editedTrail.description || ""}
                                    sx={{ marginBottom: 2 }}
                                    onChange={(e) =>
                                        setEditedTrail({
                                            ...editedTrail,
                                            description: e.target.value,
                                        })
                                    }
                                />
                                <Typography variant="subtitle1">Ativar/Desativar</Typography>
                                <Switch
                                    checked={editedTrail.isActive || false}
                                    onChange={(e) =>
                                        setEditedTrail({
                                            ...editedTrail,
                                            isActive: e.target.checked,
                                        })
                                    }
                                    color="primary"
                                />
                                <TextField
                                    label="Ordem do Módulo"
                                    fullWidth
                                    type="number" // Define o tipo como "number"
                                    value={editedTrail.orderNumber || ""}
                                    sx={{ marginBottom: 2 }}
                                    onChange={(e) => setEditedTrail({
                                        ...editedTrail,
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
                                    }}
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
