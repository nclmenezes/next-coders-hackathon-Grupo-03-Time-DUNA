import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const Loading: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
      }}
    >
      <CircularProgress size={60} />
    </Box>
  );
};

export default Loading;
