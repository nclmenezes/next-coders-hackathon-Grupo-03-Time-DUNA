import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {dismissToast, showErrorToast, showInfoToast, showLoadingToast, showSuccessToast} from "../../../utils/toast";
import MExamQuestion from "../../molecules/MExam/MExamQuestion";
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import DoneIcon from '@mui/icons-material/Done';

import {Box} from "@mui/system";
import {Button, Chip, Modal, Paper, Typography} from "@mui/material";
import StudentExamService, {
    ExamManagementResponse,
    ExamResponse
} from "../../../services/api/student/studentExam.service";
import MLoading from "../../molecules/MLoading";
import {useAuth} from "../../../context/AuthProvider/useAuth";

interface OExamOnBoardProps {
    examStarted: boolean,
    setExamStarted: (param?: any) => void
}

const ModalExamFinishedStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '0px',
    borderRadius: '3px',
    p: 4,
};


const OCandidateExam = () => {
    const {user} = useAuth();
    const [dateNow, setDateNow] = useState(0);
    const [exam, setExam] = useState<ExamResponse>();
    const [examHeader, setExamHeader] = useState<ExamManagementResponse>();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [timeLimitExceeded, setTimeLimitExceeded] = useState(false);
    const [openExamFinishedModal, setOpenExamFinishedModal] = useState(false);
    const handleOpenExamFinishedModal = () => setOpenExamFinishedModal(true);
    const handleCloseExamFinishedModal = () => setOpenExamFinishedModal(false);
    const [answeredQuestions, setAnsweredQuestions] = useState<any>([]);
    const [preventDouble, setPreventDouble] = useState(false);
    const [examLoaded, setExamLoaded] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [buttonClicked, setButtonClicked] = useState(false);
    const navigate = useNavigate();

    const fetchData = async () => {
        setPreventDouble(true);
        if (exam === undefined || preventDouble) {
            setPreventDouble(false);
            await getExam();
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (buttonClicked && currentQuestion + 1 < (exam?.examQuestions?.length ?? 0) && answeredQuestions.length >= currentQuestion + 1) {
            setCurrentQuestion(currentQuestion + 1);
            setButtonClicked(false);
            setButtonDisabled(false);
        } else if (buttonClicked && currentQuestion + 1 < (exam?.examQuestions?.length ?? 0) && answeredQuestions.length < currentQuestion + 1) {
            showInfoToast('Pergunta deve ser respondida para avançar', {duration: 1000});
        }
    }, [answeredQuestions, buttonClicked, currentQuestion, exam?.examQuestions?.length]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setDateNow(new Date().getTime())
        }, 1000);
        return () => clearInterval(intervalId);
    }, [dateNow])

    const getExamManagement = async () => await StudentExamService.GetStudentExamManagement(user?.id ?? 0).then(res => res).then(data => data);

    const examActive = async () => await StudentExamService.GetExamData().then(res => res).then(data => data);

    const getExam = async () => {
        await getExamManagement().then(async (data) => {
            if (data?.finishedAt !== null) {
                const toastExamFinishedId = showSuccessToast('Teste de aptidão finalizado');
                setTimeout(() => {
                    dismissToast(toastExamFinishedId);
                }, 2000)
            } else {
                setExamHeader(data);
                setAnsweredQuestions(data?.examManagments?.filter((em: { answerId?: number }) => em.answerId));
                await examActive().then((exam) => {
                    setExam(exam);
                    setExamLoaded(true);
                })
            }
        });
    };

    const nextQuestion = () => {
        setButtonDisabled(true);
        setButtonClicked(true);
    };

    const previousQuestion = () => {
        setCurrentQuestion(currentQuestion - 1);
    }

    const finishedExam = async () => {
        const toastId = showLoadingToast('Finalizando teste de aptidão...');
        let {status} = await StudentExamService.FinishExam(user?.id ?? 0);
        if (status === 200) {
            dismissToast(toastId);
            const toastSuccessId = showSuccessToast('Teste de aptidão enviado com sucesso');
            setTimeout(() => {
                dismissToast(toastSuccessId);
            }, 2000)
            navigate('/');
        } else {
            dismissToast(toastId);
            const toastFailedId = showErrorToast('Falha ao enviar teste de aptidão');
            setTimeout(() => {
                dismissToast(toastFailedId);
            }, 2000)
        }
    };

    const question = (q: any, k: any) => {
        return (
            <Box key={'question_' + k}>
                <MExamQuestion question={q} index={k} isActive={k == currentQuestion}
                               setAnsweredQuestions={setAnsweredQuestions} examHeaderId={examHeader?.examHeaderId}
                />
            </Box>
        );
    };

    const getTimer = () => {
        while (!timeLimitExceeded) {
            let milliseconds = new Date(examHeader?.endAt ?? '').getTime() - dateNow;
            if (milliseconds <= 0) {
                milliseconds = 0;
                setTimeLimitExceeded(true);
                const toastFailedId = showErrorToast('Seu teste de aptidão expirou');
                setTimeout(() => {
                    dismissToast(toastFailedId);
                }, 2000)
                navigate('/');
                
            }
            let seconds: number = Math.floor(milliseconds / 1000);
            let minutes: number = Math.floor(seconds / 60);
            let hours: number = Math.floor(minutes / 60);

            seconds %= 60;
            minutes %= 60;

            const formatHour: string = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            return formatHour;
        }


        return '00:00:00'
    }

    const getColorTimer = () => timeLimitExceeded ? 'red' : '#495057'

    return (
        <Box>
            {examLoaded ?
                (
                    <Box>
                        <Box>
                            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    height: '100%'
                                }}>
                                    <Typography variant="h5" sx={{
                                        fontFamily: 'Inter',
                                        fontWeight: '600',
                                        fontSize: '24px',
                                        lineHeight: '29px',
                                        color: '#212429'
                                    }}>
                                        Teste de Aptidão
                                    </Typography>
                                </Box>
                                <Box sx={{
                                    display: 'flex'
                                }}>
                                    <Paper sx={{
                                        width: '150px',
                                        height: '38px',
                                        backgroundColor: '#67A10F',
                                        borderRadius: '4px',
                                        boxShadow: 'none',
                                        marginLeft: '15px'
                                    }}>
                                        <Box sx={{
                                            display: 'flex',
                                            height: '100%',
                                            alignItems: 'center'
                                        }}>
                                            <Typography variant="overline" sx={{
                                                fontFamily: 'Inter',
                                                fontWeight: '600',
                                                fontSize: '14px',
                                                lineHeight: '17px',
                                                fontStyle: 'normal',
                                                color: '#FFFF',
                                                marginTop: '25px',
                                                display: 'table',
                                                margin: '0 auto',
                                            }}>
                                                Pergunta {currentQuestion + 1} / {exam?.examQuestions?.length}
                                            </Typography>
                                        </Box>
                                    </Paper>

                                    <Paper sx={{
                                        width: '100px',
                                        height: '38px',
                                        backgroundColor: '#DDE2E5',
                                        borderRadius: '4px',
                                        boxShadow: 'none',
                                        marginLeft: '25px'
                                    }}>
                                        <Box sx={{
                                            display: 'flex',
                                            height: '100%',
                                            alignItems: 'center'
                                        }}>
                                            <Typography variant="overline" sx={{
                                                fontFamily: 'Inter',
                                                fontWeight: '600',
                                                fontSize: '14px',
                                                lineHeight: '17px',
                                                fontStyle: 'normal',
                                                color: getColorTimer(),
                                                position: 'right',
                                                marginTop: '25px',
                                                display: 'table',
                                                margin: '0 auto'
                                            }}>
                                                {getTimer()}
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{
                            height: '70%'
                        }}>
                            {exam?.examQuestions?.map((q, index) => question(q, index))}
                        </Box>
                        <Box sx={{
                            display: 'flex', justifyContent: 'space-between', paddingTop: '20px'
                        }}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                            }}>
                                <Box display={currentQuestion === 0 ? 'none' : ''}>
                                    <Button onClick={previousQuestion}
                                            sx={{
                                                backgroundColor: '#F8F9FA',
                                                fontFamily: 'Inter',
                                                fontStyle: 'normal',
                                                fontWeight: '600',
                                                fontSize: '12px',
                                                lineHeight: '15px',
                                                alignItems: 'center',
                                                textAlign: 'center',
                                                color: '#2342C0',
                                                width: '206px',
                                                height: '42px',
                                                textTransform: 'none'
                                            }}>
                                        Voltar
                                    </Button>
                                </Box>
                                <Box>
                                    {currentQuestion !== (exam?.examQuestions?.length ?? 1) - 1 ?
                                        <Button onClick={nextQuestion} disabled={buttonDisabled} sx={{
                                            backgroundColor: '#2342C0',
                                            fontFamily: 'Inter',
                                            fontStyle: 'normal',
                                            fontWeight: '600',
                                            fontSize: '12px',
                                            lineHeight: '15px',
                                            alignItems: 'center',
                                            textAlign: 'center',
                                            color: '#fff',
                                            width: '206px',
                                            height: '42px',
                                            textTransform: 'none',
                                            marginLeft: '16px',
                                            '&:hover': {backgroundColor: '#2342C0'}
                                        }}>
                                            Próxima pergunta
                                        </Button> :
                                        <Box>
                                            <Button onClick={handleOpenExamFinishedModal} sx={{
                                                backgroundColor: '#2342C0',
                                                fontFamily: 'Inter',
                                                fontStyle: 'normal',
                                                fontWeight: '600',
                                                fontSize: '12px',
                                                lineHeight: '15px',
                                                alignItems: 'center',
                                                textAlign: 'center',
                                                color: '#fff',
                                                width: '206px',
                                                height: '42px',
                                                textTransform: 'none',
                                                marginLeft: '16px',
                                                '&:hover': {backgroundColor: '#2342C0'}
                                            }}>
                                                Finalizar teste de aptidão
                                            </Button>
                                            <Modal
                                                open={openExamFinishedModal}
                                                onClose={handleCloseExamFinishedModal}
                                                aria-labelledby="modal-modal-title"
                                                aria-describedby="modal-modal-description"
                                            >
                                                <Box sx={ModalExamFinishedStyle}>
                                                    <Box sx={{
                                                        textAlign: 'center'
                                                    }}> {answeredQuestions.length === exam?.examQuestions?.length ?
                                                        <Typography><SentimentSatisfiedAltIcon fontSize='large'
                                                                                               color='success'/></Typography>
                                                        :
                                                        <Typography><SentimentVeryDissatisfiedIcon fontSize='large'
                                                                                                   color='error'/></Typography>}
                                                    </Box>
                                                    <Box sx={{
                                                        textAlign: 'center'
                                                    }}>
                                                        <Typography id="modal-modal-title" variant="h5" component="h2">
                                                            Perguntas
                                                            respondidas {answeredQuestions.length}/{exam?.examQuestions?.length}
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        {answeredQuestions.length !== exam?.examQuestions?.length ?
                                                            <Box sx={{
                                                                textAlign: 'center'
                                                            }}>
                                                                <br/>
                                                                <Chip label="Responda as questões faltantes"
                                                                      color="error"
                                                                      onDelete={handleCloseExamFinishedModal}/>
                                                            </Box>
                                                            :
                                                            <Box sx={{
                                                                textAlign: 'center'
                                                            }}>
                                                                <Typography variant="subtitle2">Você respondeu todas as
                                                                    perguntas</Typography>
                                                                <br/>
                                                                <Typography variant="subtitle2">Clique em finalizar para
                                                                    enviar o teste de aptidão</Typography>
                                                                <br/>
                                                                <Box sx={{
                                                                    textAlign: 'center'
                                                                }}>
                                                                    <Chip
                                                                        label="Finalizar teste de aptidão"
                                                                        onClick={finishedExam}
                                                                        onDelete={finishedExam}
                                                                        color="success"
                                                                        deleteIcon={<DoneIcon/>}
                                                                    />
                                                                </Box>
                                                            </Box>
                                                        }
                                                    </Box>
                                                </Box>
                                            </Modal>
                                        </Box>
                                    }
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                ) : (
                    <MLoading/>
                )}
        </Box>
    );
};

export default OCandidateExam;
