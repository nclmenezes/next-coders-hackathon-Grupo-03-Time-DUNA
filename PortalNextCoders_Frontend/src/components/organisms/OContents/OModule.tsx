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
import { Course, Module, SubModule } from "../../../interfaces/courses/responses/Course";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { UpdateOrDeleteModuleDto } from "../../../interfaces/courses/requests/UpdateOrDelete";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import moduleService from "../../../services/api/classes/module.service";
import { OSubModule } from "./OSubModule";
import { useParams } from "react-router-dom";
import { MEditModuleModal } from "../../molecules/MContents/module/MEditModuleModal";
import { MCreateSubModuleModal } from "../../molecules/MContents/subModule/MCreateSubModuleModal";
import { CreateSubModuleDto } from "../../../interfaces/courses/requests/CreatesDto";
import submoduleService from "../../../services/api/classes/submodule.service";
import MSnackbar from "../../molecules/Shared/MSnackBar";
import { MDeleteConfirmationModal } from "../../molecules/Shared/MDeleteConfirmationModal";
import DeleteIcon from "@mui/icons-material/Delete";

interface props {
  key: React.Key;
  module: Module;
  onConfirm: () => void;
}

export function OModule({key, module, onConfirm }: props) {
  const { id } = useParams<{ id: string }>();
  const [open, setOpen] = useState<boolean>(false);  
  const [currentModule, setCurrentModule] = useState<Module>(module);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [isCreateSubModuleModalOpen, setCreateSubModuleModalOpen] = useState(false);
  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);     
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);  

  
  const formattedDate = currentModule.createdAt
    ? new Date(currentModule.createdAt).toLocaleDateString()
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

  const handleOpenCreateSubModuleModal = () => {
    setCreateSubModuleModalOpen(true);
  };
  
  const handleCloseCreateSubModuleModal = () => {
    setCreateSubModuleModalOpen(false);
  };    

  const handleEditIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleOpenEditModal();
  };

  const handleCreateSubModule = async (createSubModule: CreateSubModuleDto) => {
    setLoadingModal(true)
    try {
      const newSubModule = await submoduleService.Create(createSubModule);
      setCurrentModule((prevModule) => ({
        ...prevModule,
        subModules: [...(prevModule.subModules || []), newSubModule],
      }));
      setOpen(true);
      handleCloseCreateSubModuleModal();
    }
    catch (error) {
      console.error('Error:', error);
      setLoadingModal(false);
    }
    finally {
      setLoadingModal(false);
    }
  };  

  const handleSaveEdit = async (updateModule: Partial<Module>) => {
    setLoadingModal(true)
    try{
      const updatedModuleData: Module = {
        ...currentModule,
        ...updateModule, 
      };          

      await moduleService.Update(updatedModuleData);
      setCurrentModule(updatedModuleData);      
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
  
  const handleDeleteSubModule = async (currentSubModule: SubModule) => {
    setLoadingModal(true);
    try {
      await submoduleService.Delete(currentSubModule.subModuleId);

      setCurrentModule((prevModule) => ({
        ...prevModule,
        subModules: prevModule.subModules.filter(
          (subModule) => subModule.subModuleId !== currentSubModule.subModuleId
        ),
      }));

      handleSuccessOpen();
    } catch (error) {
      console.error('Erro ao excluir o submódulo:', error);
      // Exibindo a notificação de erro
      handleErrorOpen();
    } finally {
      setLoadingModal(false);
    }
  };

  const isButtonDisabled =
    currentModule.subModules && currentModule.subModules.length > 0? true: false;

  const isAddButtonDisabled = currentModule.moduleTypeId === 2 && 
                              currentModule.subModules &&
                              currentModule.subModules.length > 0? true: false;

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
            "&:hover": { bgcolor: open === !false ? "#4263EB" : "transparent" },
            bgcolor: open === !false ? "#4263EB" : "",
            borderRadius: 1,
          }}
        >
          <Box sx={{ display: "block", pl: 2, width: "88.8%" }}>
            <ListItemText
              primary={currentModule.moduleTypeId === 1? 
                  "Aula " + currentModule.orderNumber+" - "+ currentModule.name : 
                  currentModule.orderNumber+" - "+ currentModule.name}
              secondary={
                <>
                  Criado em: {formattedDate}
                  <br />
                  Status: {currentModule.isActive ? <b>Ativo</b> : <b>Inativo</b>}
                  <br />
                  Tipo de Aula: {currentModule.moduleTypeId === 1 ? <b>Conteúdo</b> : <b>Prova</b>}                  
                </>
              }
              sx={{ color: open === !false ? "#F8F9FA" : "#495057",
              fontFamily: "Inter",
              fontWeight: 400,}}
            />
          </Box>       
          
          {open ? <ExpandLess color="secondary" /> : 
                  <ExpandMore color="primary" />}
        </ListItemButton>

        <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton disabled ={isAddButtonDisabled} 
                    onClick={handleOpenCreateSubModuleModal} 
                    sx={{ textAlign: "right",
                      cursor: isAddButtonDisabled? "not-allowed":"pointer",
                      opacity: isAddButtonDisabled ? 0.5 : 1,
                    }}>
          <AddCircleIcon color="primary" />
        </IconButton>

        <MCreateSubModuleModal
          moduleId={currentModule.moduleId}
          isOpen={isCreateSubModuleModalOpen}
          onClose={handleCloseCreateSubModuleModal}
          onCreate={handleCreateSubModule}
          loading={loadingModal}
        />

        <IconButton onClick={handleEditIconClick} sx={{ cursor: "pointer" }}>
          <EditIcon color="primary" />
        </IconButton>

        <MEditModuleModal
          module={module}
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
          name="aula"
        />
      </Box>    
      </ListItem>
              
      <Collapse in={open}>      
        <List  component="div" disablePadding>
          {currentModule.subModules?.map((subModule) => {

            var contentPath = `/courses/${id}/content/${subModule.subModuleId}`;

            return(
              <OSubModule 
              key={subModule.subModuleId}
              subModule={subModule}
              to = {contentPath}
              onConfirm={()=>handleDeleteSubModule(subModule)}
            />   
            )
          })}
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
          message="Não foi possível realizar a exclusão, provavelmente devido às conteudo vinculadas"
        />        
    </Box>
  );
}
