import {
    Box, Button
} from "@mui/material";
import {useNavigate} from "react-router";

function Reports() {
    {
        const navigate = useNavigate();
        const clickCandidateReport = () => {
            navigate('/reports/candidates');
        }

        const clickSurveyReport = () => {
            navigate('/reports/survey');
        }
        
        const clickAssessmentReport = () => {
            navigate('/reports/assessments');
        }
        
        return (
            <Box sx={{display: 'flex', flexDirection: 'column', width: 'auto', justifyContent: 'center', alignItems: 'center'}}>
                <Button
                    variant="contained"
                    sx={{minWidth: 100, bgcolor: "#679d12", margin: 1, width: '30%'}}
                    onClick={() => {
                        clickAssessmentReport();
                    }}
                >
                    Relatório de Alunos por turma
                </Button>
                <Button
                    variant="contained"
                    sx={{minWidth: 100, bgcolor: "#679d12", margin: 1, width: '30%'}}
                    onClick={() => {
                        clickCandidateReport();
                    }}
                >
                    Relatório de Candidatos
                </Button>
                <Button
                    variant="contained"
                    sx={{minWidth: 100, bgcolor: "#679d12", margin: 1, width: '30%'}}
                    onClick={() => {
                        clickSurveyReport();
                    }}
                >
                    Relatório de Pesquisas de Satisfação
                </Button>
            </Box>
        )
    }
}

export default Reports;
