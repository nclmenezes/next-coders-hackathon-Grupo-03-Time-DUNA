import React, { useState } from "react";
import {
    Modal,
    Box,
    Button,
    TextField,
    Grid,
} from "@mui/material";
import {ExtraCourse} from "../../../../interfaces/courses/responses/Course";
import MLoading from "../../MLoading";


interface EditCourseModalProps {
    course: ExtraCourse;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedCourse: Partial<ExtraCourse>) => void;
    loading: boolean;
}

export function MEditExtraCourseModal({
                                     course,
                                     isOpen,
                                     onClose,
                                     onSave,
                                     loading,
                                 }: EditCourseModalProps) {
    const [editedCourse, setEditedCourse] = useState<Partial<ExtraCourse>>(course);

    const handleSave = () => {
        onSave(editedCourse);
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
                <h2 style={{ marginBottom: '16px' }} >Editar Trilha</h2>
                {loading ? (
                    <MLoading />
                ) : (
                    <><Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Nome"
                                fullWidth
                                value={editedCourse.name || ""}
                                sx={{ marginBottom: 2 }}
                                onChange={(e) => setEditedCourse({ ...editedCourse, name: e.target.value })} />
                            <TextField
                                label="Descrição"
                                fullWidth
                                multiline
                                rows={4}
                                value={editedCourse.description || ""}
                                sx={{ marginBottom: 2 }}
                                onChange={(e) => setEditedCourse({
                                    ...editedCourse,
                                    description: e.target.value,
                                })} />
                        </Grid>
                    </Grid><Grid container spacing={2}>
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
                    </Grid></>
                )}

            </Box>
        </Modal>
    );
}
