import React, { useState } from "react";
import {
  Box,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { OAnswer } from "./OAnswer";
import { MEditQuestionModal } from "../../molecules/MContents/assessments/MEditQuestionModal";
import { MDeleteConfirmationModal } from "../../molecules/Shared/MDeleteConfirmationModal";
import { Question } from "../../../interfaces/courses/responses/Course";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

interface OQuestionsProps {
  key: React.Key;
  question: Question;
  onConfirm: () => void;
  onEdit: (updatedQuestion: Question) => void;
  isOpen: boolean;
}

export function OQuestions({ key, question, onConfirm, onEdit, isOpen }: OQuestionsProps) {
  const [open, setOpen] = useState<boolean>(isOpen);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(question);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  const formattedDate = currentQuestion.createdAt
    ? new Date(currentQuestion.createdAt).toLocaleDateString()
    : "";

  const handleClick = () => {
    setOpen(!open);
  };

  const handleOpenEditModal = () => {
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  const handleEditIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleOpenEditModal();
  };

  const handleDeleteIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleOpenDeleteModal();
  };

  const handleOpenDeleteModal = () => {
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  return (
    <Box>
      <ListItem disablePadding sx={{ border: "1px solid #EBF0F3" }}>
        <ListItemButton
          disableRipple
          onClick={handleClick}
          sx={{
            display: "flex",
            borderBottom: "1px solid #EBF0F3",
            justifyContent: "space-between",
            "&:hover": { bgcolor: open ? "#4263EB" : "transparent" },
            bgcolor: open ? "#4263EB" : "",
            borderRadius: 1,
          }}
        >
          <Box sx={{ display: "block", pl: 2, width: "88.8%" }}>
            <ListItemText
              primary={currentQuestion.text}
              secondary={`Criado em: ${formattedDate}`}
              sx={{
                color: open ? "#F8F9FA" : "#495057",
                fontFamily: "Inter",
                fontWeight: 400,
              }}
            />
          </Box>

          {open ? (
            <ExpandLess color="secondary" />
          ) : (
            <ExpandMore color="primary" />
          )}
        </ListItemButton>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={handleEditIconClick} sx={{ cursor: "pointer" }}>
            <EditIcon color="primary" />
          </IconButton>

          <MEditQuestionModal
            question={currentQuestion}
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            onSave={onEdit}
            loading={loadingModal}
          />

          <IconButton onClick={handleDeleteIconClick} sx={{ cursor: "pointer" }}>
            <DeleteIcon color="error" />
          </IconButton>

          <MDeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            onCancel={handleCloseDeleteModal}
            onConfirm={onConfirm}
            name="questão"
          />
        </Box>
      </ListItem>

      <Collapse in={open}>
        <List component="div" disablePadding>
          {currentQuestion.answers?.map((answer) => (
            <OAnswer answer={answer} />
          ))}
        </List>
      </Collapse>
    </Box>
  );
}
