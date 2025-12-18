import {
  Box,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import { Module, Trail } from "../../../interfaces/courses/responses/Course";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {useState } from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { OModule } from "./OModule";
import trailService from "../../../services/api/classes/trail.service";
import { MEditTrailModal } from "../../molecules/MContents/trail/MEditTrailModal";
import { CreateModuleDto } from "../../../interfaces/courses/requests/CreatesDto";
import moduleService from "../../../services/api/classes/module.service";
import { MCreateModuleModal } from "../../molecules/MContents/module/MCreateModuleModal";
import { MDeleteConfirmationModal } from "../../molecules/Shared/MDeleteConfirmationModal";
import DeleteIcon from "@mui/icons-material/Delete";
import MSnackbar from "../../molecules/Shared/MSnackBar";

interface Props {
  key: React.Key;
  trail: Trail;
  onConfirm: () => void;
}

export function OTrail({ key, trail, onConfirm }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [currentTrail, setCurrentTrail] = useState<Trail>(trail);
  const [isCreateModuleModalOpen, setCreateModuleModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);  
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);   

  const formattedDate = currentTrail.createdAt
    ? new Date(currentTrail.createdAt).toLocaleDateString()
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

  const handleOpenCreateModuleModal = () => {
    setCreateModuleModalOpen(true);
  };
  
  const handleCloseCreateModuleModal = () => {
    setCreateModuleModalOpen(false);
  };  

  const handleEditIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleOpenEditModal();
  };

  const handleCreateModule = async (createModule: CreateModuleDto) => {
    setLoadingModal(true)
    try {
      const newModule = await moduleService.Create(createModule);
      setCurrentTrail((prevModule) => ({
        ...prevModule,
        modules: [...(prevModule.modules || []), newModule],
      }));
      handleCloseCreateModuleModal();
      setOpen(true);
    }
    catch (error) {
      console.error('Error:', error);
      setLoadingModal(false);
    }
    finally {
      setLoadingModal(false);
    }
  };

  const handleSaveEdit = async (updateTrail: Partial<Trail>) => {
    setLoadingModal(true);
    try {
      const updatedTrailData: Trail = {
        ...currentTrail,
        ...updateTrail, 
      };        

      await trailService.Update(updatedTrailData);
      setCurrentTrail(updatedTrailData);
      handleCloseEditModal();
    } catch (error) {
      console.error("Error:", error);
      setLoadingModal(false);
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
  
  const handleSuccessClose = () => {
    setIsSuccessOpen(false);
  };
  
  const handleErrorClose = () => {
    setIsErrorOpen(false);
  };  

  const handleSuccessOpen = () => {
    setIsSuccessOpen(true);
  };
  
  const handleErrorOpen = () => {
    setIsErrorOpen(true);
  };    

  const handleDeleteModule = async (currentModule: Module) => {
    setLoadingModal(true);
    try {
      await moduleService.Delete(currentModule.moduleId);

      setCurrentTrail((prevTrail) => ({
        ...prevTrail,
        modules: prevTrail.modules.filter(
          (module) => module.moduleId !== currentModule.moduleId
        ),
      }));   
  
      handleSuccessOpen();
    } catch (error) {
      console.error('Erro ao excluir o módulo:', error);
      // Exibindo a notificação de erro
      handleErrorOpen();
    } finally {
      setLoadingModal(false);
    }
  };
  
  const isButtonDisabled =
    currentTrail.modules && 
    currentTrail.modules.length > 0? true: false;  

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
            "&:hover": { bgcolor: "transparent" },
            borderRadius: 1,
          }}
        >
          <Box
            sx={{
              border: "4px solid #DDE2E5",
              borderRadius: "100%",
              p: 1.5,
              px: 1.5,
            }}
          >
            <p style={{ color: "#212429", fontFamily: "Inter", fontWeight: 600 }}>
              {currentTrail.orderNumber}
            </p>
          </Box>

          <Box sx={{ display: "block", pl: 2, width: "88.8%" }}>
          <ListItemText
            primary={currentTrail.name}
            secondary={
              <>
                Criado em: {formattedDate}
                <br />
                Status: {currentTrail.isActive ? <b>Ativo</b> : <b>Inativo</b>}
              </>
            }
            sx={{
              fontSize: "16px",
              color: "#212429",
              fontFamily: "Inter",
              fontWeight: "bold",
            }}
          />
          </Box>

          {open ? <ExpandLess color="primary" /> : <ExpandMore color="primary" />}
        </ListItemButton>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={handleOpenCreateModuleModal} sx={{ textAlign: "right" }}>
            <AddCircleIcon color="primary" />
          </IconButton>

          <MCreateModuleModal
            trailId={currentTrail.trailId}
            isOpen={isCreateModuleModalOpen}
            onClose={handleCloseCreateModuleModal}
            onCreate={handleCreateModule}
            loading={loadingModal}
          />

          <IconButton onClick={handleEditIconClick} 
            sx={{ cursor: "pointer" }}>
            <EditIcon color="primary" />
          </IconButton>

          <MEditTrailModal
            trail={trail}
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            onSave={handleSaveEdit}
            loading={loadingModal}
          />

          <IconButton
            onClick={handleDeleteIconClick}
            sx={{
              cursor: isButtonDisabled? "not-allowed":"pointer",
              opacity: isButtonDisabled ? 0.5 : 1,
            }}
            disabled={isButtonDisabled}
          >
            <DeleteIcon color="error" />
          </IconButton>


          <MDeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            onCancel={handleCloseDeleteModal}
            onConfirm={onConfirm}
            name="módulo"
          />
        </Box>
      </ListItem>
      <Collapse in={open}>      
        <List  component="div" disablePadding>
          {currentTrail.modules?.map((module) => (
            <OModule 
            key={module.moduleId}
            module={module}
            onConfirm={()=>handleDeleteModule(module)}
            />            
          ))}
        </List>
      </Collapse>   

      <MSnackbar
          open={isSuccessOpen}
          autoHideDuration={3000}
          onClose={handleSuccessClose}
          severity="success"
          message="A exclusão foi realizada com sucesso"
        />

        <MSnackbar
          open={isErrorOpen}
          autoHideDuration={3000}
          onClose={handleErrorClose}
          severity="error"
          message="Não foi possível realizar a exclusão, provavelmente devido às seções vinculadas"
        />           
    </Box>   
  );
}
