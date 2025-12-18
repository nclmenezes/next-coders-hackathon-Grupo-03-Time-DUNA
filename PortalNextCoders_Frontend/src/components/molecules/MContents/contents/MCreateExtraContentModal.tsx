import React, { useEffect, useState } from "react";
import {
    Modal,
    Box,
    Button,
    TextField,
    Grid,
    MenuItem,
    
} from "@mui/material";
import { CreateExtraContentDto } from "../../../../interfaces/courses/requests/CreatesDto";
import MLoading from "../../MLoading";


interface CreateExtraContentModalProps {
    subModuleId: number;
    moduleTypeId: number;
    subModuleTypeId: number;
    isOpen: boolean;
    onClose: () => void;
    onCreate: (formData: CreateExtraContentDto) => void;
    loading: boolean;
}

function getContentTypes(subModuleTypeId: number, moduleTypeId: number) {
    if(moduleTypeId !== 1) {
        return [
            { id: 3, type: "Avaliação" },
        ];
    }

    if (subModuleTypeId === 2) {
        return [
            { id: 1, type: "Video" },
        ];
    }

    return [
        { id: 1, type: "Video" },
        { id: 3, type: "Avaliação" },
        { id: 4, type: "Artigo" },
    ];
}

export function MCreateExtraContentModal({
                                        subModuleId,
                                        moduleTypeId,
                                        subModuleTypeId,
                                        isOpen,
                                        onClose,
                                        onCreate,
                                        loading,
                                    }: CreateExtraContentModalProps) {
    const [formData, setFormData] = useState<CreateExtraContentDto>({
        subModuleId: subModuleId,
        contentTypeId: 1,
        name: "",
        description: "",
        link: "",
        linkDescription: "",
        duration: 10,
        orderNumber: 0,
        isAssessment: false,
        limitQuestions: 5,
        createdAt: null,
        createdBy: "",
        updatedAt: null,
        updatedBy: "",
        deletedAt: null,
        deletedBy: "",
        isDeleted: null,
    });



    const contentTypes = getContentTypes(subModuleTypeId, moduleTypeId);

    useEffect(() => {
        if (isOpen) {
            setFormData({
                subModuleId: subModuleId,
                contentTypeId: 1,
                name: "",
                description: "",
                link: "",
                linkDescription: "",
                duration: 10,
                orderNumber: 0,
                isAssessment: false,
                limitQuestions: 5,
                createdAt: null,
                createdBy: "",
                updatedAt: null,
                updatedBy: "",
                deletedAt: null,
                deletedBy: "",
                isDeleted: null,
            });
        }
    }, [isOpen, subModuleId]);

    const handleCreateContent = () => {
        if (formData.contentTypeId === 3) {
            formData.isAssessment = true;
        } else {
            formData.isAssessment = false;
            formData.limitQuestions = 0;
        }

        onCreate(formData);
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
                <h2 style={{ marginBottom: "16px" }}>Criar Conteúdo</h2>
                {loading ? (
                    <MLoading />
                ) : (
                    <form>
                        <TextField
                            label="Tipo de Conteúdo"
                            select
                            fullWidth
                            required
                            value={formData.contentTypeId}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    contentTypeId: parseInt(e.target.value, 10),
                                })
                            }
                            sx={{ marginBottom: 2 }}
                        >
                            {contentTypes.map((type) => (
                                <MenuItem key={type.id} value={type.id}>
                                    {type.type}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Nome do Conteúdo"
                            fullWidth
                            required
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            sx={{ marginBottom: 2 }}
                        />

                        {formData.contentTypeId !== 3 ? (
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
                        ) : null}

                        {formData.contentTypeId !== 3 ? (
                            <TextField
                                label="Link"
                                fullWidth
                                value={formData.link}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        link: e.target.value,
                                    })
                                }
                                sx={{ marginBottom: 2 }}
                            />
                        ) : null}

                        {formData.contentTypeId === 4 ? (
                            <>
                                <TextField
                                    label="Nome do artigo"
                                    fullWidth
                                    value={formData.linkDescription}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            linkDescription: e.target.value,
                                        })
                                    }
                                    sx={{ marginBottom: 2 }}
                                />
                            </>

                        ): null}

                        <TextField
                            label="Ordem do Conteúdo"
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
                                        handleCreateContent();
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
