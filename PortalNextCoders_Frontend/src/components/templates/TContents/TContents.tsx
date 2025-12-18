import {
  Box,
  Button,
  Grid,
  Typography
} from "@mui/material";
import { PageHeader } from "../../pages/Candidate/styles";
import { useEffect, useState } from "react";
import { Content } from "../../../interfaces/courses/responses/Course";
import MLoading from "../../molecules/MLoading";
import { CreateContentDto } from "../../../interfaces/courses/requests/CreatesDto";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import contentService from "../../../services/api/classes/content.service";
import { OContent } from "../../organisms/OContents/OContent";
import { MCreateContentModal } from "../../molecules/MContents/contents/MCreateContentModal";
import { useCourse } from "../../../context/CourseProvider/CourseProvider";
import MSnackbar from "../../molecules/Shared/MSnackBar";
import moduleService from "../../../services/api/classes/module.service";

function TContents() {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const [courseId, setCourseId] = 
    useState<number>(id !== undefined ? Number.parseInt(id) : 0);

  const { subModuleId } = useParams<{ subModuleId: string }>();
  const [subModulesId, setSubModuleId] = 
      useState<number>(subModuleId !== undefined ? Number.parseInt(subModuleId) : 0);

  const [contentId, setContenId] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const [contents, setContents] = useState<Content[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);    
  const [moduleTypeId, setModuleTypeId] = useState(1);    

  const { subModule } = useCourse();

  const findContents = async (contentId: number) => {
    setLoading(true)
    try {
      if(contentId > 0)
        setContenId(contentId);

      const contents = await contentService.GetAllBySubModule(subModulesId);
      const module = await moduleService.Show(subModule?.moduleId || 0);
      setModuleTypeId(module.moduleTypeId);
      setContents(contents);
    }
    catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    findContents(contentId);
  }, []);

  const handleBackClick = () => {
    navigate(`/courses/${courseId}`);
  };

  const handleCreateContent = async (createContent: CreateContentDto) => {
    setLoadingModal(true)
    try {
      const newContent = await contentService.Create(createContent);
      setContents((prevContent) => [...(prevContent || []), newContent]);
      handleModalClose();
    }
    catch (error) {
      console.error('Error:', error);
      setLoadingModal(false);
    }
    finally {
      setLoadingModal(false);
    }
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
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

  const handleDeleteContent = async (currentContent: Content) => {
    setLoadingModal(true);
    try {
      await contentService.Delete(currentContent);
      handleSuccessOpen();

      setContents((prevContents) =>
        prevContents.filter((content) => content.contentId !== currentContent.contentId)
      ); 
      
    } catch (error) {
      console.error('Erro ao excluir o curso:', error);
      handleErrorOpen();
    } finally {
      setLoadingModal(false);
    }
  };      

  const isAddButtonDisabled = (moduleTypeId === 2 && contents.length > 0) || (subModule?.subModuleTypeId === 2 && contents.length > 0);

  return (
    <Box>
      <PageHeader>
        <Grid container alignItems="left">
          <Grid item xs={6}>
            <Button
              variant="contained"
              onClick={handleBackClick}
              startIcon={<ArrowBackIcon />}
            >
              Voltar
            </Button>
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="h1" align="center">
              Conteúdo da Seção
            </Typography>
            <Typography variant="h1" align="center">
              {subModule?.name}
            </Typography>               
          </Grid>
        </Grid>
      </PageHeader>

      <Box display="flex" justifyContent="flex-end"> 
        <Button disabled={isAddButtonDisabled} 
                variant="contained" 
                onClick={handleModalOpen}
                sx={{
                  cursor: isAddButtonDisabled? "not-allowed":"pointer",
                  opacity: isAddButtonDisabled ? 0.5 : 1,
                }}>
          Criar Conteúdo
        </Button>
      </Box>

      <MCreateContentModal
        subModuleId={subModulesId}
        subModuleTypeId ={subModule?.subModuleTypeId || 1}
        moduleTypeId={moduleTypeId}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onCreate={handleCreateContent}
        loading={loadingModal}
      />      

      {loading ? <MLoading /> :
        <Box marginTop={2}>
          {contents?.map((content, subModuleIndex) => {
            return (
              <OContent 
                key={content.contentId}
                content={content}
                onConfirm={()=>handleDeleteContent(content)}
                onSearch={findContents}
                isOpen={content.contentId === contentId} 
              />
            );
          })}
        </Box>
      }

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
          message="Não foi possível realizar a exclusão, provavelmente devido ele ter alguma avaliação vinculada"
        />       
    </Box>
  );
}

export default TContents;
