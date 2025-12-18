import React, { useState, useEffect } from "react";
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
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Answer, Question } from "../../../../interfaces/courses/responses/Course";

interface EditQuestionModalProps {
  question: Question;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedQuestion: Question) => void;
  loading: boolean;
}

export function MEditQuestionModal({
  question,
  isOpen,
  onClose,
  onSave,
  loading,
}: EditQuestionModalProps) {
  const [editedQuestion, setEditedQuestion] = useState<Question>(question);
  const [minAnswersSelected, setMinAnswersSelected] = useState(false);
  const [isModified, setIsModified] = useState(false); // Estado para rastrear modificações
  const [isSaving, setIsSaving] = useState(false); // Estado de salvamento

  useEffect(() => {
    if (isOpen) {
      setEditedQuestion(question);
      setIsModified(false); // Redefina o estado modificado ao abrir
    }
  }, [isOpen, question]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(editedQuestion);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar a questão:", error);
    } finally {
      setIsSaving(false);
    }
  };
    
  
  const handleAddAnswer = () => {
    const newAnswer: Answer = {
      answerId: 0,
      questionId: editedQuestion.questionId,
      text: "",
      isCorrect: false,
      isActive: true,
      createdAt: null,
      createdBy: "",
      updatedAt: null,
      updatedBy: "",
      deletedAt: null,
      deletedBy: "",
      isDeleted: null,
    };

    const updatedAnswers = [...editedQuestion.answers, newAnswer];
    setEditedQuestion({ ...editedQuestion, answers: updatedAnswers });

    setIsModified(true); // Marque como modificado ao adicionar uma resposta
  };

  const handleAnswerChange = (index: number, updatedAnswer: Answer) => {
    const updatedAnswers = [...editedQuestion.answers];
    updatedAnswers[index] = updatedAnswer;
    setEditedQuestion({ ...editedQuestion, answers: updatedAnswers });

    setIsModified(true);
  };

  const handleRemoveAnswer = (index: number) => {
    const updatedAnswers = [...editedQuestion.answers];
    updatedAnswers.splice(index, 1);
    setEditedQuestion({ ...editedQuestion, answers: updatedAnswers });

    setIsModified(true);
  };

  const handleMarkAsDeleted = (index: number) => {
    const updatedAnswers = editedQuestion.answers.map((answer, i) => ({
      ...answer,
      isDeleted: i === index ? true : answer.isDeleted,
    }));
  
    setEditedQuestion({ ...editedQuestion, answers: updatedAnswers });
  
    setIsModified(true);
  };

  const handleAnswerIsCorrectChange = (index: number, isCorrect: boolean) => {
    const updatedAnswers = editedQuestion.answers.map((answer, i) => ({
      ...answer,
      isCorrect: i === index ? isCorrect : false,
    }));

    setEditedQuestion({ ...editedQuestion, answers: updatedAnswers });
    const atLeastOneCorrect = updatedAnswers.some((answer) => answer.isCorrect);
    setMinAnswersSelected(atLeastOneCorrect);

    setIsModified(true);
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
        <h2 style={{ marginBottom: "16px" }}>Editar Questão</h2>
        {loading || isSaving ? ( 
          <MLoading />
        ) : (
          <form>
            <TextField
              label="Texto da Questão"
              fullWidth
              required
              value={editedQuestion.text}
              onChange={(e) => {
                setEditedQuestion({ ...editedQuestion, text: e.target.value });
                setIsModified(true); 
              }}
              sx={{ marginBottom: 2 }}
            />

            {editedQuestion.answers
            .filter((answer) => answer.isDeleted === false || answer.isDeleted === null)
            .map((answer, index) => (
              <div
                key={answer.answerId}
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
                  onChange={(e) =>
                    handleAnswerChange(index, {
                      ...answer,
                      text: e.target.value,
                    })
                  }
                  sx={{ marginLeft: "8px" }}
                />
                <Tooltip title="Remover Resposta">
                  <IconButton
                    onClick={() =>
                      answer.answerId === 0
                        ? handleRemoveAnswer(index)
                        : handleMarkAsDeleted(index) // Marque como excluída se a resposta já existir
                    }
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </div>
            ))}

            <Tooltip title="Adicionar Resposta">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
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
                    handleSave();
                  }}
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  disabled={!isModified}
                >
                  Salvar
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Box>
    </Modal>
  );
}
