import {
  Box,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText
} from "@mui/material";
import { useNavigate } from "react-router";
import { Course } from "../../../interfaces/courses/responses/Course";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import courseService from "../../../services/api/classes/course.service";
import { MEditCourseModal } from "../../molecules/MContents/course/MEditCourseModal";
import { useCourse } from "../../../context/CourseProvider/CourseProvider";
import DeleteIcon from "@mui/icons-material/Delete";
import { MDeleteConfirmationModal } from "../../molecules/Shared/MDeleteConfirmationModal";

interface props {
  key: React.Key;
  course: Course;
  to: string;
  onConfirm: () => void;
}

export function OCourse({ key, course, to, onConfirm }: props) {
  const [currentCourse, setCurrentCourse] = useState<Course>(course);
  const navigate = useNavigate();
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);


  const { setCourse } =
    useCourse();
    
  const handleClick = () => {
    setCourse(course);
    navigate(to);
  };

  const formattedDate = currentCourse.createdAt
    ? new Date(currentCourse.createdAt).toLocaleDateString()
    : "";

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
  

  const handleSaveEdit = async (updatedCourse: Partial<Course>) => {
    setLoadingModal(true)
    try{

      const updatedCourseData: Course = {
        ...currentCourse,
        ...updatedCourse, 
      };          

      await courseService.Update(updatedCourseData);
      setCurrentCourse(updatedCourseData);      
      handleCloseEditModal();
    }
    catch (error) {
      console.error('Error:', error);
      setLoadingModal(false);
    }
    finally{
      setLoadingModal(false);
    }    
  };  

  return (
    <ListItem disablePadding
    sx={{
      border: "1px solid #EBF0F3",
    }}
      >
      <ListItemButton
        {...({ onClick: handleClick })}
        sx={{
          marginLeft: 1,
          width: "100%",
          border: "1px solid #EBF0F3",
          my: 1,
          borderRadius: 1,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ListItemText
          primary={
            !currentCourse.description ? currentCourse.name :
            `${currentCourse.name} (${currentCourse.description})`
          }
          secondary={`Criado em: ${formattedDate}`}
          sx={{ textAlign: "left" }}
        />
      </ListItemButton>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton
          onClick={handleEditIconClick}
          sx={{ cursor: "pointer" }}
        >
          <EditIcon color="primary" />
        </IconButton>     

        <MEditCourseModal
          course={course}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleSaveEdit}
          loading={loadingModal}
        />

        <IconButton
          onClick={handleDeleteIconClick}
          sx={{ cursor: "pointer" }}
        >
          <DeleteIcon color="error" />
        </IconButton>      

        <MDeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onCancel={handleCloseDeleteModal}
          onConfirm={onConfirm}
          name="trilha"
        />  
      </Box>  

    </ListItem>
  );
}
