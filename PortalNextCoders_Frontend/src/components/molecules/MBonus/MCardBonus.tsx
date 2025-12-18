import {
  Box, Card, Typography, Divider, Grid
} from '@mui/material';
import { MProgressLine } from '../MProgressLine/MProgressLine';

interface props {
  periodNumber: number;
  cash: number;
  grade: number;
  presence: number;
}
function MCardBonus({ periodNumber, cash, grade, presence }: props) {
  return (
    <Box>
      <Card sx={{ width: '663px', height: '239px', display: `flex`, flexDirection: 'column', borderRadius: 4, boxShadow: '0px 0px 5px 2px rgba(0, 0, 0, 0.1)' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ fontFamily: 'Inter', fontSize: '16px', fontWeight: 'bold', py: 1 }}>Sua gameficação</Typography>
            </Box>
            <Divider sx={{ maxWidth: '270px' }} />

            <Typography fontSize={11} color='#495057' sx={{ marginLeft: '26px', marginTop: '15px' }}>Período {periodNumber}</Typography>
            <Typography fontSize={38} fontFamily='inter' fontWeight={700} fontStyle='normal' sx={{ marginLeft: '26px' }}>
              R$ {cash.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Typography>
            <Typography fontSize={14} color='#495057' fontStyle='normal' sx={{ marginLeft: '26px', marginTop: '5px' }}>Bônus acumulado na gamificação para o PERÍODO {periodNumber} de aulas</Typography>

          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ fontFamily: 'Inter', fontSize: '16px', fontWeight: 'bold', py: 1 }}>Seu Progresso</Typography>
            </Box>
            <Divider />

            <Box sx={{ margin: '0 20px' }}>
              <MProgressLine name={'Presença'} percentage={presence} style={{marginTop: `25px`}} colorProgress='#4263EB'/>
              <MProgressLine name={'Notas'} percentage={grade} style={{marginTop: `15px`}} colorProgress='#0A4295'/>
            </Box>

          </Grid>
        </Grid>
        
        <Box sx={{ width: `100%`, display: `flex`, marginTop: `auto`, bottom: 0, alignItems: `center`, justifyContent: `center`, backgroundColor: '#4263EB' }}>
            <Typography color='#FFF' sx={{ fontFamily: 'Inter', fontSize: '16px', fontWeight: 'bold', py: 1 }}>
              Quanto mais você se dedica, mais você ganha!
            </Typography>
          </Box>
      </Card>
    </Box>)
}

export default MCardBonus