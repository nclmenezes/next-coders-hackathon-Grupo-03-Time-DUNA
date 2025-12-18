import React, { useState } from 'react';
import { Box, Grid, Typography, Divider, Rating } from '@mui/material';
import { SatisfactionQuestion, SatisfactionResponse } from '../../../services/api/student/satisfaction.service';
import SadSvg from '../../../assets/SadSvg';
import SmileSvg from '../../../assets/SmileSvg';

interface QuestionBoxProps {
  responseQuestions: SatisfactionResponse[];
  setValueQuestions: React.Dispatch<React.SetStateAction<SatisfactionResponse[]>>;
  satisfactionQuestions: SatisfactionQuestion[];
}

export const QuestionBox: React.FC<QuestionBoxProps> = ({ responseQuestions,
  setValueQuestions,
  satisfactionQuestions
}) => {
  return (
    <Box sx={{ padding: `20px`, marginTop: `30px` }}>
      {
        satisfactionQuestions.filter((x: SatisfactionQuestion) => x.satisfactionQuestionTypeId === 1).map((question, index) => {
          return (
            <Box key={index}>
              <Grid padding={2} container spacing={6} alignItems={`center`} columns={16}>
                <Grid item xs={8}>
                  <Typography
                    sx={{ fontWeight: 'bold'}}                      
                    fontSize={20}>
                    <div style={{ fontFamily: 'Raleway' }} dangerouslySetInnerHTML={{ __html: question.question }} />
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <>
                    <SadSvg /> <Rating size='large' name="half-rating" value={parseInt(responseQuestions[index]?.response)}
                      onChange={(event, newValue) => {
                        setValueQuestions({
                          ...responseQuestions,
                          [index]: {
                            satisfactionQuestionTrailId: responseQuestions[index].satisfactionQuestionTrailId,
                            studentId: responseQuestions[index].studentId,
                            answered: true,
                            response: newValue?.toString()!
                          }
                        });
                      }} precision={1} /> <SmileSvg />
                  </>
                </Grid>
              </Grid>
              <Divider variant="middle" />
            </Box>
          )
        })
      }
    </Box>
  )
};