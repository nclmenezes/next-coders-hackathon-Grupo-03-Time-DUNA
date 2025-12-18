import MExamTitle from "../../molecules/MExam/MExamTitle";
import React from "react";
import {Box} from "@mui/system";
import {ErrorIcon} from "react-hot-toast";
import MExamExceededCard from "../../molecules/MExam/MExamExceededCard";

const OExamExceeded = () => {
    return (
        <Box>
            <Box sx={{marginBottom: '25px'}}>
                <MExamTitle title="Teste de Aptidão"/>
            </Box>
            <Box>
                <MExamExceededCard icon={<ErrorIcon/>} title="Seu tempo foi excedido" subtitle={<>
                    <b>Infelizmente </b> 
                    você excedeu o tempo limite do seu teste de aptidão, mas não desanime fique atento ao seu e-mail
                    para possíveis novidades.</>}/>
            </Box>
        </Box>
    )
}

export default OExamExceeded;