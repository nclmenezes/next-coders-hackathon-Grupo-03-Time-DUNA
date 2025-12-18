import {
  Box, Card, Typography, Divider, Chip, Grid
} from '@mui/material';
import TrophyImage from '../../../assets/Bonus/Trophy.png';

interface props {
  grade: number;
  presence: number;
  period: number;
  periodReward: number;
  currentPeriod: boolean;
  closedPeriod: boolean;
}

function MCardCategory({ grade, presence, period, periodReward, currentPeriod, closedPeriod }: props) {
  let logicColorChip = '';
  let logicTextChip = '';
  let logicColorTextChip = '';
  let disableColor = closedPeriod ? 'rgba(0, 0, 0, 0.1)' : '';

  if (closedPeriod && !currentPeriod) {
    logicColorChip = `#99CD4D`;
    logicTextChip = `ENCERRADO`;
    logicColorTextChip = `#FFF`;
  } else if (currentPeriod) {
    logicColorChip = `#1876D1`;
    logicTextChip = `EM ANDAMENTO`;
    logicColorTextChip = `#FFF`;    
  } else {
    logicColorChip = `#F5F5F5`;
    logicTextChip = 'NÃO INICIADO';
    logicColorTextChip = `#1876D1`;
  }

  return (
    <Card sx={{ width: 300, borderRadius: 4, boxShadow: '0px 0px 5px 2px rgba(0, 0, 0, 0.1)', position: 'relative' }}>
      <Box sx={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: disableColor }} />
      <Box sx={{ display: 'flex', flexDirection: `column`, alignItems: 'center', justifyContent: 'center', padding: `20px` }}>
        <Typography fontSize={15} color={`#495057`} sx={{ fontFamily: 'Inter', fontWeight: 'bold' }}>Período {period}</Typography>
        {periodReward !== undefined && (
          <Typography fontSize={20} color={`#000`} sx={{ fontFamily: 'Inter', fontWeight: 'bold' }}>
            R$ {periodReward.toLocaleString(`pt-br`, { minimumFractionDigits: 2 })}
          </Typography>
        )}
      </Box>

      <Divider>
        <Chip label={logicTextChip} style={{ backgroundColor: logicColorChip, color: logicColorTextChip, fontStyle: `bold` }} />
      </Divider>

      <Box sx={{ display: 'flex', flexDirection: `column`, justifyContent: `center`, alignItems: `center`, padding: `10px` }}>
        <Grid container>
          <Grid item xs={4}>
            <img src={TrophyImage} width={100} alt='trophy' />
          </Grid>

          <Grid item xs={6} sx={{ paddingTop: `20px` }}>
            <Typography fontSize={18} color={`#495057`} sx={{ fontFamily: 'Inter', fontWeight: 'bold' }}>{presence}% Presença</Typography>
            <Typography fontSize={18} color={`#495057`} sx={{ fontFamily: 'Inter', fontWeight: 'bold' }}>{grade}% Notas</Typography>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
}

export default MCardCategory;
