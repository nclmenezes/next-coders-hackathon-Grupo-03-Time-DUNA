import { useEffect, useState } from "react";
import {
    Modal,
    Box,
    Button,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import {
    CreateExtraModuleDto
} from "../../../../interfaces/courses/requests/CreatesDto";
import MLoading from "../../MLoading";


interface CreateExtraModuleModalProps {
    trailId: number;
    isOpen: boolean;
    onClose: () => void;
    onCreate: (formData: CreateExtraModuleDto) => void;
    loading: boolean;
}

export function MCreateExtraModuleModal({
                                       trailId,
                                       isOpen,
                                       onClose,
                                       onCreate,
                                       loading,
                                   }: CreateExtraModuleModalProps) {
    const [formData, setFormData] = useState<CreateExtraModuleDto>({
        extraTrailId: trailId,
        moduleTypeId: 1,
        name: "",
        description: "",
        workload: 120,
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
                extraTrailId: trailId,
                moduleTypeId: 1,
                name: "",
                description: "",
                workload: 120,
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
                <h2 style={{ marginBottom: '16px' }}>Criar Aula</h2>
                {loading ? (
                    <MLoading />
                ) : (
                    <form>
                        <TextField
                            label="Nome da Aula"
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

                        <FormControl fullWidth sx={{ marginBottom: 2 }}>
                            <InputLabel id="module-type-label">Tipo de Aula</InputLabel>
                            <Select
                                labelId="module-type-label"
                                id="module-type"
                                label="Tipo de Aula"
                                value={formData.moduleTypeId}
                                onChange={(e) =>
                                    setFormData({ ...formData, moduleTypeId: parseInt(e.target.value.toString()) || 1 })
                                }
                            >
                                <MenuItem value={1}>Conteúdo</MenuItem>
                                <MenuItem value={2}>Prova</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            label="Ordem da Aula"
                            fullWidth
                            type="number"
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
