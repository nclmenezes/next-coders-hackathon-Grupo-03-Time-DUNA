import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import MLoading from "../../molecules/MLoading";
import { Box, Button, Chip, IconButton } from "@mui/material";
import teamsService from "../../../services/Teams/teams.service";
import HandsOnService from "../../../services/HandsOn/handsOn.service";
import { IHandsOnAttendanceDto, IHandsOnDto, ContentHandsOnTrail, ContentHandsOnModule } from "../../../interfaces/teams/handsOn.interfaces";
import { PageHeader } from "../../pages/Candidate/styles";
import { showErrorToast } from "../../../utils/toast";
import { toast } from "react-hot-toast";
import { MTableGrid } from "../../molecules/MGrid/MTableGrid";
import { useNavigate } from "react-router";
import { format } from "date-fns";
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import { OTrialDetail } from "../../organisms/OTrail/OTrialDetail";
import { StudentSubModuleDetail, Class, SubModule } from "../../../interfaces/student/studentModule.interfaces";
import { parseISO, addDays } from "date-fns";
import trailService from "../../../services/api/classes/trail.service";
import studentService from "../../../services/student/student.service";
import { Trail, Module } from "../../../interfaces/courses/responses/Course";

const TABLE_HEAD = [
    {
        title: "Aula",
        field: "module",
    },
    {
        title: "Seção",
        field: "submodule",
    },
    {
        title: "Nota",
        field: "grade",
    },
    {
        title: "Visualizar Prova",
        field: "trial",
    },
    {
        title: "Presença",
        field: "presence",
    },
    {
        title: "Data",
        field: "date",
    },
];

function TStudentTeamDetail() {
    const navigate = useNavigate();
    const { studentId, studentTeamId, moduleId } = useParams<string>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [classInfo, setClassInfo] = useState<Class | null>(null);
    const [studentSubModules, setStudentSubModules] = useState<SubModule[] | null>(null);
    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [openModalTrial, setOpenModalTrial] = useState<boolean>(false);
    const [currentAssessmentId, setCurrentAssessmentId] = useState<number>(0);

    const handlePaginationClick = (_: unknown, newPage: number) => setPage(newPage);

    useEffect(() => {
        setIsLoading(true);
        fetchData();
    }, [studentId, studentTeamId, moduleId]);

    const mappingHandsOnByModule = (handsOnListByTrailId: IHandsOnDto[]): ContentHandsOnModule[] => {
        let handsOnListByModuleId: ContentHandsOnModule[] = [];
        handsOnListByTrailId?.[0]?.contentHandsOnTrails?.forEach((contentHandsOnTrail: ContentHandsOnTrail) => {
            contentHandsOnTrail.contentHandsOnModules.forEach((contentHandsOnModule: ContentHandsOnModule) => {
                handsOnListByModuleId.push(contentHandsOnModule);
            })
        });
        return handsOnListByModuleId;
    };

    const insertHandsOnAttendance = async (subModules: SubModule[], handsOnListByModuleId: ContentHandsOnModule[]) => {
        const handsOn = handsOnListByModuleId.find((_handsOnListByModuleId: ContentHandsOnModule) => _handsOnListByModuleId.moduleId === Number(moduleId));
        const handsOnSubModule = subModules.find((_subModule: SubModule) => _subModule.subModuleTypeId === 2);

        if (!handsOn || !handsOnSubModule) {
            showErrorToast("Não foi possível realizar a busca dos registros!");
            return subModules;
        };

        if (!handsOn.register) {
            handsOnSubModule.handsOnRegister = false;
            return subModules;
        };

        handsOnSubModule.handsOnRegister = true;

        const studentHandsOnAttendanceDto: IHandsOnAttendanceDto[] = [
            {
                contentId: handsOn.contentId,
                studentId: Number(studentId),
                presence: true
            }
        ];

        const studentHandsOnAttendance: IHandsOnAttendanceDto[] = await HandsOnService.getHandsOnAttendance(studentHandsOnAttendanceDto);

        handsOnSubModule.studentAttendance = studentHandsOnAttendance[0].presence ? 100 : 0;

        return subModules;
    };

    const mappingSubModulesOrder = (trails: Trail[], subModules: SubModule[]): SubModule[] => {
        const trailModules: Module[] = trails.flatMap((trail: Trail) => trail.modules);
        const trailSubModules = trailModules.flatMap((module: Module) => module.subModules);
        const selectedTrailSubModules = trailSubModules.filter(subModule => subModule.moduleId === Number(moduleId));

        subModules.forEach((_subModule: SubModule) => {
            const trailSubModule = selectedTrailSubModules
                .find(selectedTrailSubModule => selectedTrailSubModule.name === _subModule.subModuleModuleName);
            if (!trailSubModule) return _subModule;
            _subModule.orderNumber = trailSubModule.orderNumber;
            return _subModule;
        });

        return subModules;
    };

    const fetchData = async () => {
        try {
            const studentSubModuleDetail: StudentSubModuleDetail | null = await teamsService.getStudentByTeamId(Number(studentTeamId), Number(studentId));
            const handsOnListByTrailId: IHandsOnDto[] | null = await HandsOnService.getHandsOn(Number(studentTeamId));

            const classData = await studentService.GetTeamByStudentClassId(Number(studentTeamId));
            if (!classData) return showErrorToast("Não foi possível realizar a busca dos registros!");

            const trails = await trailService.GetAllByCourse(classData.trailId);

            if (!studentSubModuleDetail || !handsOnListByTrailId || !trails)
                return showErrorToast("Não foi possível realizar a busca dos registros!");

            const handsOnByModule: ContentHandsOnModule[] = mappingHandsOnByModule(handsOnListByTrailId);

            let subModules: SubModule[] = studentSubModuleDetail.results[0].classStudents[0].subModules
                .filter((_subModule: SubModule) => _subModule.moduleId === Number(moduleId));

            if (subModules.some((_subModule: SubModule) => _subModule.subModuleTypeId === 2))
                subModules = await insertHandsOnAttendance(subModules, handsOnByModule);

            subModules = mappingSubModulesOrder(trails, subModules);

            setStudentSubModules(subModules);
            setClassInfo(studentSubModuleDetail.results[0]);
            setTotalPages(studentSubModuleDetail.totalPages);
        } catch (error: any) {
            toast.error(error.message)
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        };
    };

    const sortSubModules = (a: SubModule, b: SubModule) => {
        if (!a.orderNumber || !b.orderNumber) return 0;
        return a.orderNumber - b.orderNumber;
    };

    const handleBackButton = () => {
        navigate(`/teamsDetail/${studentId}/${studentTeamId}`);
    };

    const handleTrialOpen = (assessmentId: number) => {
        setCurrentAssessmentId(assessmentId);
        setOpenModalTrial(true);
    };

    const handleTrialClose = () => {
        setOpenModalTrial(false);
    };

    const handleHandsOnPresenceChip = (subModule: SubModule) => {
        const limitDate = parseISO(subModule.limitDate);
        const today = new Date();

        if (!subModule.handsOnRegister)
            return <Chip label="hands on não registrado" size="small" />;

        if (limitDate > today)
            return <Chip label="hands on ainda não realizado" size="small" />;

        if (subModule.studentAttendance === 100)
            return <Chip label="presente" color="success" size="small" />;

        if (today <= addDays(limitDate, 2))
            return <Chip label="presença não registrada" size="small" />;

        return <Chip label="falta" color="error" size="small" />;
    }

    const handlePresenceChip = (subModule: SubModule) => {
        if (subModule.subModuleTypeId === 2)
            return handleHandsOnPresenceChip(subModule);

        if (subModule.moduleTypeId === 2)
            return (subModule.subModuleGrade == null || subModule.subModuleGrade < 0) ?
                <Chip label="prova ainda não realizada" size="small" /> :
                <Chip label="prova realizada" color="success" size="small" />

        if (!subModule.limitDate || new Date(subModule.limitDate) > new Date())
            return <Chip label="aula ainda não realizada" size="small" />

        if (subModule.lastDate && (new Date(subModule.limitDate) >= new Date(subModule.lastDate)))
            return (subModule.subModuleGrade == null || subModule.subModuleGrade < 0) ?
                <Chip label="falta" color="error" size="small" /> :
                <Chip label="presente" color="success" size="small" />
        return <Chip label="falta" color="error" size="small" />
    };

    return (
        <Box>
            <PageHeader>
                <h1>Gestão de Turma</h1>
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
                        <Button
                            variant="contained"
                            sx={{ minWidth: 160, marginBottom: 2 }}
                            onClick={handleBackButton}>
                            Voltar
                        </Button>
                        <MTableGrid
                            tableHead={TABLE_HEAD}
                            tableRows={studentSubModules?.sort(sortSubModules).map((subModule: SubModule) => {
                                return {
                                    module: <div>{subModule.moduleName}</div>,
                                    submodule: <div style={{ fontWeight: 'bold' }}>{subModule.subModuleModuleName}</div>,
                                    presence: <div>{handlePresenceChip(subModule)}</div>,
                                    grade: <div>{subModule.subModuleGrade != null ? subModule.subModuleGrade.toFixed(1) : null}</div>,
                                    date:
                                        subModule.assessmentId ?
                                            <div>{subModule.lastDate ? format(new Date(subModule.lastDate), 'yyyy-MM-dd HH:mm:ss') : "-"}</div> :
                                            <div>{subModule.limitDate ? format(new Date(subModule.limitDate), 'yyyy-MM-dd') : "-"}</div>,
                                    trial:
                                        <div>
                                            <IconButton disabled={subModule.subModuleGrade == null}>
                                                <ContentPasteIcon sx={{
                                                    opacity: subModule.subModuleGrade == null ? 0.5 : 1,
                                                    cursor: subModule.subModuleGrade == null ? "not-allowed" : "pointer"
                                                }}
                                                                  onClick={() => subModule.assessmentId ? handleTrialOpen(subModule.assessmentId) : null}
                                                />
                                            </IconButton>
                                        </div>
                                }
                            })}
                            paginationConfig={{
                                page,
                                totalPages,
                            }}
                            paginationCallback={handlePaginationClick}
                        />

                        <OTrialDetail
                            open={openModalTrial}
                            onClose={handleTrialClose}
                            assessmentId={currentAssessmentId}
                            studentId={studentId === undefined ? 0 : Number(studentId)}
                        />
                    </Box>

                </>
            )}
        </Box>
    );
}

export default TStudentTeamDetail;
