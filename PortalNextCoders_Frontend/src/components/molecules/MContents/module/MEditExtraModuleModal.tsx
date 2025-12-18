import React, {useState} from "react";
import {
    Modal,
    Box,
    Button,
    TextField,
    Grid,
    Typography,
    Switch,
} from "@mui/material";
import {ExtraModule, Module} from "../../../../interfaces/courses/responses/Course";
import MLoading from "../../MLoading";


interface EditExtraModuleModalProps {
    module: ExtraModule;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedTrail: Partial<ExtraModule>) => void;
    loading: boolean;
}

export function MEditExtraModuleModal({
                                     module,
                                     isOpen,
                                     onClose,
                                     onSave,
                                     loading,
                                 }: EditExtraModuleModalProps) {
    const [editedModule, setEditedModule] = useState<Partial<ExtraModule>>(module);

    const handleSave = () => {
        onSave(editedModule);
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
                <h2 style={{marginBottom: '16px'}}>Editar Aula</h2>
                {loading ? (
                    <MLoading/>
                ) : (
                    <>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Nome"
                                    fullWidth
                                    value={editedModule.name || ""}
                                    sx={{marginBottom: 2}}
                                    onChange={(e) => setEditedModule({
                                        ...editedModule,
                                        name: e.target.value
                                    })}/>
                                <TextField
                                    label="Descrição"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    value={editedModule.description || ""}
                                    sx={{marginBottom: 2}}
                                    onChange={(e) => setEditedModule({
                                        ...editedModule,
                                        description: e.target.value,
                                    })}/>
                                <Typography variant="subtitle1">Ativar/Desativar</Typography>
                                <Switch
                                    checked={editedModule.isActive || false}
                                    onChange={(e) =>
                                        setEditedModule({
                                            ...editedModule,
                                            isActive: e.target.checked,
                                        })
                                    }
                                    color="primary"
                                />
                                <TextField
                                    label="Ordem da Aula"
                                    fullWidth
                                    type="number" // Define o tipo como "number"
                                    value={editedModule.orderNumber || ""}
                                    sx={{marginBottom: 2}}
                                    onChange={(e) => setEditedModule({
                                        ...editedModule,
                                        orderNumber: parseInt(e.target.value) || 0,
                                    })}/>
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
