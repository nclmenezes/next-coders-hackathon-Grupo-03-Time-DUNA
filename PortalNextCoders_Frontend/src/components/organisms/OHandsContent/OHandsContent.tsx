import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { parse, format } from 'date-fns';
import ContentService from '../../../services/api/student/studentContent.service';
import { HandsOnDto } from '../../../interfaces/StudentContents/Responses/Classes';
import MHandsOnCard from '../../molecules/MTraining/MHandsOnCard';
import { Box, Button, Tooltip, Typography } from '@mui/material';
import { IModuleClass, ISubModuleClass } from '../../../interfaces/CourseService/courseService.interface';
import ClassNotepad from '../../atoms/Sections/ClassNotepad';
import MLoading from '../../molecules/MLoading';
import {
    HANDS_LIVE_TYPE,
    HANDS_RECORD_TYPE,
    LIVE_CONTENT_TYPE,
    RECORD_CONTENT_TYPE,
    VIDEO_CONTENT_TYPE,
    LOAD_STUDENT_INFO_ERROR_MSG,
    LOAD_STUDENTCLASS_INFO_ERROR_MSG,
    LOAD_HANDSON_INFO_ERROR_MSG
} from "../../../constants/contentLayout/contentLayout";
import { useAuth } from "../../../context/AuthProvider/useAuth";
import { IStudentClassCheckDto } from '../../../interfaces/student/checkStudentClass.interface';
import CheckStudentClass from "../../../services/student/checkStudentClass.service";
import AgentClassesService from "../../../services/Teams/classes/agentClasses.service";
import StudentService from "../../../services/student/student.service";
import { StudentClassScheduler } from "../../../interfaces/teams/class.interfaces";
import { showErrorToast } from "../../../utils/toast";
import MClassContent from "../../molecules/MClassContent/MClassContent";

interface IHandsContentProps {
    moduleClass: IModuleClass;
    subModuleClass: ISubModuleClass;
    subModuleClassIndex: number;
    handleNextButton: () => void;
    handleBackButton: () => void;
    contentAttendance: () => Promise<boolean>;
    contentLoading: boolean;
    setContentLoading: Dispatch<SetStateAction<boolean>>;
};

const OHandsContent = ({
    moduleClass,
    subModuleClass,
    subModuleClassIndex,
    handleNextButton,
    handleBackButton,
    contentAttendance,
    contentLoading,
    setContentLoading
}: IHandsContentProps) => {
    const [handsData, setHandsData] = useState<HandsOnDto | undefined>(undefined);
    const [handsOnSchedule, setHandsOnSchedule] = useState<string | null>(null);
    const { user } = useAuth();

    const fetchHandsData = async () => {
        setContentLoading(true);
        const handsDataList: HandsOnDto[] = await ContentService.GetHandsOnData(moduleClass.studentClassId, subModuleClass.subModuleId);
        setContentLoading(false);
        if (handsDataList.length === 0) return;
        setHandsData(handsDataList[0]);
    };

    useEffect(() => {
        fetchHandsData();
    }, []);

    const checkStudentEndpoint = async (): Promise<IStudentClassCheckDto | null> => {
        if (!user?.id) return null;
        setContentLoading(true);
        const checkStudentClass: IStudentClassCheckDto | null = await CheckStudentClass(user.id);
        setContentLoading(false);
        if (!checkStudentClass) return null;
        return checkStudentClass;
      };

    const fetchHandsOnSchedule = async () => {
        setContentLoading(true);
        const checkStudentDto = await checkStudentEndpoint();
        setContentLoading(false);
        if (!checkStudentDto) return showErrorToast(LOAD_STUDENT_INFO_ERROR_MSG);
        if (checkStudentDto.contractorManagement) {
            setContentLoading(true);
            const agentClass = await AgentClassesService.GetAgentClassById(checkStudentDto.contractorManagement!.studentClassId);
            setContentLoading(false);
            if (!agentClass) return showErrorToast(LOAD_STUDENTCLASS_INFO_ERROR_MSG);
            const handsOnScheduler = agentClass.studentClassSchedulers
                .find((scheduler: StudentClassScheduler) => scheduler.activityType?.id === 3);
            if (!handsOnScheduler) return showErrorToast(LOAD_HANDSON_INFO_ERROR_MSG);
            return setHandsOnSchedule(handsOnScheduler.scheduledAt);
        };
        setContentLoading(true);
        const classData = await StudentService.getClassById(moduleClass.studentClassId);
        setContentLoading(false);
        if (!classData) return showErrorToast(LOAD_STUDENTCLASS_INFO_ERROR_MSG);
        if (!classData.handsOnSchedule) return showErrorToast(LOAD_HANDSON_INFO_ERROR_MSG);
        setHandsOnSchedule(classData.handsOnSchedule);
    };

    useEffect(() => {
        if (!handsData) return;
        if (handsData.handsOnTypeId === HANDS_RECORD_TYPE) return;
        fetchHandsOnSchedule();
    }, [handsData]);

    const postContentAttendance = async (): Promise<boolean> => await contentAttendance();

    const nextButton = async () => {
        if (!subModuleClass.contents[0].finishAt && !await postContentAttendance()) return;
        handleNextButton();
    };

    return (
        <Box sx={{ display: 'flex', gap: '30px', height: '100%' }}>
            {contentLoading && <MLoading />}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flexGrow: 2,
                    justifyContent: 'center',
                    visibility: handsData ? 'default' : 'hidden'
                }}
            >
                {
                    handsData &&
                    (
                        handsData.handsOnTypeId === HANDS_LIVE_TYPE ?
                        (handsOnSchedule && <MHandsOnCard HandsOnLink={handsData.link} HandsOnSchedule={handsOnSchedule} HasHandsOnToday={true} />) :
                        <MClassContent
                            contentType={VIDEO_CONTENT_TYPE}
                            contentLink={handsData!.link}
                            contentLinkDescription={""}
                            contentName={"Assista à gravação do Hands-On"}
                            contentDescription={"Confira a gravação da nossa aula Hands-On, onde colocamos a mão na massa com tudo que aprendemos. Foi prática, direta e extremamente útil para aplicar os conceitos!"}
                        />
                    )
                }
            </Box>
            <Box sx={{ height: 'auto', width: '1px', bgcolor: 'rgba(0, 0, 0, 0.12)' }} />
            <Box sx={{ height: '50%',width: '100%', display: 'flex',  gap: '30px',justifyContent: 'space-between', marginTop: '30px' }}>
                <Button
                    onClick={() => handleBackButton()}
                    sx={{
                        bgcolor: '#DDDDDD',
                        '&:hover': { bgcolor: '#DDDDDD' },
                        fontFamily: 'Inter',
                        fontWeight: 500,
                        textTransform: 'none',
                        color: 'grey',
                        padding: '10px 25px'
                    }}
                >
                    Seção anterior
                </Button>
                <Button
                    onClick={() => nextButton()}
                    sx={{
                        bgcolor: 'rgb(66, 99, 235)',
                        '&:hover': { bgcolor: 'rgb(66, 99, 235)' },
                        fontFamily: 'Inter',
                        fontWeight: 500,
                        textTransform: 'none',
                        color: 'white',
                        padding: '10px 25px'
                    }}
                >
                    { subModuleClassIndex === moduleClass.subModules.length - 1 ? 'Finalizar aula' : 'Próxima seção' }
                </Button>
            </Box>
            <Box sx={{ flexGrow: 0.5, minWidth: '25%'}}>
                <Box sx={{ userSelect: 'none' }}>
                    <Typography
                        sx={{
                            fontFamily: 'Inter',
                            fontWeight: 400,
                            color: 'grey',
                            fontSize: '0.95em'
                        }}
                    >
                        [{moduleClass.trailName}]
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: 'Inter',
                            fontWeight: 400,
                            color: 'black',
                            fontSize: '1.1em'
                        }}
                    >
                        <strong style={{ fontWeight: 700 }}>Aula {moduleClass.moduleOrderNumber}</strong> - {moduleClass.moduleName!.split('-')[1]}<br />
                        <strong style={{ fontWeight: 700 }}>Seção {subModuleClass.subModuleOrderNumber}</strong> - Aula prática (hands-on)
                        <span style={{ color: 'grey', fontSize: '0.95em' }}> [{subModuleClass.subModuleOrderNumber}/{moduleClass.subModules.length}]</span>
                    </Typography>
                </Box>
                <Box sx={{ marginTop: '15px' }} >
                    <Tooltip title={handsData?.handsOnTypeId === HANDS_RECORD_TYPE ? `O hands-on ao vivo aconteceu no dia ${format(parse(moduleClass.limitDate, 'yyyy-MM-dd\'T\'HH:ss:mm', new Date()), 'dd-MM-yyyy')}!` : ''}>
                        <Box>
                            <ClassNotepad
                                isAllowed={handsData?.handsOnTypeId === HANDS_LIVE_TYPE}
                                isCompleted={null}
                                isSelected={false}
                                contentId={1}
                                contentType={LIVE_CONTENT_TYPE}
                                contentName={"Participe ao vivo do Hands-On"}
                            />
                        </Box>
                    </Tooltip>
                    <Tooltip title={handsData?.handsOnTypeId !== HANDS_RECORD_TYPE ? `A gravação do hands-on ainda não foi disponibilizada!` : ''}>
                        <Box>
                            <ClassNotepad
                                isAllowed={handsData?.handsOnTypeId === HANDS_RECORD_TYPE}
                                isCompleted={null}
                                isSelected={false}
                                contentId={2}
                                contentType={RECORD_CONTENT_TYPE}
                                contentName={"Assista à gravação do Hands-On"}
                            />
                        </Box>
                    </Tooltip>
                </Box>
            </Box>
        </Box>
    );
};

export default OHandsContent;