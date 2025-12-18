import { Box, ListItemIcon, Typography } from '@mui/material'
import { ReactNode } from 'react'

interface props {
    icon?: ReactNode;
    title: string;
    subtitle?: string;
}

function Notepad({icon, title, subtitle}: props) {
  return (

        <Box sx={{display: 'flex', borderBottom: '1px solid #EBF0F3', p: 2, alignItems: 'center'}}>
          <ListItemIcon>
                {icon}
          </ListItemIcon>
          <Box>
          <Typography sx={{fontFamily: 'Inter', fontSize: '14px', color: '#212429', fontWeight: 600}}>  {title}   </Typography>
          <Typography sx={{fontFamily: 'Inter', fontSize: '14px', color: '#495057', fontWeight: 500}}>  {subtitle}   </Typography>
          </Box>
        </Box>

  )
}

export default Notepad