import { Box, Card, CardContent, Typography, Divider, Grid } from '@mui/material';
import { MProgressCircular } from '../MProgressCircular/MProgressCircular';

interface Props {
  presence: number;
  grade: number;
}

function MCardOverview({ presence, grade }: Props) {
  return (
    <Card sx={{ height: '240px', width: `350px`, borderRadius: 4, boxShadow: '0px 0px 5px 3px rgba(0, 0, 0, 0.1)', bgcolor: '#' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: `#EDF2F8`, justifyContent: 'center' }}>
        <Typography fontSize={16} sx={{ fontFamily: 'Inter', fontWeight: 'bold', py: 1 }}>Visão Geral</Typography>
      </Box>
      <Divider sx={{ color: `#FFF` }} />

      <CardContent sx={{ backgroundColor: `#EDF2F8`, height: `100%` }}>
        <Grid container>

          <Grid item xs={6}>
            <MProgressCircular grade={grade} presence={presence} />
          </Grid>

          <Grid item xs={6} style={{ paddingLeft: `20px`, paddingTop: `30px`}} >
            <Box sx={{ display: 'flex'}}>
              <Box sx={{ height: 15, width: 15, borderRadius: 100, bgcolor: '#1876d1', mr:1, mt: 1.8}} />
              <Typography fontSize={20} sx={{ fontFamily: 'Inter', fontWeight: 'bold', py: 1 }}>Notas</Typography>
            </Box>
            <Box sx={{ display: 'flex' }}>
              <Box sx={{ height: 15, width: 15, borderRadius: 100, bgcolor: '#9ec1e8', mr: 1, mt: 1.8 }} />
              <Typography fontSize={20} sx={{ fontFamily: 'Inter', fontWeight: 'bold', py: 1 }}>Presença</Typography>
            </Box>
          </Grid>

        </Grid>
      </CardContent>
    </Card>
  );
}

export default MCardOverview;
