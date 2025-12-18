import {
  Box,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { useNavigate } from "react-router";
import { MEditSubModuleModal } from "../../molecules/MContents/subModule/MEditSubModuleModal";
import DeleteIcon from "@mui/icons-material/Delete";
import { MDeleteConfirmationModal } from "../../molecules/Shared/MDeleteConfirmationModal";
import submoduleService from "../../../services/api/classes/submodule.service";
import { SubModule } from "../../../interfaces/courses/responses/Course";
import { useCourse } from "../../../context/CourseProvider/CourseProvider";

interface props {
  key: React.Key;
  subModule: SubModule;
  to: string;
  onConfirm: () => void;
}

export function OSubModule({ key, subModule, to, onConfirm }: props) {
  const navigate = useNavigate();
  const [currentSubModule, setCurrentSubModule] = useState<SubModule>(subModule);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const { setSubModule } =
    useCourse();

  const formattedDate = currentSubModule.createdAt
    ? new Date(currentSubModule.createdAt).toLocaleDateString()
    : "";

  const handleClick = () => {
    setSubModule(subModule);
    navigate(to);
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

  const handleSaveEdit = async (updateSubModule: Partial<SubModule>) => {
    setLoadingModal(true)
    try {
      const updateSubModuleData: SubModule = {
        ...currentSubModule,
        ...updateSubModule, 
      };        

      await submoduleService.Update(updateSubModuleData);
      setCurrentSubModule(updateSubModuleData);      
      handleCloseEditModal();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingModal(false);
    }    
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
            marginLeft: 1,
            width: "100%",
            border: "1px solid #EBF0F3",
            my: 1,
            borderRadius: 1,
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            "&:hover": { bgcolor: "transparent" },
            alignItems: "center",
          }}
        >
          <Box>
            <ListItemText
              primary={"Seção " + currentSubModule.orderNumber + " - " + currentSubModule.name}
              secondary={
                <>
                  Criado em: {formattedDate}
                  <br />
                  Status: {currentSubModule.isActive ? <b>Ativo</b> : <b>Inativo</b>}
                  <br />
                  Tipo de Seção: {currentSubModule.subModuleTypeId === 1 ? <b>Normal</b> : <b>HandsOn</b>}
                </>
              }
              sx={{
                textAlign: "left",
                fontFamily: "Inter",
                fontWeight: 400,
              }}
            />
          </Box>
        </ListItemButton>    

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={handleEditIconClick}
            sx={{cursor: "pointer" }}
          >
            <EditIcon color="primary" />
          </IconButton>   

          <MEditSubModuleModal
            subModule={subModule}
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            onSave={handleSaveEdit}
            loading={loadingModal}
          />   

          <IconButton
            onClick={handleDeleteIconClick}
            sx={{ marginLeft: 2, textAlign: "right", cursor: "pointer" }}
          >
            <DeleteIcon color="error" />
          </IconButton>      

          <MDeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            onCancel={handleCloseDeleteModal}
            onConfirm={onConfirm}
            name="seção"
          />   
        </Box>                     
      </ListItem>
    </Box>
  );
}
