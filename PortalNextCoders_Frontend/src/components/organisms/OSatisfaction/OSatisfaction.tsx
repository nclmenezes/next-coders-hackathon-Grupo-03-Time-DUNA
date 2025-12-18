import Dialog from '@mui/material/Dialog';
import { useEffect, useState } from 'react';
import satisfactionService, { SatisfactionQuestion, SatisfactionResponse } from '../../../services/api/student/satisfaction.service';
import MLoading from '../../molecules/MLoading';
import { useStudent } from '../../../context/StudentProvider/StudentProvider';
import { Box, Button, Typography } from '@mui/material';
import './OSatisfaction.css';
import { QuestionBox } from '../../molecules/MQuestionBox/MQuestionBox';
import { CommentBox } from '../../molecules/MCommentBox/MCommentBox';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';

interface OSatisfactionProps {
  open: boolean;
  onClose: () => void;
  studentId: number;
  trailId: number;
}

export default function OSatisfaction({
  open,
  onClose,
  studentId,
  trailId
}: OSatisfactionProps) {
  const { classes } = useStudent();
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const { setCheckStudentResponse } = useStudent();
  const [satisfactionQuestions, setSatisfactionQuestions] = useState<SatisfactionQuestion[]>([]);
  const [valueQuestions, setValueQuestions] = useState<SatisfactionResponse[]>([]);
  const [completedQuestions, setCompletedQuestions] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        var satisfactionQuestion = await satisfactionService.getQuestions(trailId);
        setSatisfactionQuestions(satisfactionQuestion)
        initialResponses()
      } catch (error: any) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    };
    fetchData();
  }, [open]);

  function initialResponses() {
    satisfactionQuestions.map(question => {
      valueQuestions.push({
        satisfactionQuestionTrailId: question.satisfactionQuestionTrailId,
        studentId: studentId,
        answered: false,
        response: ""
      })
    });
  }

  const handlePrimaryReponse = async () => {
    const allAnswered = satisfactionQuestions.map((question, index) => {
      if (satisfactionQuestions[index].satisfactionQuestionTypeId === 1 && valueQuestions[index].response === "") {
        return false;
      }
      return true
    }).every((value) => value);

    if (!allAnswered) {
      window.alert('Por favor, responda todas as perguntas antes de enviar sua avaliação.');
    } else {
      onClose();
      setCompletedQuestions(true);
    }
  }

  function closeAllModals() {
    setCompletedQuestions(false);
    onClose();
  }

  const handleSendResponses = async (response: SatisfactionResponse[]) => {
    setLoading(true)
    try {
      await satisfactionService.insertResponses(response).then(() => {
        Swal.fire({
          title: 'Muito obrigado :)',
          text: 'Agradecemos pelo seu valioso feedback! Sua avaliação é fundamental para aprimorarmos continuamente nossa plataforma de ensino.',
          icon: 'success',
          confirmButtonText: 'Ok',
        }).then(async () => {
          const allTrailIds: number[] = classes!.trails.map((trail) => trail.id);
          var checkSatisfaction = await satisfactionService.getStudentResponses(allTrailIds, studentId);
          setCheckStudentResponse(checkSatisfaction);
          window.location.reload();
        })
      })
      closeAllModals();

    }catch(error: any){
      console.log(error)
    }
    finally{
      setLoading(false)
    }

  }

  const handleSendNoResponses = async () => {
    var indexComment = satisfactionQuestions?.findIndex(x => x.satisfactionQuestionTypeId === 2)
    var response = Object.values(valueQuestions)?.map((question, index) => {
      if (index === indexComment) {
        return {
          satisfactionQuestionTrailId: question.satisfactionQuestionTrailId,
          studentId: studentId,
          answered: false,
          response: ""
        }
      }
      return question
    })
    handleSendResponses(response)
  }

  const handleSendYesResponses = async () => {
    handleSendResponses(valueQuestions)
  }

  return (
    <div>
      {loading ? <MLoading /> :
        <>
          <Dialog
            open={open}
            onClose={onClose}
            aria-describedby="alert-dialog-description"
            sx={{ borderRadius: '25px' }}
            scroll="body"
          >
            <Box sx={{ width: '600px', paddingTop: '20px', height: '680px' }}>
              <Box>
                <Typography
                  fontFamily="Raleway"
                  fontSize={28}
                  textAlign="center"
                  color="#000000"
                  fontWeight="bold"
                >
                  <strong>E aí! Tá curtindo nossa jornada?</strong>
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography
                  fontFamily="Raleway"
                  fontSize={18}
                  width={500}
                  textAlign="center"
                  color="#000000"    
                  fontWeight="bold"
                >
                  Em uma escala de 1 a 5, sendo <strong>5 para muito satisfeito</strong> e <strong>1 para pouco satisfeito</strong>, conta pra gente:
                </Typography>
              </Box>

              <QuestionBox
                responseQuestions={valueQuestions}
                satisfactionQuestions={satisfactionQuestions}
                setValueQuestions={setValueQuestions}
              />

              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Button
                  variant='contained'
                  sx={{
                    width: '229px',
                    height: `52px`,
                    backgroundColor: ` #4962E3`,
                    borderRadius: `5px`,
                    marginTop: `20px`,
                    textTransform: 'none'
                  }}
                  onClick={handlePrimaryReponse}
                >
                  Enviar minha avaliação
                </Button>
                <Button variant='text' onClick={closeAllModals} size='small' sx={{ width: `197px`, height: `24px`, marginTop: '5px', textTransform: 'none', color: `#000000` }}>
                  Prefiro responder depois ;)
                </Button>
              </Box>
            </Box>
          </Dialog>

          <CommentBox
            handleSendNoResponses={handleSendNoResponses}
            handleSendResponses={handleSendYesResponses}
            open={completedQuestions}
            setOpen={setCompletedQuestions}
            setValueQuestions={setValueQuestions}
            textSubDescription={satisfactionQuestions?.find(x => x.satisfactionQuestionTypeId === 2)?.question}
            responseQuestions={valueQuestions}
            index={satisfactionQuestions?.findIndex(x => x.satisfactionQuestionTypeId === 2)} />
        </>
      }
    </div>
  );
}