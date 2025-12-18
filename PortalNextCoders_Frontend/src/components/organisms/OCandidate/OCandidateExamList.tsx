import React from 'react';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Box, Button } from '@mui/material';
import { green, red } from '@mui/material/colors';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { QuestionInterface } from "../../../interfaces/candidate.interface";

type Answer = {
  answer: string;
  isCorrect: boolean;
}

type Question = {
  question: string;
  studentAnswer: Answer;
  correctAnswer: Answer;
}

type Props = {
  questions: Question[];
  type: number;
}

const OCandidateExamList: React.FC<Props> = ({ questions, type }) => {
  const totalQuestions = questions.length;
  const totalCorrectAnswers = questions.filter(q => q.studentAnswer.isCorrect).length;

  return (
    <Box sx={{ bgcolor: 'background.paper', mb: 2 }}>
      {type=== 2? (      <Button sx={{ float: 'right', bgcolor: 'grey.500', color: 'white' }}>
       {totalQuestions} total / {totalCorrectAnswers} correta(s)
      </Button>): null}

      {questions.map((question, index) => (
        <ListItem
          key={index}
          sx={{
            bgcolor: 'white',
            display: 'flex',
            alignItems: 'flex-start',
            flexDirection: 'column',
            marginBottom: 1,
          }}
        >
          <ListItemText
            primary={`${index + 1}. ${question.question}`}
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
            <ListItemText
              primary={ `Resposta do candidato: ${question.studentAnswer.answer}`}
              sx={{
                textAlign: 'left',
                paddingLeft: 2,
              }}
            />

            {type===2? (            <ListItemAvatar sx={{ marginLeft: 1 }}>
              {question.studentAnswer.isCorrect ? (
                <Avatar sx={{ bgcolor: green[500], width: 24, height: 24 }}>
                  <CheckIcon />
                </Avatar>
              ) : (
                <Avatar sx={{ bgcolor: red[500], width: 24, height: 24 }}>
                  <CloseIcon />
                </Avatar>
              )}
            </ListItemAvatar>): null}

          </div>
          {type === 2? (<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
            <ListItemText
              primary={`Resposta correta: ${question.correctAnswer.answer}`}
              sx={{
                textAlign: 'left',
                paddingLeft: 2,
              }}
            />
          </div>)
          : null}
          
        </ListItem>
      ))}
    </Box>
  );
};

export default OCandidateExamList;
