import {
    Box,
    Button,
    Grid,
    Typography
} from "@mui/material";
import {PageHeader} from "../../pages/Candidate/styles";
import {useEffect, useState} from "react";
import {ExtraContent} from "../../../interfaces/courses/responses/Course";
import MLoading from "../../molecules/MLoading";
import {CreateContentDto} from "../../../interfaces/courses/requests/CreatesDto";
import {useNavigate, useParams} from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import contentService from "../../../services/api/classes/extraContent.service";
import MSnackbar from "../../molecules/Shared/MSnackBar";
import moduleService from "../../../services/api/classes/extraModule.serivce";
import {OExtraContent} from "../../organisms/OContents/OExtraContent";
import {MCreateExtraContentModal} from "../../molecules/MContents/contents/MCreateExtraContentModal";
import {useExtraCourse} from "../../../context/ExtraCourseProvider/ExtraCourseProvider";

function TExtraContents() {
    const navigate = useNavigate();

    const {id} = useParams<{ id: string }>();
    const [courseId, setCourseId] =
        useState<number>(id !== undefined ? Number.parseInt(id) : 0);

    const {subModuleId} = useParams<{ subModuleId: string }>();
    const [subModulesId, _] =
        useState<number>(subModuleId !== undefined ? Number.parseInt(subModuleId) : 0);

    const [contentId, setContentId] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingModal, setLoadingModal] = useState<boolean>(false);
    const [contents, setContents] = useState<ExtraContent[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [moduleTypeId, setModuleTypeId] = useState(1);

    const {subModule} = useExtraCourse();

    const findContents = async (contentId: number) => {
        setLoading(true)
        try {
            if (contentId > 0)
                setContentId(contentId);

            const contents = await contentService.GetAllBySubModule(subModulesId);
            const module = await moduleService.Show(subModule?.extraModuleId || 0);
            setModuleTypeId(module.moduleTypeId);
            setContents(contents);
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        findContents(contentId);
    }, []);

    const handleBackClick = () => {
        navigate(`/extraCourses/${courseId}`);
    };

    const handleCreateContent = async (createContent: CreateContentDto) => {
        setLoadingModal(true)
        try {
            console.log(subModuleId);
            const newContent = await contentService.Create(createContent);
            setContents((prevContent) => [...(prevContent || []), newContent]);
            handleModalClose();
        } catch (error) {
            console.error('Error:', error);
            setLoadingModal(false);
        } finally {
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

    const handleDeleteContent = async (currentContent: ExtraContent) => {
        setLoadingModal(true);
        try {
            await contentService.Delete(currentContent);
            handleSuccessOpen();

            setContents((prevContents) =>
                prevContents.filter((content) => content.extraContentId !== currentContent.extraContentId)
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
                            startIcon={<ArrowBackIcon/>}
                        >
                            Voltar
                        </Button>
                    </Grid>
                    <Grid item xs={12} sx={{mt: 2}}>
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
                            cursor: isAddButtonDisabled ? "not-allowed" : "pointer",
                            opacity: isAddButtonDisabled ? 0.5 : 1,
                        }}>
                    Criar Conteúdo
                </Button>
            </Box>

            <MCreateExtraContentModal
                subModuleId={subModulesId}
                subModuleTypeId={subModule?.subModuleTypeId || 1}
                moduleTypeId={moduleTypeId}
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onCreate={handleCreateContent}
                loading={loadingModal}
            />

            {loading ? <MLoading/> :
                <Box marginTop={2}>
                    {contents?.map((content, subModuleIndex) => {
                        return (
                            <OExtraContent
                                key={content.extraContentId}
                                content={content}
                                onConfirm={() => handleDeleteContent(content)}
                                onSearch={findContents}
                                isOpen={content.extraContentId === contentId}
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

export default TExtraContents;
