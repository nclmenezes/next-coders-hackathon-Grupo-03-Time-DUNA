import { useState, useEffect } from 'react';
import { useStudent } from '../../../context/StudentProvider/StudentProvider';
import { Box } from '@mui/material';
import ContentService from '../../../services/api/student/studentContent.service';
import AgentClassesService from "../../../services/Teams/classes/agentClasses.service";
import CheckStudentClass from "../../../services/student/checkStudentClass.service";
import StudentService from "../../../services/student/student.service";
import { TrailDto, ModuleDto, SubModuleDto } from "../../../interfaces/StudentContents/Responses/Classes";
import { HandsOnDto } from "../../../interfaces/StudentContents/Responses/Classes";
import MHandsOnCard from '../../molecules/MTraining/MHandsOnCard';
import MLoading from '../../molecules/MLoading';
import { isEqual, parseISO, startOfDay } from 'date-fns';
import {
    UNEXPECTED_SERVICE_ERROR_MSG,
    LOAD_STUDENT_INFO_ERROR_MSG,
    LOAD_STUDENTCLASS_INFO_ERROR_MSG,
    LOAD_HANDSON_INFO_ERROR_MSG
} from "../../../constants/contentLayout/contentLayout";
import { showErrorToast } from '../../../utils/toast';
import { IStudentClassCheckDto } from '../../../interfaces/student/checkStudentClass.interface';
import { StudentClassScheduler } from "../../../interfaces/teams/class.interfaces";

const OLiveClass = () => {
    const { classes } = useStudent();
    const [pageLoading, setPageLoading] = useState<boolean>(false);
    const [hasHandsOnToday, setHasHandsOnToday] = useState<boolean | null>(null);
    const [handsSchedule, setHandsSchedule] = useState<string | null | undefined>(null);
    const [handsLink, setHandsLink] = useState<string | null>(null);

    const fetchHandsData = async (studentClassId: number, subModuleId: number): Promise<HandsOnDto | null> => {
        setPageLoading(true);
        const handsDto = await ContentService.GetHandsOnData(studentClassId, subModuleId);
        setPageLoading(false);
        if (handsDto.length === 0) return null;
        return handsDto[0];
    };

    const checkStudentEndpoint = async (studentId: number): Promise<IStudentClassCheckDto | null> => {
        setPageLoading(true);
        const checkStudentClass: IStudentClassCheckDto | null = await CheckStudentClass(studentId);
        setPageLoading(false);
        if (!checkStudentClass) return null;
        return checkStudentClass;
    };

    const fetchHandsOnSchedule = async (studentId: number) => {
        setPageLoading(true);
        const checkStudentDto = await checkStudentEndpoint(studentId);
        setPageLoading(false);
        if (!checkStudentDto) return showErrorToast(LOAD_STUDENT_INFO_ERROR_MSG);
        if (checkStudentDto.contractorManagement) {
            setPageLoading(true);
            const agentClass = await AgentClassesService.GetAgentClassById(checkStudentDto.contractorManagement!.studentClassId);
            setPageLoading(false);
            if (!agentClass) return showErrorToast(LOAD_STUDENTCLASS_INFO_ERROR_MSG);
            const handsOnScheduler = agentClass.studentClassSchedulers
                .find((scheduler: StudentClassScheduler) => scheduler.activityType?.id === 3);
            if (!handsOnScheduler) return showErrorToast(LOAD_HANDSON_INFO_ERROR_MSG);
            return setHandsSchedule(handsOnScheduler.scheduledAt);
        };
        setPageLoading(true);
        const classData = await StudentService.getClassById(checkStudentDto.studentClassReferenceId);
        setPageLoading(false);
        if (!classData) return showErrorToast(LOAD_STUDENTCLASS_INFO_ERROR_MSG);
        if (!classData.handsOnSchedule) return showErrorToast(LOAD_HANDSON_INFO_ERROR_MSG);
        setHandsSchedule(classData.handsOnSchedule);
    };

    const getTodaySubModuleClass = (trails: TrailDto[]): number | null => {
        const todayDateStr = startOfDay(new Date());
        let moduleClass: ModuleDto | null = null;
        outerLoop:
        for (let trail of trails)
            for (let module of trail.modules) {
                const dateCompare = isEqual(startOfDay(parseISO(module.limitDate)), todayDateStr);
                if (!dateCompare) continue;
                moduleClass = module;
                break outerLoop;
            };
        if (!moduleClass) return null;
        const subModuleClass: SubModuleDto | undefined = moduleClass.subModules.find(subModule => subModule.subModuleTypeId === 2);
        return subModuleClass?.id ?? null;
    };

    const setLiveHandsData = async () => {
        if (!classes) return showErrorToast(UNEXPECTED_SERVICE_ERROR_MSG);
        const todaySubModuleClassId = getTodaySubModuleClass(classes.trails);
        if (!todaySubModuleClassId) {
            setHandsSchedule(null);
            return setHasHandsOnToday(false);
        };
        setHasHandsOnToday(true);
        const handsData = await fetchHandsData(classes.id, todaySubModuleClassId);
        if (!handsData) return setHandsSchedule(null);
        setHandsLink(handsData.link);
        fetchHandsOnSchedule(classes.studentId);
    };

    useEffect(() => {
        setLiveHandsData();
    }, []);

    return (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            {pageLoading &&  <MLoading />}
            {
                (hasHandsOnToday !== null && handsSchedule !== undefined) &&
                <MHandsOnCard HandsOnSchedule={handsSchedule} HandsOnLink={handsLink} HasHandsOnToday={hasHandsOnToday} />
            }
        </Box>
    );
};

export default OLiveClass;