import { Alert, Box, Button, Snackbar } from "@mui/material";
import { PageHeader } from "../../pages/Candidate/styles";
import { useEffect, useState } from "react";
import { Course } from "../../../interfaces/courses/responses/Course";
import courseService from "../../../services/api/classes/course.service";
import MLoading from "../../molecules/MLoading";
import { CreateCourseDto } from "../../../interfaces/courses/requests/CreatesDto";
import { OCourse } from "../../organisms/OContents/OCourse";
import { MCreateCourseModal } from "../../molecules/MContents/course/MCreateCourseModal";
import MSnackbar from "../../molecules/Shared/MSnackBar";

function TCourses() {
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);  

  const findClasses = async ()  =>{
    setLoading(true)
    try{
      const classes = await courseService.GetAll();
      setCourses(classes);
    }
    catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
    finally{
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

  const handleDeleteCourse = async (currentCourse: Course) => {
    setLoadingModal(true);
    try {
      await courseService.Delete(currentCourse.courseId);
      handleSuccessOpen();

      setCourses(prevCourses =>
        prevCourses.filter(course => course.courseId !== currentCourse.courseId)
      ); 
        
    } catch (error) {
      console.error('Erro ao excluir o curso:', error);
      // Exibindo a notificação de erro
      handleErrorOpen();
    } finally {
      setLoadingModal(false);
    }
  };    

  useEffect(() => {
    findClasses();
  }, []);  

  const handleCreateCourse = async (createCourse: CreateCourseDto) => {
    setLoadingModal(true)
    try{
      const newCourse = await courseService.Create(createCourse);
      setCourses((prevClasses) => [...(prevClasses || []), newCourse]);
      handleModalClose();
    }
    catch (error) {
      console.error('Error:', error);
      setLoadingModal(false);
    }
    finally{
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
      <PageHeader
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>Trilhas de Formação</h1>
      </PageHeader>


      <Box display="flex" justifyContent="flex-end"> 
        <Button variant="contained" onClick={handleModalOpen}>
          Criar Trilha
        </Button>
      </Box>

      <MCreateCourseModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onCreate={handleCreateCourse}
        loading={loadingModal}
      />      

      {loading ? <MLoading/> :
        <Box marginTop={2}>
            {courses?.map((course) => {

              const coursePath = `/courses/${course.courseId}`;

              return (
                <OCourse
                  key={course.courseId}
                  course={course}
                  to={coursePath}
                  onConfirm={()=>handleDeleteCourse(course)}
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
          message="Não foi possível realizar a exclusão, provavelmente devido aos módulos vinculados"
        />
    </Box>
  );
}

export default TCourses;