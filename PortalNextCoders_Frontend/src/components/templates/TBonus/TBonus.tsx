import MCardBonus from '../../molecules/MBonus/MCardBonus';
import { Grid } from '@mui/material';
import MCardOverview from '../../molecules/MBonus/MCardOverview';
import MCardCategory from '../../molecules/MBonus/MCardCategory';
import { useStudent } from '../../../context/StudentProvider/StudentProvider';
import { Period } from '../../../services/api/contractorengine/types';

function TBonus() {
  const { studentPeriod } = useStudent();

  let currentPeriodData: Period | null = null;
  const allPeriods = [];

  if (studentPeriod && Array.isArray(studentPeriod)) {
    const currentDate = new Date();
    
    currentPeriodData = studentPeriod.find(period => 
      new Date(period.startAt) <= currentDate && new Date(period.endAt) >= currentDate
    ) || studentPeriod[studentPeriod.length - 1]; 

    for (const period of studentPeriod) {
      const studentDetail = period.studentDetails[0]; 

      if (studentDetail) {
        const averages = studentDetail.studentPeriodAverages;
        
        const grade = (averages.find(avg => avg.activityType.type === "Nota")?.average || 0)*10;

        const presence = (
          (averages.find(avg => avg.activityType.type === "Presença")?.average || 0) * 0.6 +
          (averages.find(avg => avg.activityType.type === "Hands-On")?.average || 0) * 0.2 +
          (averages.find(avg => avg.activityType.type === "Mentorias")?.average || 0) * 0.2
        )*10;

        allPeriods.push({
          periodNumber: period.number,
          periodReward: studentDetail.reward,
          grade,
          presence,
          currentPeriod: period.id === currentPeriodData?.id,
          closedPeriod: currentDate > new Date(period.endAt)
        });
      }
    }
  }

  const currentPeriodDetails = currentPeriodData?.studentDetails[0];

  const calculatedPresence = currentPeriodDetails ? (
    (currentPeriodDetails.studentPeriodAverages.find(avg => avg.activityType.type === "Presença")?.average || 0) * 0.6 +
    (currentPeriodDetails.studentPeriodAverages.find(avg => avg.activityType.type === "Hands-On")?.average || 0) * 0.2 +
    (currentPeriodDetails.studentPeriodAverages.find(avg => avg.activityType.type === "Mentorias")?.average || 0) * 0.2
  ) *10: 0;


  return (
    <>
      <Grid container>
        <Grid item style={{ padding: '10px' }}>
          {currentPeriodDetails && (
            <MCardBonus
              cash={currentPeriodDetails.reward}
              periodNumber={currentPeriodData!.number}
              grade={(currentPeriodDetails.studentPeriodAverages.find(avg => avg.activityType.type === "Nota")?.average || 0)*10}
              presence={calculatedPresence}
            />
          )}
        </Grid>

        <Grid item style={{ padding: '10px' }}>
          {currentPeriodDetails && (
            <MCardOverview
              grade={(currentPeriodDetails.studentPeriodAverages.find(avg => avg.activityType.type === "Nota")?.average || 0)*10}
              presence={calculatedPresence}
            />
          )}
        </Grid>
      </Grid>

      <Grid container spacing={2} style={{ padding: '10px', display: 'flex' }}>
        {allPeriods.map((periodData, index) => (
          <Grid item key={index}>
            <MCardCategory
              grade={periodData.grade}
              presence={periodData.presence}
              period={periodData.periodNumber}
              periodReward={periodData.periodReward}
              currentPeriod={periodData.currentPeriod}
              closedPeriod={periodData.closedPeriod}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default TBonus;