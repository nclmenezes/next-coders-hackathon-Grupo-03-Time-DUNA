import React from 'react';
import TrophyImage from '../../../assets/Bonus/Trophy.png';
import './MProgressCircular.css';
import { Box, CircularProgress, Typography } from '@mui/material';
interface Props {
  grade: number;
  presence: number;
  props?: any;
}

export function MProgressCircular({  presence, grade, props }: Props) {
  const completed = (presence + grade) / 2;
  return (
    <Box className="progress-container">
  <CircularProgress variant="determinate" size={150} 
    value={grade/2} 
    className="progress-grade" 
    style={{ transform: 'rotate(90deg) scaleX(-1)' }}
    {...props} />
  <CircularProgress
        variant="determinate"
        size={150}
        value={presence / 2}
        className="progress-presence"
        {...props}
      />  
  <Box className="overlay">
    <div className="inner-content">
      <Typography fontSize={20} fontStyle={`bold`} fontFamily={`Inter`} className="percentage">{completed.toFixed(0)}%</Typography>
      <img className="trophy-image" src={TrophyImage} width={160} />
    </div>
  </Box>
</Box>
  );
}

