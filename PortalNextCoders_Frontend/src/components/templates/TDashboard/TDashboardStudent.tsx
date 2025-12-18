import Bell from "../../../assets/Home/Bell.png";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import OStepsHome from "../../organisms/ODashboard/ODashboardHome/OStepsHome";
import OSectionProgress from "../../organisms/OTraining/OSectionProgress";
import studentService from "../../../services/student/student.service";
import { useAuth } from "../../../context/AuthProvider/useAuth";
import MCardStepHomeLiveClass from "../../molecules/MDashboard/MDashboardHome/MCardStepHomeLiveClass";
import { parseISO, format, isToday } from 'date-fns';
import HandsOnService from '../../../services/HandsOn/handsOn.service';
import { IHandsOnDto, ContentHandsOnModule } from '../../../interfaces/teams/handsOn.interfaces';

interface ICurrentHandsOn {
  handsUrl: string | null;
  handsTime: string;
};

//TODO add hee the option to get the class data
function TDashboardStudent() {
  const { user } = useAuth();
  const { id } = user || {};
  const [currentHandsOn, setCurrentHandsOn] = useState<ICurrentHandsOn | undefined>(undefined);
  const [studentClassData, setStudentClassData] = useState<any[]>([]);

  const findCurrentHandsOn = async (studentClassId: number): Promise<ContentHandsOnModule | null> => {
    const handsOnClassList: IHandsOnDto[] | null = await HandsOnService.getHandsOn(studentClassId);
    if (!handsOnClassList || handsOnClassList.length === 0) return null;
    for (let trail of handsOnClassList[0]?.contentHandsOnTrails) {
      for (let module of trail.contentHandsOnModules) {
          const maxDate = parseISO(module.maxDate);
          if (isToday(maxDate)) return module;
      };
    };
    return null;
  };

  const fetchClassData = async () => {
    const studentClassDto = await studentService.GetClassByStudentId(id || 0);
    const handsOnSchedule = parseISO(studentClassDto.handsOnSchedule);
    const handsOnTime = format(handsOnSchedule, 'HH:mm');
    const currentHandsOn = await findCurrentHandsOn(studentClassDto.studentClassId);
    if (currentHandsOn) setCurrentHandsOn(
      {
        handsUrl: currentHandsOn.link,
        handsTime: handsOnTime
      } as ICurrentHandsOn
    );
    setStudentClassData(studentClassDto);
  };

  const fetchData = async () => {
    await fetchClassData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <OStepsHome />

      <OSectionProgress
          title=""
          dataInit={studentClassData[0]?.startAt}
          dataFinaly={studentClassData[0]?.endAt}
          value={80}
          mb={3}
      />

      {
        currentHandsOn &&
        <MCardStepHomeLiveClass
            icon={Bell}
            classTime={currentHandsOn.handsTime}
            buttonPath={currentHandsOn.handsUrl}
            inactive={!currentHandsOn.handsUrl}
        />
      }
    </Box>
  );
};

export default TDashboardStudent;
