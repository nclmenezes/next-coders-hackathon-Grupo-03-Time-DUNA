import { Box, Button } from "@mui/material";
import { PageHeader } from "../../pages/Candidate/styles";
import { useEffect, useState } from "react";
import {ExtraCourse} from "../../../interfaces/courses/responses/Course";
import extraCourseService from "../../../services/api/classes/extraCourse.service";
import MLoading from "../../molecules/MLoading";
import { CreateCourseDto } from "../../../interfaces/courses/requests/CreatesDto";
import { MCreateCourseModal } from "../../molecules/MContents/course/MCreateCourseModal";
import MSnackbar from "../../molecules/Shared/MSnackBar";
import {OExtraCourse} from "../../organisms/OContents/OExtraCourse";

function TExtraCourses() {
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingModal, setLoadingModal] = useState<boolean>(false);
    const [courses, setCourses] = useState<ExtraCourse[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [isErrorOpen, setIsErrorOpen] = useState(false);

    const findClasses = async ()  =>{
        setLoading(true)
        try{
            const classes = await extraCourseService.GetAll();
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

    const handleDeleteCourse = async (currentCourse: ExtraCourse) => {
        setLoadingModal(true);
        try {
            await extraCourseService.Delete(currentCourse.extraCourseId);
            handleSuccessOpen();

            setCourses(prevCourses =>
                prevCourses.filter(course => course.extraCourseId !== currentCourse.extraCourseId)
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
            const newCourse = await extraCourseService.Create(createCourse);
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
                <h1>Cursos livres</h1>
            </PageHeader>


            <Box display="flex" justifyContent="flex-end">
                <Button variant="contained" onClick={handleModalOpen}>
                    Criar curso livres
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

                        const coursePath = `/extraCourses/${course.extraCourseId}`;

                        return (
                            <OExtraCourse
                                key={course.extraCourseId}
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

export default TExtraCourses;