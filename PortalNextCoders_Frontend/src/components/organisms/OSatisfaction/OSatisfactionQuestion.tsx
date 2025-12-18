import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { useEffect, useState } from 'react';
import satisfactionService, { SatisfactionQuestion, SatisfactionResponse } from '../../../services/api/student/satisfaction.service';
import MLoading from '../../molecules/MLoading';
import { Typography } from '@mui/material';

interface SatisfactionQuestionsModalProps {
  open: boolean;
  onClose: () => void;
  studentId: number;
  satisfactionQuestions: SatisfactionQuestion[];
  onSendYesResponses: (satisfactionResponses: SatisfactionResponse[]) => void;
}

export default function OSatisfactionQuestion({ 
  open, onClose, studentId, satisfactionQuestions, onSendYesResponses
}: SatisfactionQuestionsModalProps) {
  const [loading, setLoading] = useState(false)
  const [responses, setResponses] = useState<Record<number, SatisfactionResponse>>({});
  const [allResponsesFilled, setAllResponsesFilled] = useState(false);

  useEffect(() => {
    const initialResponses = satisfactionQuestions.reduce((acc, question) => {
      acc[question.satisfactionQuestionTrailId] = {
        satisfactionQuestionTrailId: question.satisfactionQuestionTrailId,
        studentId: studentId,
        answered: false,
        response: ''
      };
      return acc;
    }, {} as Record<number, SatisfactionResponse>);
    setResponses(initialResponses);
  }, [open, satisfactionQuestions, studentId]);

  useEffect(() => {
    setAllResponsesFilled(Object.values(responses).every(response => response.response !== ''));
  }, [responses]);
    
  const handleResponseChange = (questionId: number, response: string) => {
    setResponses({
      ...responses,
      [questionId]: {
        satisfactionQuestionTrailId: questionId,
        studentId: studentId,
        answered: true,
        response: response
      }
    });
  };
  const handleSaveResponse = async () => {
    setLoading(true)
    try{
      onSendYesResponses(Object.values(responses));
      onClose();
    }catch(error: any){
      console.log(error)
    }finally{
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="satisfaction-questions-dialog-title"
      aria-describedby="satisfaction-questions-dialog-description"
      maxWidth="md"
      fullWidth
    >
    <DialogTitle id="satisfaction-questions-dialog-title">
      <Typography align="center" variant="h5" fontWeight="bold">
        Perguntas de Satisfação
      </Typography>
    </DialogTitle>
      {loading ? <MLoading/>: 
          <DialogContent>
          {satisfactionQuestions.map((question, index) => (
            <div key={index}>
            <DialogContentText id={`satisfaction-question-${index}`}>
              <Typography sx={{marginTop: '1rem'}} align="justify">
                {question.question}
              </Typography>
            </DialogContentText>
              {question.satisfactionQuestionTypeId === 1 ? (
                <RadioGroup
                  row
                  aria-label="satisfaction-response"
                  name="satisfaction-response"
                  value={responses[question.satisfactionQuestionTrailId]?.response || ''}
                  onChange={(event) => handleResponseChange(question.satisfactionQuestionTrailId, event.target.value)}
                  style={{overflowX: 'auto', whiteSpace: 'nowrap'}} // Permite a rolagem horizontal
                >
                  {[...Array(10).keys()].map((value) => (
                      <FormControlLabel key={value} value={value + 1} control={<Radio />} label={value + 1} />
                  ))}
                </RadioGroup>
              ) : (
                <div style={{display: 'flex', justifyContent: 'center' }}>
                  <TextField
                    id={`satisfaction-response-${index}`}
                    label="Resposta"
                    variant="outlined"
                    fullWidth
                    value={responses[question.satisfactionQuestionTrailId]?.response || ''}
                    onChange={(event) => handleResponseChange(question.satisfactionQuestionTrailId, event.target.value)}
                  />
                </div>
              )}
            </div>
          ))}
        </DialogContent>      
      }
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Fechar
        </Button>
        <Button onClick={handleSaveResponse} color="primary" disabled={!allResponsesFilled}>
          Enviar Respostas
        </Button>
      </DialogActions>
    </Dialog>
  );
}