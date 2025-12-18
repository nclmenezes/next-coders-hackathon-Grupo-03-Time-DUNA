import React, {useState} from "react";
import {
    Box,
    Collapse,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {ContentType, Question, ExtraContent}
    from "../../../interfaces/courses/responses/Course";
import contentService from "../../../services/api/classes/extraContent.service";
import questionService from "../../../services/api/classes/extraQuestion.service";
import {CreateQuestionDto}
    from "../../../interfaces/courses/requests/CreatesDto";
import MSnackbar from "../../molecules/Shared/MSnackBar";
import {MDeleteConfirmationModal}
    from "../../molecules/Shared/MDeleteConfirmationModal";
import {OQuestions} from "../OAssessments/OQuestions";
import {MEditExtraContentModal} from "../../molecules/MContents/contents/MEditExtraContentModal";
import {MCreateExtraQuestionModal} from "../../molecules/MContents/assessments/MCreateExtraQuestionModal";

const contentTypes: ContentType[] = [
    {id: 1, type: "Video"},
    {id: 3, type: "Avaliação"},
    {id: 4, type: "Artigo"},
];

interface Props {
    key: React.Key;
    content: ExtraContent;
    onConfirm: () => void;
    onSearch: (contentId: number) => void;
    isOpen: boolean;
}

export function OExtraContent({key, content, onConfirm, onSearch, isOpen}: Props) {
    const [questionId, setQuestionId] = useState<number>(0);
    const [open, setOpen] = useState<boolean>(isOpen);
    const [currentContent, setCurrentContent] = useState<ExtraContent>(content);
    const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
    const [isCreateQuestionModalOpen, setCreateQuestionModalOpen]
        = useState(false);
    const [loadingModal, setLoadingModal] = useState<boolean>(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [isErrorOpen, setIsErrorOpen] = useState(false);

    let thirdElement = null;

    if (content.contentTypeId === contentTypes[0].id) {
        thirdElement = <div>Video</div>;
    } else if (content.contentTypeId === contentTypes[1].id) {
        thirdElement = <div>Avaliação</div>;
    } else if (content.contentTypeId === contentTypes[2].id) {
        thirdElement = <div>Artigo</div>;
    }

    const handleClick = () => {
        if (currentContent.contentTypeId === 3) {
            setOpen(!open);
        }
    };

    const handleOpenEditModal = () => {
        setEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
    };

    const handleOpenCreateQuestionModal = () => {
        setCreateQuestionModalOpen(true);
    };

    const handleCloseCreateQuestionModal = () => {
        setCreateQuestionModalOpen(false);
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

    const handleDeleteQuestion = async (currentQuestion: Question) => {
        setLoadingModal(true);
        try {
            await questionService.Delete(currentQuestion.questionId);

            const updatedContent = {...currentContent};

            if (updatedContent.extraAssessment) {
                updatedContent.extraAssessment.questions = updatedContent.extraAssessment.questions.filter(
                    (question) => question.questionId !== currentQuestion.questionId
                );
            }

            setCurrentContent(updatedContent);
            handleSuccessOpen();
        } catch (error) {
            console.error("Erro ao excluir a questão:", error);
            handleErrorOpen();
        } finally {
            setLoadingModal(false);
        }
    };

    const createUpdateObjectWithQuestion = (prevContent: ExtraContent, newQuestion: Question) => {
        if (prevContent.extraAssessment) {
            const updatedAssessment = {
                ...prevContent.extraAssessment,
                questions: [...prevContent.extraAssessment.questions, newQuestion],
            };

            return {
                ...prevContent,
                assessment: updatedAssessment,
            };
        }
        return prevContent;
    };

    const handleCreateQuestion = async (createContent: CreateQuestionDto) => {
        setLoadingModal(true);

        try {
            const newQuestion = await questionService.Create(createContent);

            const updatedContent = createUpdateObjectWithQuestion(
                currentContent,
                newQuestion
            );

            setCurrentContent(updatedContent);

            setOpen(true);
            handleCloseCreateQuestionModal();
        } catch (error) {
            console.error("Erro:", error);
        } finally {
            setLoadingModal(false);
        }
    };

    const handleSaveEditQuestion = async (updateQuestion: Question) => {
        setLoadingModal(true);
        try {
            let contentId = currentContent.extraContentId || 0;
            let questionId = updateQuestion.questionId || 0;
            setQuestionId(questionId);
            await questionService.Update(updateQuestion);

            onSearch(contentId);
            handleSuccessOpen();
        } catch (error) {
            console.error("Erro:", error);
            handleErrorOpen();
        } finally {
            setLoadingModal(false);
        }
    };


    const handleSaveEdit = async (updateContent: Partial<ExtraContent>) => {
        setLoadingModal(true);
        try {
            const updateContentData: ExtraContent = {
                ...currentContent,
                ...updateContent,
            };

            await contentService.Update(updateContentData);

            setCurrentContent(updateContentData);
            handleCloseEditModal();
        } catch (error) {
            console.error("Erro:", error);
        } finally {
            setLoadingModal(false);
        }
    };

    const isButtonDisabled =
        !!(currentContent.extraAssessment &&
            currentContent.extraAssessment.questions &&
            currentContent.extraAssessment.questions.length > 0);

    return (
        <Box>
            <ListItem
                disablePadding
                sx={{
                    border: "1px solid #EBF0F3",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: currentContent.contentTypeId !== 3 ? "not-allowed" : "pointer",
                }}
            >
                <ListItemButton
                    disableRipple
                    onClick={handleClick}
                    sx={{
                        width: "100%",
                        borderRadius: 1,
                        cursor: "inherit",
                        display: "flex",
                        justifyContent: "space-between",
                        "&:hover": {bgcolor: "transparent"},
                        alignItems: "center",
                    }}
                >
                    <Box
                        sx={{
                            border: "4px solid #DDE2E5",
                            borderRadius: "100%",
                            p: 1.5,
                            px: 1.5,
                            marginRight: 2, // Adicionado margem à direita
                        }}
                    >
                        <p
                            style={{
                                color: "#212429",
                                fontFamily: "Inter",
                                fontWeight: 600,
                            }}
                        >
                            {currentContent.orderNumber}
                        </p>
                    </Box>

                    <ListItemText
                        primary={currentContent.name}
                        secondary={
                            <>
                                {thirdElement}
                                Status: {currentContent.isActive ? <b>Ativo</b> : <b>Inativo</b>}
                            </>
                        }
                        sx={{textAlign: "left", width: "100%"}}
                    />

                    {currentContent.contentTypeId === 3 ? (
                        open ? (
                            <ExpandLess color="primary"/>
                        ) : (
                            <ExpandMore color="primary"/>
                        )
                    ) : null}
                </ListItemButton>

                <Box sx={{display: "flex", alignItems: "center"}}>
                    {currentContent.contentTypeId === 3 ? (
                        <>
                            <IconButton
                                onClick={handleOpenCreateQuestionModal}
                                sx={{marginLeft: 2, textAlign: "right"}}
                            >
                                <AddCircleIcon color="primary"/>
                            </IconButton>

                            <MCreateExtraQuestionModal
                                assessmentId={currentContent.assessmentId || 0}
                                isOpen={isCreateQuestionModalOpen}
                                onClose={handleCloseCreateQuestionModal}
                                onCreate={handleCreateQuestion}
                                loading={loadingModal}
                            />
                        </>
                    ) : null}
                    <IconButton onClick={handleEditIconClick} sx={{cursor: "pointer"}}>
                        <EditIcon color="primary"/>
                    </IconButton>

                    <MEditExtraContentModal
                        content={content}
                        isOpen={isEditModalOpen}
                        onClose={handleCloseEditModal}
                        onSave={handleSaveEdit}
                        loading={loadingModal}
                    />

                    <IconButton
                        onClick={handleDeleteIconClick}
                        sx={{
                            cursor: isButtonDisabled ? "not-allowed" : "pointer",
                            opacity: isButtonDisabled ? 0.5 : 1,
                        }}
                        disabled={isButtonDisabled}
                    >
                        <DeleteIcon color="error"/>
                    </IconButton>

                    <MDeleteConfirmationModal
                        isOpen={isDeleteModalOpen}
                        onCancel={handleCloseDeleteModal}
                        onConfirm={onConfirm}
                        name="conteúdo"
                    />
                </Box>
            </ListItem>

            <Collapse in={open}>
                <List component="div" disablePadding>
                    {currentContent.extraAssessment?.questions?.map((question) => (
                        <OQuestions
                            key={question.questionId}
                            question={question}
                            onConfirm={() => handleDeleteQuestion(question)}
                            onEdit={handleSaveEditQuestion}
                            isOpen={question.questionId === questionId}
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
                message="Não foi possível realizar a exclusão, provavelmente devido às questões vinculadas ou o conteúdo já foi consumido por algum aluno"
            />
        </Box>
    );
}