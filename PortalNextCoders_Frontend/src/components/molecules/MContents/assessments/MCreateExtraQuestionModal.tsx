import { useEffect, useState } from "react";
import {
    Modal,
    Box,
    Button,
    TextField,
    Grid,
    IconButton,
    Tooltip,
    Checkbox,
} from "@mui/material";
import MLoading from "../../MLoading";
import { CreateAnswerDto, CreateQuestionDto } from "../../../../interfaces/courses/requests/CreatesDto";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";

interface CreateQuestionModalProps {
    assessmentId: number;
    isOpen: boolean;
    onClose: () => void;
    onCreate: (formData: CreateQuestionDto) => void;
    loading: boolean;
}

export function MCreateExtraQuestionModal({
                                         assessmentId,
                                         isOpen,
                                         onClose,
                                         onCreate,
                                         loading,
                                     }: CreateQuestionModalProps) {
    const [formData, setFormData] = useState<CreateQuestionDto>({
        assessmentId: assessmentId,
        text: "",
        answers: [
        ],
        createdAt: null,
        createdBy: "",
        updatedAt: null,
        updatedBy: "",
        deletedAt: null,
        deletedBy: "",
        isDeleted: null,
    });

    const [minAnswersSelected, setMinAnswersSelected] = useState(false);
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);

    useEffect(() => {
        if (isOpen) {
            setFormData({
                assessmentId: assessmentId,
                text: "",
                answers: [
                ],
                createdAt: null,
                createdBy: "",
                updatedAt: null,
                updatedBy: "",
                deletedAt: null,
                deletedBy: "",
                isDeleted: null,
            });
            setSelectedAnswerIndex(null); // Certifique-se de redefinir isso também
        }
    }, [isOpen, assessmentId]);

    const handleCreateQuestion = () => {
        if (formData.answers.length < 1 || formData.answers.every((answer) => !answer.text)) {
            alert("É necessário ter pelo menos uma resposta.");
            return;
        }

        const correctAnswersCount = formData.answers.filter((answer) => answer.isCorrect).length;
        if (correctAnswersCount !== 1) {
            alert("Selecione exatamente uma resposta como correta.");
            return;
        }

        onCreate(formData);
    };

    const handleAddAnswer = () => {
        setFormData({
            ...formData,
            answers: [
                ...formData.answers,
                {
                    questionId: null,
                    text: "",
                    isCorrect: false,
                    createdAt: null,
                    createdBy: "",
                    updatedAt: null,
                    updatedBy: "",
                    deletedAt: null,
                    deletedBy: "",
                    isDeleted: null,
                },
            ],
        });
    };

    const handleAnswerChange = (index: number, answer: CreateAnswerDto) => {
        const updatedAnswers = [...formData.answers];
        updatedAnswers[index] = answer;
        setFormData({ ...formData, answers: updatedAnswers });
    };

    const handleRemoveAnswer = (index: number) => {
        const updatedAnswers = [...formData.answers];
        updatedAnswers.splice(index, 1);
        setFormData({ ...formData, answers: updatedAnswers });
    };

    const handleAnswerIsCorrectChange = (index: number, isCorrect: boolean) => {
        const updatedAnswers = [...formData.answers];
        updatedAnswers.forEach((answer, i) => {
            if (i !== index) {
                updatedAnswers[i] = { ...answer, isCorrect: false };
            } else {
                updatedAnswers[i] = { ...answer, isCorrect };
            }
        });
        setFormData({ ...formData, answers: updatedAnswers });

        // Verifique se pelo menos uma checkbox está selecionada
        const atLeastOneCorrect = updatedAnswers.some((answer) => answer.isCorrect);
        setMinAnswersSelected(atLeastOneCorrect);
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
                <h2 style={{ marginBottom: "16px" }}>Criar Questão</h2>
                {loading ? (
                    <MLoading />
                ) : (
                    <form>
                        <TextField
                            label="Texto da Questão"
                            fullWidth
                            required
                            value={formData.text}
                            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                            sx={{ marginBottom: 2 }}
                        />

                        {formData.answers.map((answer, index) => (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: "8px",
                                }}
                            >
                                <Checkbox
                                    checked={answer.isCorrect}
                                    onChange={(e) =>
                                        handleAnswerIsCorrectChange(index, e.target.checked)
                                    }
                                />
                                <TextField
                                    label={`Resposta ${index + 1}`}
                                    fullWidth
                                    required
                                    value={answer.text}
                                    onChange={(e) => handleAnswerChange(index, { ...answer, text: e.target.value })}
                                    sx={{ marginLeft: "8px" }}
                                />
                                <Tooltip title="Remover Resposta">
                                    <IconButton
                                        onClick={() => handleRemoveAnswer(index)}
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        ))}

                        <Tooltip title="Adicionar Resposta">
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <IconButton onClick={handleAddAnswer} color="primary">
                                    <AddCircleIcon />
                                </IconButton>
                            </div>
                        </Tooltip>

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
                                        handleCreateQuestion();
                                    }}
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    fullWidth
                                    disabled={!minAnswersSelected}
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
