import React from "react";
import MExamFinishedCard from "../../molecules/MExam/MExamFinishedCard";
import MExamTitle from "../../molecules/MExam/MExamTitle";
import {Box} from "@mui/system";
import DoneIcon from '@mui/icons-material/Done';

const OExamFinished = () => {
    return (
        <Box>
            <Box sx={{marginBottom: '25px'}}>
                <MExamTitle title="Teste de Aptidão" />
            </Box>
            <Box>
                <MExamFinishedCard icon={<DoneIcon fontSize="large" />} title="Parabéns, você concluiu o teste de aptidão!" subtitle={<><b>Fique atento ao seu e-mail!</b> Em breve, enviaremos informações sobre seu processo de aprendizagem.</>}/>
            </Box>
        </Box>
    )
}

export default OExamFinished;