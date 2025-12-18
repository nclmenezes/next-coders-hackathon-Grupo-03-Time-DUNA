import {
  Checkbox,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import { Answer, Course, Module, SubModule, Trail } from "../../../interfaces/courses/responses/Course";
import { useState } from "react";
import { useNavigate } from "react-router";

interface props {
  answer: Answer;
}

export function OAnswer({ answer }: props) {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);  
  const [currentAnswer, setCurrentAnswer] = useState<Answer>(answer);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  
  const formattedDate = currentAnswer.createdAt
    ? new Date(currentAnswer.createdAt).toLocaleDateString()
    : "";

  const handleOpenEditModal = () => {
    setEditModalOpen(true);
  };
 

  return (
    <ListItem disablePadding
    sx={{
      border: "1px solid #EBF0F3",
    }}
      >
      <ListItemButton
        disableRipple
        sx={{
          marginLeft: 1,
          width: "100%",
          border: "1px solid #EBF0F3",
          my: 1,
          borderRadius: 1,
          cursor: "pointer",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          "&:hover": { bgcolor: "transparent" },
        }}
      >
        <ListItemIcon>
          <Checkbox checked={currentAnswer.isCorrect} />
        </ListItemIcon>
        <ListItemText
          primary={currentAnswer.text}
          secondary={`Criado em: ${formattedDate}`}
          sx={{ textAlign: "left" }}
        />
      </ListItemButton>
    </ListItem>
  );
}
