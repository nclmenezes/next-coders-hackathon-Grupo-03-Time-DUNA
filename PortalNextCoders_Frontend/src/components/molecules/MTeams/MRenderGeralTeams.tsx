import { Box, Card, CircularProgress, CardContent, Typography, Divider, Grid } from '@mui/material';
import '../MProgressCircular/MProgressCircular.css';

interface Team {
  name: string;
  attendance: number;
  grade: number;
}

interface Props {
  teams: Team[];
}


interface PropsCircular {
  grade: number;
  presence: number;
}

function ProgressCircular({  presence, grade }: PropsCircular) {
  const completed = (presence + grade) / 2;
  return (
    <Box className="progress-container">
      <CircularProgress variant="determinate" size={150} 
        value={grade/2} 
        className="progress-grade" 
        style={{ transform: 'rotate(90deg) scaleX(-1)' }} />
      <CircularProgress
            variant="determinate"
            size={150}
            value={presence / 2}
            className="progress-presence"
          />  
      <Box className="overlay">
        <div className="inner-content">
          <Typography fontSize={20} fontStyle={`bold`} fontFamily={`Inter`} className="percentage">{completed.toFixed(0)}%</Typography>
        </div>
      </Box>
    </Box>
  );
}

function MCardOverview({ teams }: Props) {
  // Calculate the average attendance and grades
  const totalAttendance = teams.reduce((total, team) => total + team.attendance, 0);
  const totalGrades = teams.reduce((total, team) => total + team.grade, 0)*10;

  const averageAttendance = totalAttendance / teams.length;
  const averageGrades = totalGrades / teams.length;


  return (
    <Card sx={{ height: '240px', width: `350px`, borderRadius: 4, boxShadow: '0px 0px 5px 3px rgba(0, 0, 0, 0.1)', bgcolor: '#' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: `#EDF2F8`, justifyContent: 'center' }}>
        <Typography fontSize={16} sx={{ fontFamily: 'Inter', fontWeight: 'bold', py: 1 }}>Visão Geral</Typography>
      </Box>
      <Divider sx={{ color: `#FFF` }} />

      <CardContent sx={{ backgroundColor: `#EDF2F8`, height: `100%` }}>
        <Grid container>

          <Grid item xs={6}>
            <ProgressCircular grade={averageGrades} presence={averageAttendance} />
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



