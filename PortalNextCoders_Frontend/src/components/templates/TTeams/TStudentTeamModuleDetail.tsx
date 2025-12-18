import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import MLoading from "../../molecules/MLoading";
import { Box, Button, Chip } from "@mui/material";
import teamsService from "../../../services/Teams/teams.service";
import { StudentSubModuleDetail, Class, Module } from "../../../interfaces/student/studentModule.interfaces";
import { PageHeader } from "../../pages/Candidate/styles";
import { showErrorToast } from "../../../utils/toast";
import { toast } from "react-hot-toast";
import { MTableGrid } from "../../molecules/MGrid/MTableGrid";
import { useNavigate } from "react-router";
import { addDays, format, parseISO, isSameDay, isBefore, startOfDay, parse } from "date-fns";
import { useAuth } from "../../../context/AuthProvider/useAuth";
import { UserRoleEnum } from "../../../enums";
import HandsOnService from "../../../services/HandsOn/handsOn.service";
import { IHandsOnAttendanceDto, IHandsOnDto, ContentHandsOnTrail, ContentHandsOnModule } from "../../../interfaces/teams/handsOn.interfaces";
import { TStudentTeamModuleDetailPage } from "../../../interfaces/teams/studentTeamDetail";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GroupIcon from '@mui/icons-material/Group';
import trailService from "../../../services/api/classes/trail.service";
import studentService from "../../../services/student/student.service";
import { Trail } from "../../../interfaces/courses/responses/Course";

function TStudentTeamModuleDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as TStudentTeamModuleDetailPage;
    const { user } = useAuth();
    const { studentId, studentTeamId } = useParams<string>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [studentModules, setStudentModules] = useState<Module[] | null>(null);
    const [classInfo, setClassInfo] = useState<Class | null>(null);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [page, setPage] = useState<number>(0);

    const handlePaginationClick = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    useEffect(() => {
        if (state && state.studentModulesData && state.classInfoData && state.totalPagesData) {
            setStudentModules(state.studentModulesData);
            setClassInfo(state.classInfoData);
            setTotalPages(state.totalPagesData);
            return setIsLoading(false);
        };
        setIsLoading(true);
        fetchData();
    }, [studentId, studentTeamId]);

    const mappingHandsOnByModule = (handsOnListByTrailId: IHandsOnDto[]): ContentHandsOnModule[] => {
        let handsOnListByModuleId: ContentHandsOnModule[] = [];
        handsOnListByTrailId?.[0]?.contentHandsOnTrails?.forEach((contentHandsOnTrail: ContentHandsOnTrail) => {
            contentHandsOnTrail.contentHandsOnModules.forEach((contentHandsOnModule: ContentHandsOnModule) => {
                handsOnListByModuleId.push(contentHandsOnModule);
            })
        });
        return handsOnListByModuleId;
    };

    const getHandsOnAttendance = async (contentsId: number[], studentId: number) => {
        const studentHandsOnAttendanceDto: IHandsOnAttendanceDto[] = [];

        for (const contentId of contentsId) studentHandsOnAttendanceDto.push(
            {
                contentId,
                studentId,
                presence: true
            }
        );

        return await HandsOnService.getHandsOnAttendance(studentHandsOnAttendanceDto);
    };

    const insertHandsOnAttendance = async (modules: Module[], handsOnListByModuleId: ContentHandsOnModule[]) => {
        const handsOnRegisteredContentsId: number[] = handsOnListByModuleId
            .filter((handsOnByModule: ContentHandsOnModule) => handsOnByModule.register)
            .map((handsOnByModule: ContentHandsOnModule) => handsOnByModule.contentId);

        const studentIdToFetch = user?.role === UserRoleEnum.student ? user.id : Number(studentId);
        if (!studentIdToFetch) {
            return modules;
        }

        const studentHandsOnAttendance: IHandsOnAttendanceDto[] = await getHandsOnAttendance(handsOnRegisteredContentsId, studentIdToFetch);

        modules.map((module: Module) => {
            const handsOn = handsOnListByModuleId.find((handsOnByModule: ContentHandsOnModule) => handsOnByModule.moduleId === module.moduleId);
            if (!handsOn) return module;
            if (!handsOn.register) {
                module.handsOnRegister = false;
                return module;
            };
            module.handsOnRegister = true;
            const handsOnAttendance = studentHandsOnAttendance
                .find((_handsOnAttendance: IHandsOnAttendanceDto) => _handsOnAttendance.contentId === handsOn.contentId);
            module.studentAttendance = handsOnAttendance?.presence ? 100 : 0;
        });

        return modules;
    };

    const mappingModulesOrderByModuleId = (trails: Trail[]): { [key: number]: { [key: string]: number } } => {
        const modulesOrder: { [key: number]: { [key: string]: number } } =
            trails.reduce((acc, trail: Trail) => {
                trail.modules.forEach(module => {
                    const { moduleId, orderNumber } = module;
                    acc[moduleId] = {
                        trailOrder: trail.orderNumber,
                        moduleOrder: orderNumber
                    };
                    return acc;
                });
                return acc;
            }, {} as { [key: number]: { [key: string]: number } });

        return modulesOrder;
    };

    const insertModulesOrder = (modules: Module[], modulesOrder: { [key: number]: { [key: string]: number } }): Module[] => {
        modules.forEach((module: Module) => {
            module.trailOrder = modulesOrder[module.moduleId].trailOrder;
            module.moduleOrder = modulesOrder[module.moduleId].moduleOrder;
        });

        return modules;
    };

    const fetchData = async () => {
        try {
            const studentIdToFetch = user?.role === UserRoleEnum.student ? user.id : Number(studentId);
            if (!studentIdToFetch) {
                setIsLoading(false);
                return;
            }
            const studentSubModuleDetail: StudentSubModuleDetail | null = await teamsService.getStudentByTeamId(Number(studentTeamId), studentIdToFetch);
            const handsOnListByTrailId: IHandsOnDto[] | null = await HandsOnService.getHandsOn(Number(studentTeamId));

            const classData = await studentService.GetTeamByStudentClassId(Number(studentTeamId));
            if (!classData) return showErrorToast("Não foi possível realizar a busca dos registros!");

            const trails = await trailService.GetAllByCourse(classData.trailId);
            if (!studentSubModuleDetail || !handsOnListByTrailId || !trails)
                return showErrorToast("Não foi possível realizar a busca dos registros!");

            const modulesOrder: { [key: number]: { [key: string]: number } } = mappingModulesOrderByModuleId(trails);
            const handsOnByModule: ContentHandsOnModule[] = classData.id !== 73 ? mappingHandsOnByModule(handsOnListByTrailId) : [];
            let modules: Module[] = studentSubModuleDetail.results[0].classStudents[0].modules;
            modules = classData.id !== 73 ? await insertHandsOnAttendance(modules, handsOnByModule) : modules;

            modules = insertModulesOrder(modules, modulesOrder);

            setStudentModules(modules);
            setClassInfo(studentSubModuleDetail.results[0]);
            setTotalPages(studentSubModuleDetail.totalPages);
        } catch (error: any) {
            toast.error(error.message)
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        };
    };

    const sortModules = (a: Module, b: Module) => {
        if (!a.moduleOrder || !a.trailOrder || !b.moduleOrder || !b.trailOrder) return 0;
        if (a.trailOrder !== b.trailOrder) return a.trailOrder - b.trailOrder;
        return a.moduleOrder - b.moduleOrder;
    };

    const TABLE_HEAD = [
        {
            title: "Aula",
            field: "module",
        },
        {
            title: "Nota",
            field: "grade",
        },
        {
            title: "Presença da aula",
            field: "presence",
        },
        {
            title: "Data da presença",
            field: "date",
        },
        {
            title: "Presença do Hands On",
            field: "handsOnPresence",
        },
        {
            title: "Data do Hands On",
            field: "handsOnDate",
        }
    ];

    const handleBackButton = () => {
        if (user?.role === UserRoleEnum.student) {
            return navigate(`/bonus`);
        }
        navigate(`/teams/detail/${Number(studentTeamId)}`);
    };

    const handlePresenceChip = (module: Module) => {
        if (module.moduleTypeId === 2)
            return (module.subModuleGrade == null || module.subModuleGrade < 0) ?
                <Chip label="prova planejada" size="small" /> :
                <Chip label="prova finalizada" color="success" size="small" />
                
        const limitDateStartOfDay = startOfDay(parseISO(module.limitDate));
        const todayStartOfDay = startOfDay(new Date());

        if (isSameDay(limitDateStartOfDay, todayStartOfDay)) {
            if (!module.isCompleted) return <Chip label="aula em andamento" size="small" />;
            return <Chip label="presente" color="success" size="small" />;
        };

        if (isBefore(todayStartOfDay, limitDateStartOfDay))
            return <Chip label="aula planejada" size="small" />;
        
        if (module.lastDate === null && module.limitDate === null) return <Chip label="aula planejada" size="small" />;
        
        if (module.lastDate && parseISO(module.limitDate) >= parseISO(module.lastDate))
            return (!module.subModuleGrade || module.subModuleGrade < 0) ? <Chip label="falta" color="error" size="small" /> :
                <Chip label="presente" color="success" size="small" />;
        
        if (module.studentAttendance === 100 && module.lastDate && parseISO(module.limitDate) >= parseISO(module.lastDate)) {
            return <Chip label="presente" color="success" size="small" />;
        }

        return <Chip label="falta" color="error" size="small" />
    };

    const handleHandsOnPresenceChip = (module: Module) => {
        const limitDate = parseISO(module.limitDate);
        const today = new Date();

        if (module.handsOnRegister === undefined) return "-";

        if (!module.handsOnRegister)
            return <Chip label="hands on não registrado" size="small" />;

        if (isSameDay(limitDate, today))
            return <Chip label="hands on de hoje" size="small" />;

        if (limitDate > today)
            return <Chip label="hands on ainda não realizado" size="small" />;

        if (module.studentAttendance === 100)
            return <Chip label="presente" color="success" size="small" />;

        if (today <= addDays(limitDate, 2))
            return <Chip label="presença não registrada" size="small" />;

        return <Chip label="falta" color="error" size="small" />;
    };

    const handleCandidateClick = (studentSubModuleId: number) =>
        navigate(`/teams/${Number(studentId)}/${Number(studentTeamId)}/${studentSubModuleId}`);

    return (
        <Box>
            <PageHeader>
                {user?.role === UserRoleEnum.student ? <h1>Relatório de notas e faltas</h1> : <h1>Gestão de Turma</h1>}
            </PageHeader>

            {isLoading ? (
                <MLoading />
            ) : (
                <>
                    <Box
                        sx={{
                            border: "1px solid black",
                            borderRadius: 2,
                            p: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            my: 2,
                        }}
                    >
                        {classInfo && classInfo.studentClassId && (
                            <Box
                                key={classInfo.studentClassId}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    fontFamily: "Inter",
                                    gap: 1,
                                }}
                            >
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Box sx={{
                                        color: '#4263EB',
                                        fontFamily: 'Inter',
                                        fontWeight: 'bold'
                                    }}>Turma: {classInfo.name}</Box>
                                    <Box
                                        sx={{ fontFamily: 'Inter', fontWeight: 'bold' }}>Início: {classInfo.startAt}</Box>
                                    <Box sx={{ fontFamily: 'Inter', fontWeight: 'bold' }}>Final: {classInfo.endAt}</Box>
                                </Box>
                                <Box sx={{ display: 'flex', fontFamily: 'Inter', gap: 2 }}>
                                    <Box sx={{
                                        fontFamily: 'Inter',
                                        fontWeight: 'bold'
                                    }}>Nome: {classInfo.classStudents[0].studentName}</Box>
                                    <Box sx={{
                                        fontFamily: 'Inter',
                                        fontWeight: 'bold'
                                    }}>Presença: {classInfo.classStudents[0].studentAttendance.toFixed(1)}</Box>
                                    <Box sx={{
                                        fontFamily: 'Inter',
                                        fontWeight: 'bold'
                                    }}>Nota: {classInfo.classStudents[0].studentGrade !== null ? classInfo.classStudents[0].studentGrade.toFixed(1) : null}</Box>
                                </Box>
                            </Box>
                        )}
                    </Box>
                    <Box>
                        <Box
                            sx={{
                                display: 'flex',
                                gap: '1vw'
                            }}
                        >
                            <Button
                                variant="contained"
                                sx={{ minWidth: 160, marginBottom: 2 }}
                                onClick={handleBackButton}
                                startIcon={<ArrowBackIcon />}
                            >

                                Voltar
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ minWidth: 160, marginBottom: 2 }}
                                onClick={() => navigate(`${window.location.pathname}/mentoring`, {
                                    state: {
                                        classInfo,
                                        totalPages
                                    }
                                })}
                                startIcon={<GroupIcon />}
                            >
                                Presença da mentoria
                            </Button>
                        </Box>
                        <MTableGrid
                            tableHead={TABLE_HEAD}
                            tableRows={studentModules?.sort(sortModules).map((module: Module) => ({
                                id: module.moduleId,
                                module: <div>{module.moduleName}</div>,
                                grade: <div>{(module.isCompleted && module.subModuleGrade !== null && module.subModuleGrade !== undefined) ? module.subModuleGrade.toFixed(1) : null}</div>,                                presence: <div>{handlePresenceChip(module)}</div>,
                                date: <div>{(module.isCompleted && module.lastDate) ? format(new Date(module.lastDate), 'yyyy-MM-dd HH:mm:ss') : "-"}</div>,
                                handsOnPresence: <div>{handleHandsOnPresenceChip(module)}</div>,
                                handsOnDate: module.handsOnRegister === undefined ? <div>-</div> : <div>{format(new Date(module.limitDate), 'yyyy-MM-dd')}</div>,
                            }))}
                            paginationConfig={{
                                page,
                                totalPages,
                            }}
                            paginationCallback={handlePaginationClick}
                            rowCallback={handleCandidateClick}
                        />
                    </Box>

                </>
            )}
        </Box>
    );
}

export default TStudentTeamModuleDetail;
