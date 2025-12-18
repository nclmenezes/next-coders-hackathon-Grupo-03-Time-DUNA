import {
    Box,
    Button,
    Grid,
    Typography
} from "@mui/material";
import { PageHeader } from "../../pages/Candidate/styles";
import { useEffect, useState } from "react";
import {ExtraTrail} from "../../../interfaces/courses/responses/Course";
import MLoading from "../../molecules/MLoading";
import { CreateTrailDto } from "../../../interfaces/courses/requests/CreatesDto";
import trailService from "../../../services/api/classes/extraTrail.service";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { MCreateTrailModal } from "../../molecules/MContents/trail/MCreateTrailModal";
import MSnackbar from "../../molecules/Shared/MSnackBar";
import {OExtraTrail} from "../../organisms/OContents/OExtraTrail";
import {useExtraCourse} from "../../../context/ExtraCourseProvider/ExtraCourseProvider";

function TExtraTrails() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [courseId, setCourseId] = useState<number>(id !== undefined ? Number.parseInt(id) : 0);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingModal, setLoadingModal] = useState<boolean>(false);
    const [trails, setTrails] = useState<ExtraTrail[]>([]);
    const [quantity, setQuantity] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const { course } = useExtraCourse();

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

    const handleDeleteTrail = async (currentTrail: ExtraTrail) => {
        setLoadingModal(true);
        try {
            await trailService.Delete(currentTrail.extraTrailId);

            handleSuccessOpen();

            setTrails((prevTrails) =>
                prevTrails.filter((trail) => trail.extraTrailId !== currentTrail.extraTrailId)
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
        navigate("/extraCourses");
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
                            <OExtraTrail
                                key={trail.extraTrailId}
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

export default TExtraTrails;
