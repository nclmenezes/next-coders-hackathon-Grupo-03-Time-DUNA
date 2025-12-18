import React, { useState } from "react";
import {
    Modal,
    Box,
    Button,
    TextField,
    Grid,
    MenuItem,
    Typography,
    Switch,
} from "@mui/material";
import MLoading from "../../MLoading";
import { ExtraContent } from "../../../../interfaces/courses/responses/Course";

const contentTypes = [
    { id: 1, type: "Video" },
    { id: 3, type: "Avaliação" },
    { id: 4, type: "Artigo" },
];

interface EditExtraContentModalProps {
    content: ExtraContent;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedContent: Partial<ExtraContent>) => void;
    loading: boolean;
}

export function MEditExtraContentModal({
                                      content,
                                      isOpen,
                                      onClose,
                                      onSave,
                                      loading,
                                  }: EditExtraContentModalProps) {
    const [editedContent, setEditedContent] = useState<Partial<ExtraContent>>(content);

    const handleSave = () => {
        onSave(editedContent);
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
                <h2 style={{ marginBottom: '16px' }} >Editar Conteúdo</h2>
                {loading ? (
                    <MLoading />
                ) : (
                    <>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Tipo de Conteúdo"
                                    select
                                    fullWidth
                                    required
                                    value={editedContent.contentTypeId}
                                    onChange={(e) =>
                                        setEditedContent({
                                            ...editedContent,
                                            contentTypeId: parseInt(e.target.value, 10), // Converte para número
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
                                    label="Nome"
                                    fullWidth
                                    value={editedContent.name || ""}
                                    sx={{ marginBottom: 2 }}
                                    onChange={(e) => setEditedContent({
                                        ...editedContent,
                                        name: e.target.value
                                    })} />
                                {editedContent.contentTypeId !== 3 ? (
                                    <TextField
                                        label="Descrição"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        value={editedContent.description || ""}
                                        sx={{ marginBottom: 2 }}
                                        onChange={(e) => setEditedContent({
                                            ...editedContent,
                                            description: e.target.value,
                                        })} />
                                ) : null}

                                {editedContent.contentTypeId !== 3 ? (
                                    <TextField
                                        label="Link"
                                        fullWidth
                                        value={editedContent.link}
                                        onChange={(e) =>
                                            setEditedContent({
                                                ...editedContent,
                                                link: e.target.value,
                                            })
                                        }
                                        sx={{ marginBottom: 2 }}
                                    />
                                ) : null}

                                {editedContent.contentTypeId === 4 ? (
                                    <TextField
                                        label="Nome do artigo"
                                        fullWidth
                                        value={editedContent.linkDescription}
                                        onChange={(e) =>
                                            setEditedContent({
                                                ...editedContent,
                                                linkDescription: e.target.value,
                                            })
                                        }
                                        sx={{ marginBottom: 2 }}
                                    />
                                ): null}

                                <Typography variant="subtitle1">Ativar/Desativar</Typography>
                                <Switch
                                    checked={editedContent.isActive || false}
                                    onChange={(e) =>
                                        setEditedContent({
                                            ...editedContent,
                                            isActive: e.target.checked,
                                        })
                                    }
                                    color="primary"
                                />

                                <TextField
                                    label="Ordem do Conteudo"
                                    fullWidth
                                    type="number" // Define o tipo como "number"
                                    value={editedContent.orderNumber || ""}
                                    sx={{ marginBottom: 2 }}
                                    onChange={(e) => setEditedContent({
                                        ...editedContent,
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
