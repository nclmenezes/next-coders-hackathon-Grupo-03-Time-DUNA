import StudentExamService from "../../../services/api/student/studentExam.service";
import {useAuth} from "../../../context/AuthProvider/useAuth";
import React, {useEffect, useState} from "react";
import ConfirmationDialog from "../../atoms/ConfirmationDialog";
import {Box} from "@mui/system";
import MExamTitle from "../../molecules/MExam/MExamTitle";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WarningIcon from '@mui/icons-material/Warning';
import MExamInfo from "../../molecules/MExam/MExamInfo";
import {useNavigate} from "react-router";
import Button from "../../atoms/Button";
import MLoading from "../../molecules/MLoading";

interface OExamInfoProps {
    examStarted: boolean,
    setExamStarted: (param?: any) => void,
    examManagement?: any
}

const OExamInfo = ({examStarted, setExamStarted, examManagement}: OExamInfoProps) => {
    const {user} = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [timeExam, setTimeExam] = useState('');
    const [confirmationOpen, setConfirmationOpen] = useState(false);

    const fetchData = async () => {
        await StudentExamService.GetExamData()
            .then(res => res)
            .then(data => {
                setTotalQuestions(data.examQuestions.length);
                let examTime = data.timeLimit;
                let timeExamLimit = '';
                let hours = Math.floor(examTime / 60);
                if (hours > 1) timeExamLimit += (hours + ' horas');
                else if (hours === 1) timeExamLimit += (hours + ' hora');
                let minutes = Math.round(examTime % 60);
                if (hours !== 0 && minutes !== 0) timeExamLimit += ' e ';
                if (minutes > 1) timeExamLimit += (minutes + ' minutos');
                else if (minutes === 1) timeExamLimit += (minutes + ' minuto');
                setTimeExam(timeExamLimit);
            });
    };

    useEffect(() => {
        fetchData();
    }, [])

    const handleConfirm = async () => {
        examStart();
        setConfirmationOpen(false);
    };

    const examStart = async () => {
        if (examManagement === undefined) {
            setIsLoading(true);
            const status = await StudentExamService.CreateExam(user?.id ?? 0);
            if (status !== 200) {
                console.error('Error: ', status);
                navigate('/');
            }
            setIsLoading(false);
            navigate('/profile/aptitude-test/student');
        }
        setExamStarted(!examStarted);
        navigate('/profile/aptitude-test/student');
    }

    return (

        isLoading ? <MLoading/> :
            <Box>
                <ConfirmationDialog
                    open={confirmationOpen}
                    onClose={() => setConfirmationOpen(false)}
                    onConfirm={handleConfirm}
                    message={`Atenção: O Teste tem duração máxima de ${timeExam}, após iniciado não é possível pausar, certifique-se que está em um ambiente tranquilo e com tempo suficiente para concluir.\n\nDeseja fazer o teste agora?`}
                />
                <Box sx={{marginBottom: '25px'}}>
                    <MExamTitle title="Teste de Aptidão"
                                subtitle={<> Seja bem-vindo(a)! Aqui você responderá ao teste de aptidão para completar
                                    a
                                    sua candidatura ao nosso processo seletivo. <br/> <b>Antes de iniciar é importante
                                        saber:</b></>}/>
                </Box>
                <Box sx={{
                    marginBottom: '30px'
                }}>
                    <Box sx={{marginBottom: '20px'}}>
                        <MExamInfo icon={<WarningIcon/>} text='Após início do teste, não é possível pausar.'/>
                    </Box>
                    <Box sx={{marginBottom: '20px'}}>
                        <MExamInfo icon={<WarningIcon/>} text='Faça pelo celular, tablet ou computador.'/>
                    </Box>
                    <Box sx={{marginBottom: '20px'}}>
                        <MExamInfo icon={<WarningIcon/>} text='Não saia da página durante a realização do teste.'/>
                    </Box>
                    <Box sx={{marginBottom: '20px'}}>
                        <MExamInfo icon={<AssignmentIcon/>} text='Quantidade de perguntas'
                                   quantity={totalQuestions.toString()}/>
                    </Box>
                    <Box sx={{marginBottom: '20px'}}>
                        <MExamInfo icon={<AccessTimeIcon/>} text='Tempo para o teste' quantity={timeExam}/>
                    </Box>
                </Box>
                <Button click={examStart} text={`${examManagement === undefined ? 'Iniciar' : 'Continuar'} Teste`}/>
            </Box>
    );
}

export default OExamInfo;