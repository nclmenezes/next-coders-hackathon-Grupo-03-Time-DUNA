import { useEffect, useState } from 'react';
import {Box, Typography, Button, ListItemIcon } from '@mui/material';
import like from '../../../../assets/Training/class/Like.jpeg';
import Happy from '@mui/icons-material/SentimentSatisfiedAlt';
import Sad from '@mui/icons-material/SentimentVeryDissatisfied';
import { useNavigate } from 'react-router';
import { ResultQuestionDto } from '../../../../interfaces/StudentContents/Responses/Assessments';
import MLoading from '../../../molecules/MLoading';
import studentAssessmentService from '../../../../services/api/student/studentAssessment.service';
import studentExtraAssessmentService from '../../../../services/api/student/studentExtraAssessment.service';
import { OTrialDetail } from '../../OTrail/OTrialDetail';
import studentCourseService from '../../../../services/api/student/studentCourse.service';
import satisfactionService, { CheckStudentResponses } from '../../../../services/api/student/satisfaction.service';
import OSatisfaction from '../../OSatisfaction/OSatisfaction';

interface OResultAssessment {
    assessmentId: number;
    studentId: number;
    subModuleId: number;
    contentId: number;
    trailId : number;
};

function OResultAssessment({assessmentId, studentId, subModuleId, contentId, trailId}: OResultAssessment) {
  const navigate = useNavigate();
  const [resultQuestions, setResultQuestions] = useState<ResultQuestionDto>();
  const [loading, setLoading] = useState<boolean>(true);
  const [openModalTrial, setOpenModalTrial] = useState<boolean>(false);
  const [openSatisfaction, setOpenSatisfaction] = useState<boolean>(false);
  const [lastContent, setLastContent] = useState<boolean>(false);
  const [checkStudentResponsesCurrent, setCheckStudentResponsesCurrent] = useState<CheckStudentResponses>();

  const handleTrialOpen = () => {
    setOpenModalTrial(true);
  };

  const handleTrialClose = () => {
    setOpenModalTrial(false);
  };

  const findAnswers = async () => {
    setLoading(true);
    try {
      let result;
      // Lógica condicional para extra
      if (window.location.pathname.includes("extra")) {
        result = await studentExtraAssessmentService.GetStudentExtraAnswers(assessmentId, subModuleId);
      } else {
        result = await studentAssessmentService.GetStudentAnswers(assessmentId, subModuleId);
      }
      setResultQuestions(result);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const findLastContent = async () => {
    setLoading(true);
    try{
      var result = await  studentCourseService.GetLastContentByTrailId(trailId)
      const last = result == contentId ? true : false;

      const checkStudentResponses = await satisfactionService.getStudentResponses([trailId], studentId);
      setCheckStudentResponsesCurrent(checkStudentResponses[0]);      

      setLastContent(last);
    }
    catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
    finally{
      setLoading(false);
    }
  
  }

  const handleSatisfactionClose = () => {
    setOpenSatisfaction(false);
  }

  useEffect(() => {
    findAnswers();
    findLastContent();
  }, []);

  return (
    <Box 
    sx={{display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'}}>
      {loading ? (
        <MLoading />
      ) : (      
      <Box sx={{display: 'flex', flexDirection: 'column', width: '400px', height: '400px' ,borderRadius: 2, alignItems: 'center'}}>
        <Box id='congratulations' sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <ListItemIcon>
            <img src={like}/>
          </ListItemIcon>
          <Typography className="complete" sx={{fontFamily: 'Inter', fontWeight: 600, fontSize: '16px',}}>Parabéns! Você concluiu a avaliação da seção</Typography>
        </Box>

        <Box sx={{display: 'flex', gap: 2}}>
          <Box  sx={{display: 'flex',alignItems: 'center', justifyContent: 'center', borderRadius: 2, width: '190px', height: '45px',my: 2, textTransform: 'none', bgcolor: '#67A10F21','&:hover': { backgroundColor:  "#67A10F21" }, color: '#67A10F', fontWeight: 600, fontFamily: 'Inter'}}>
          <ListItemIcon>
            <Happy sx={{color: '#67A10F'}}/>
          </ListItemIcon>
          Acertos: <span style={{color: '#495057'}}>{ resultQuestions ? resultQuestions.correct : 'Carregando...'}</span>
          </Box>

          <Box  sx={{display: 'flex',alignItems: 'center', justifyContent: 'center', borderRadius: 2, width: '190px', height: '45px',my: 2, textTransform: 'none', bgcolor: '#ED27251A', '&:hover': { backgroundColor:  "#ED27251A" }, color: '#B71816', fontWeight: 600, fontFamily: 'Inter'}}>
          <ListItemIcon>
            <Sad sx={{color: '#B71816'}}/>
          </ListItemIcon>
            Erros: <span style={{color: '#495057'}}>{ resultQuestions ? resultQuestions.wrong : 'Carregando...'}</span>
          </Box>
        </Box>

        <Button variant="contained"  sx={{textTransform: 'none', height: '45px', bgcolor: '#4263EB', width: '100%' , }} onClick={() => navigate('/training')}>Voltar para home</Button>
        <Button 
          variant="contained"  
          sx={{textTransform: 'none', height: '45px', bgcolor: '#4263EB', width: '100%', marginTop: '1rem' , }} 
          disabled={!resultQuestions?.release}
          onClick={handleTrialOpen}>
            Visualizar Resultado
        </Button>

        {lastContent? (        
          <Button 
            variant="contained"  
            sx={{textTransform: 'none', height: '45px', bgcolor: '#4263EB', width: '100%', marginTop: '1rem' , }} 
            disabled={checkStudentResponsesCurrent?.answered}
            onClick={()=>setOpenSatisfaction(true)}>
              Responder Pesquisa de Satisfação
          </Button>): null}

        <OTrialDetail
          open={openModalTrial}
          onClose={handleTrialClose}
          assessmentId={assessmentId}
          studentId={studentId === undefined ? 0 : Number(studentId)}
        />

        <OSatisfaction
          open={openSatisfaction}
          onClose={handleSatisfactionClose}
          studentId={studentId === undefined ? 0 : Number(studentId)}
          trailId={trailId}
        />
      </Box>
      )}
    </Box>
  )
}

export default OResultAssessment