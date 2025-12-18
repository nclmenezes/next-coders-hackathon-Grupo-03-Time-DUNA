import { Card, Box, Typography, ListItemIcon } from '@mui/material'

import Priority from '../../../../assets/Home/Priority.png'

interface MCardWarningProps {
    daysLate: string;
  }

function MCardWarning({ daysLate }: MCardWarningProps) {
  return (
    <Card variant="outlined" sx={{border: 'none' ,display: 'flex', alignItems: 'center', p: 2, justifyContent: 'space-between', width: '100%', height: '80px', bgcolor: '#FFEFEF', my: 2}}>
    <Box sx={{display: 'flex', alignItems: 'center'}}>
        <ListItemIcon sx={{p: 1}}>
            <img src={Priority} height={50} width={50} style={{margin: 4}} />
        </ListItemIcon>
        <Box sx={{py: 2}}>
            <Typography variant='h6' sx={{
                fontFamily: 'Inter', 
                fontStyle: 'normal', 
                fontWeight: '600', 
                lineHeight: '19px', 
                fontSize: '16px', 
                color: "#D70B08", 
                paddingBottom: '8px'
            }}>
                Você está {daysLate} dias atrasado.
            </Typography>
            <Typography variant='subtitle2' sx={{
                fontFamily: 'Inter', 
                fontStyle: 'normal', 
                fontWeight: '400', 
                lineHeight: '17px', 
                fontSize: '14px', 
                color: "#495057"
            }}>
                Não perca tempo e continue sua aula para recuperar o tempo perdido. Lembre-se de evitar atrasos desnecessários sempre que possível.
            </Typography>
        </Box>
    </Box>
</Card>
  )
}

export default MCardWarning