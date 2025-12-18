import {
  Box,
  Button,
  Grid,
  Modal,
  TextField,
  Typography
} from "@mui/material";
import { PageHeader } from "../../pages/Candidate/styles";
import { useEffect, useState } from "react";
import { Trail } from "../../../interfaces/courses/responses/Course";
import MLoading from "../../molecules/MLoading";
import { CreateTrailDto } from "../../../interfaces/courses/requests/CreatesDto";
import trailService from "../../../services/api/classes/trail.service";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { MCreateTrailModal } from "../../molecules/MContents/trail/MCreateTrailModal";
import { OTrail } from "../../organisms/OContents/OTrail";
import { useCourse } from "../../../context/CourseProvider/CourseProvider";
import MSnackbar from "../../molecules/Shared/MSnackBar";

function TTrails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [courseId, setCourseId] = useState<number>(id !== undefined ? Number.parseInt(id) : 0);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const [trails, setTrails] = useState<Trail[]>([]);
  const [quantity, setQuantity] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);    
  const { course } = useCourse();

  const findTrails = async () => {
    setLoading(true)
    try {
      const dataTrails = await trailService.GetAllByCourse(courseId);
      setQuantity(dataTrails.length);
      setTrails(dataTrails);
    }
    catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
    finally {
      setLoading(false);
    }
  }

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

  const handleDeleteTrail = async (currentTrail: Trail) => {
    setLoadingModal(true);
    try {
      await trailService.Delete(currentTrail.trailId);

      handleSuccessOpen();

      setTrails((prevTrails) =>
        prevTrails.filter((trail) => trail.trailId !== currentTrail.trailId)
      );      
      
    } catch (error) {
      console.error('Erro ao excluir o curso:', error);
      handleErrorOpen();
    } finally {
      setLoadingModal(false);
    }
  };    

  useEffect(() => {
    findTrails();
  }, []);

  const handleBackClick = () => {
    navigate("/courses");
  };

  const handleCreateTrail = async (creatTrail: CreateTrailDto) => {
    setLoadingModal(true)
    try {
      const newTrail = await trailService.Create(creatTrail);
      setTrails((prevClasses) => [...(prevClasses || []), newTrail]);
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
              Módulos da Trilha
            </Typography>
            <Typography variant="h1" align="center">
              {course?.name}
            </Typography>            
          </Grid>
        </Grid>
      </PageHeader>

      <Box display="flex" justifyContent="flex-end"> 
        <Button variant="contained" onClick={handleModalOpen}>
          Criar Módulo
        </Button>
      </Box>      

      <MCreateTrailModal
        courseId={courseId}
        orderNumber={quantity}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onCreate={handleCreateTrail}
        loading={loadingModal}
      />

      {loading ? <MLoading /> :
        <Box marginTop={2}>
          {trails?.map((trail, subModuleIndex) => {

            return (
              <OTrail 
                key={trail.trailId}
                trail={trail}
                onConfirm={()=>handleDeleteTrail(trail)}
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
          message="Não foi possível realizar a exclusão, provavelmente devido às aulas vinculadas"
        />      

    </Box>
  );
}

export default TTrails;
