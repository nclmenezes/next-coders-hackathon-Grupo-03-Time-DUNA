import { useEffect, useState } from "react";
import studentCourseService, { TrialAnswerDto, TrialDto } from "../../../services/api/student/studentCourse.service";
import { Avatar, Box, Dialog, DialogContent, DialogTitle, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import MLoading from "../../molecules/MLoading";
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

export interface OTrialDetailProps {
  open: boolean;
  onClose: () => void;  
  assessmentId: number;
  studentId: number;
}

export function OTrialDetail({open, onClose, assessmentId, studentId}: OTrialDetailProps){
  const [loading, setLoading] = useState(false)
  const [trial, setTrial] = useState<TrialDto[]>([])

  useEffect(() => {
    if (!open) return;
    const fetchData = async () => {
      setLoading(true)
      try{
        var trialData = await studentCourseService.GetTrialStudent(assessmentId, studentId);
        setTrial(trialData);
      
      }catch(error: any){
        console.log(error)
      }finally{
        setLoading(false)
      }
    };
    fetchData();
  }, [open]);

  const checkAnswer = (answer: TrialAnswerDto) => {
    if (answer.isCorrect) {
      return (                    
        <Avatar sx={{ bgcolor: 'green', width: 24, height: 24 }}>
          <CheckIcon />
        </Avatar>
      );
    } else if (answer.studentAnswer !== answer.isCorrect) {
      return (                    
        <Avatar sx={{ bgcolor: 'red', width: 24, height: 24 }}>
          <CloseIcon />
        </Avatar>
      );
    } else {
      return (                    
        <Avatar sx={{ width: 24, height: 24 }}>
          <RadioButtonUncheckedIcon />
        </Avatar>
      );
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" sx={{ borderRadius: '8px' }}>
      <DialogTitle>Detalhamento da prova</DialogTitle>
      <DialogContent>
        {trial.map((question, index) => (
          loading ? (
            <MLoading />
          ) : (
            <ListItem
              key={index}
              sx={{
                bgcolor: 'white',
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'column',
                marginBottom: 1,
                borderRadius: '10px',
              }}
            >
              <ListItemText
                primary={`${index + 1}. ${question.questionText}`}
                sx={{
                  bgcolor: '#1976d2',
                  color: 'white',
                  fontWeight: 'bold',
                  textAlign: 'left',
                  paddingLeft: 2,
                  width: '100%',
                  borderRadius: '4px',
                }}
              />
              {question.answers.map((answer, index) => (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                  <ListItemText
                    primary={`${answer.answerText}`}
                    sx={{
                      textAlign: 'left',
                      paddingLeft: 2,
                    }}
                  />
                  <ListItemAvatar sx={{ marginLeft: 1 }}>
                    {checkAnswer(answer)}
                  </ListItemAvatar>
                </div>
              ))}
            </ListItem>
          )
        ))}
      </DialogContent>
    </Dialog>
  );
}