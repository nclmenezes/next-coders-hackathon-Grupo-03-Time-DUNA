import React from 'react';
import { Box, Typography } from '@mui/material';

type Detail = {
  label: string;
  value: string;
}

type Props = {
  details: Detail[];
}

const OCandidateInformation: React.FC<Props> = ({ details }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {details.map((detail, index) => (
        <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: '8px', height: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {detail.label}:
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: '16px', marginTop: '4px' }}>
            <Typography variant="body1" sx={{ backgroundColor: '#fafafa', borderRadius: '5px', padding: '5px', width: '100%' }}>
              {detail.value}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default OCandidateInformation;
