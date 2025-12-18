import {
    Dispatch,
    SetStateAction,
    useEffect,
    useState
} from "react";
import { format } from "date-fns";
import { Container, Box } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import { showErrorToast, showSuccessToast } from "../../../utils/toast";
import OStudentTransfer from "../../organisms/OStudentTransfer/OStudentTransfer";
import AArrowButton from "../../atoms/AArrowButton/AArrowButton";
import {
    ResponsePagination,
    IAgentClass,
    StudentClassListPagination,
    IStudentClassData,
    ClassStudent
} from "../../../interfaces/teams/class.interfaces";
import {
    IStudentClassTrace,
    IStudentTransferDto,
    ListOptions,
    StudentClassCache,
    IStudentTransferHistoryDto,
    IStudentTransferTraceDto
} from "../../../interfaces/student/studentTransfer.interfaces";
import { TRANSFER_OPTION } from "../../../constants/studentTransfer/studentTransfer";
import AgentClassesService from "../../../services/Teams/classes/agentClasses.service";
import TeamsService from "../../../services/Teams/teams.service";
import StudentTransferService from "../../../services/student/studentTransfer.service";
import MLoading from "../../molecules/MLoading";


const StudentTransfer = () => {
    const [pageLoading, setPageLoading] = useState<boolean>(false);
    const [agentClasses, setAgentClasses] = useState<IAgentClass[]>([]);
    const [studentClassCache, setStudentClassCache] = useState<StudentClassCache>({});
    const [searchLoading, setSearchLoading] = useState<boolean>(true);
    const [disableTransfer, setDisableTransfer] = useState<boolean>(false);
    const [leftListOption, setLeftListOption] = useState<ListOptions>(TRANSFER_OPTION);
    const [rightListOption, setRightListOption] = useState<ListOptions>(TRANSFER_OPTION);
    const [leftAgentClass, setLeftAgentClass] = useState<IAgentClass | null>(null);
    const [rightAgentClass, setRightAgentClass] = useState<IAgentClass | null>(null);
    const [leftStudentClass, setLeftStudentClass] = useState<IStudentClassData | null>(null);
    const [rightStudentClass, setRightStudentClass] = useState<IStudentClassData | null>(null);
    const [leftStudentsTransferList, setLeftStudentsTransferList] = useState<IStudentTransferDto[]>([]);
    const [rightStudentsTransferList, setRightStudentsTransferList] = useState<IStudentTransferDto[]>([]);
    const [leftStudentsTransferHistory, setLeftStudentsTransferHistory] = useState<IStudentTransferHistoryDto[] | null>([]);
    const [rightStudentsTransferHistory, setRightStudentsTransferHistory] = useState<IStudentTransferHistoryDto[] | null>([]);

    const fetchAgentClasses = async () => {
        const agentClassesDto: ResponsePagination<IAgentClass[]> | null =
            await AgentClassesService.GetAgentClasses(1, 100, null);
        setSearchLoading(false);
        if (!agentClassesDto || !agentClassesDto.data.length)
            return showErrorToast("Erro ao obter a listagem de turmas filhas!");
        setAgentClasses(agentClassesDto.data);
    };

    useEffect(() => {
        fetchAgentClasses();
    }, []);

    const getDestinationClass = (studentTransfer: IStudentTransferDto): IStudentClassTrace | null => {
        if (!studentTransfer) {
            setDisableTransfer(false);
            return null;
        };

        if (studentTransfer.incomingTransfer) return studentTransfer.originClass;

        let destinationClass;
        if (studentTransfer.originClass.studentAgentClassId === leftAgentClass!.id)
            destinationClass = rightAgentClass;
        else
            destinationClass = leftAgentClass;

        return {
            studentManagementClassId: destinationClass!.studentClassManagementId,
            studentAgentClassId: destinationClass!.id,
            studentReferenceId: destinationClass!.studentClassReferenceId
        };
    };


    const moveStudents = (studentTransferList: IStudentTransferDto[], destinationClass: IStudentClassTrace) => {
        const [originList, setOriginList, destinationList, setDestinationList] = destinationClass.studentAgentClassId === leftAgentClass!.id
            ? [rightStudentsTransferList, setRightStudentsTransferList, leftStudentsTransferList, setLeftStudentsTransferList]
            : [leftStudentsTransferList, setLeftStudentsTransferList, rightStudentsTransferList, setRightStudentsTransferList];
    
        const filteredOriginList = originList.filter(
            originStudent => !studentTransferList.some(
                transferStudent =>
                    transferStudent.studentId === originStudent.studentId &&
                    transferStudent.originClass.studentAgentClassId === originStudent.originClass.studentAgentClassId
            )
        );
    
        const newDestinationList = [...destinationList, ...studentTransferList];
    
        setOriginList(filteredOriginList);
        setDestinationList(newDestinationList);
    };

    const studentsTransfer = (studentTransferList: IStudentTransferDto[]) => {
        setDisableTransfer(true);

        const leftStudentToBeMoved = studentTransferList.filter(student => student.isChecked)[0];
        const destinationClass = getDestinationClass(leftStudentToBeMoved);

        if (!destinationClass) return;

        const studentsToMove = [];
        for (const student of studentTransferList) {
            const { isChecked, incomingTransfer } = student;
            if (!isChecked) continue;
            student.isChecked = false;
            student.destinationClass = incomingTransfer ? null : getDestinationClass(student);
            student.incomingTransfer = !incomingTransfer;
            studentsToMove.push(student);
        };

        moveStudents(studentsToMove, destinationClass);
        setDisableTransfer(false);
    };

    const mappingStudentsTransferDto = (
        originClass: IStudentClassTrace,
        studentsList: ClassStudent[]
    ): IStudentTransferDto[] =>
        studentsList.map((student: ClassStudent) => { return {
            ...student,
            isChecked: false,
            incomingTransfer: false,
            originClass,
            destinationClass: null
        } });

    const createStudentsTransferList = (
        agentClass: IAgentClass,
        classStudents: ClassStudent[],
        setStudentsTransferList: Dispatch<SetStateAction<IStudentTransferDto[]>>
    ) => {
        const originClass = {
            studentManagementClassId: agentClass.studentClassManagementId,
            studentAgentClassId: agentClass.id,
            studentReferenceId: agentClass.studentClassReferenceId
        } as IStudentClassTrace;
        const studentsTransferDto: IStudentTransferDto[] = 
            mappingStudentsTransferDto(originClass, classStudents);
        setStudentsTransferList(studentsTransferDto);
    };

    const fetchStudentClass =
        async (
            agentClass: IAgentClass,
            setStudentClass: Dispatch<SetStateAction<IStudentClassData | null>>,
            setStudentsTransferList: Dispatch<SetStateAction<IStudentTransferDto[]>>
        ) => {
            const { studentClassReferenceId } = agentClass;

            const studentClassDto: StudentClassListPagination | null =
                await TeamsService
                    .getTeamById(studentClassReferenceId);
            if (!studentClassDto) {
                return showErrorToast(
                    `Erro ao obter a listagem de alunos da turma filha ${agentClass.name}!`
                );
            };
            const studentClass: IStudentClassData = studentClassDto.results[0];
            setStudentClass(studentClass);
            createStudentsTransferList(agentClass, studentClass.classStudents, setStudentsTransferList);
            setStudentClassCache(
                (StudentClassesCache: StudentClassCache) => ({
                    ...StudentClassesCache,
                    [studentClassReferenceId]: studentClassDto.results[0]
                })
            );
    };
    
    const resetTransfersList = () => {
        if (leftAgentClass) {
            const leftStudentClass = studentClassCache[leftAgentClass.studentClassReferenceId];
            if (leftStudentClass)
                createStudentsTransferList(leftAgentClass, leftStudentClass.classStudents, setLeftStudentsTransferList);
        };

        if (rightAgentClass) {
            const rightStudentClass = studentClassCache[rightAgentClass.studentClassReferenceId];
            if (rightStudentClass)
                createStudentsTransferList(rightAgentClass, rightStudentClass.classStudents, setRightStudentsTransferList);
        };
    };

    const fetchStudentClassTransferHistory = async (
        studentClassName: string, 
        studentClassId: number,
        setStudentsTransferHistory: Dispatch<SetStateAction<IStudentTransferHistoryDto[] | null>>
    ) => {
        const studentClassTransferHistory: IStudentTransferHistoryDto[] | null =
            await StudentTransferService.GetStudentClassTransferHistory(studentClassId);
        if (!studentClassTransferHistory) showErrorToast(
            `Erro ao obter o histórico de transferências da turma filha ${studentClassName}`
        );
        setStudentsTransferHistory(studentClassTransferHistory);
    };

    const handleSelectAgentClass = async (
        selectedAgentClass: IAgentClass | null,
        setAgentClass: Dispatch<SetStateAction<IAgentClass | null>>,
        setStudentClass: Dispatch<SetStateAction<IStudentClassData | null>>,
        setStudentsLoading: Dispatch<SetStateAction<boolean>>,
        setStudentsTransferList: Dispatch<SetStateAction<IStudentTransferDto[]>>,
        setStudentsTransferHistory: Dispatch<SetStateAction<IStudentTransferHistoryDto[] | null>>
    ) => {
        resetTransfersList();

        setAgentClass(selectedAgentClass);
        setStudentClass(null);
        setStudentsTransferList([]);
        setStudentsTransferHistory([]);

        if (!selectedAgentClass) return;
        const studentClassFromCache = studentClassCache[selectedAgentClass.studentClassReferenceId];
        if (studentClassFromCache) {
            createStudentsTransferList(
                selectedAgentClass,
                studentClassFromCache.classStudents,
                setStudentsTransferList
            );
            setStudentClass(studentClassFromCache);

            setStudentsLoading(true);
            
            await fetchStudentClassTransferHistory(
                selectedAgentClass.name,
                selectedAgentClass.studentClassReferenceId,
                setStudentsTransferHistory
            );

            setStudentsLoading(false);

            return;
        };

        setStudentsLoading(true);
        await Promise.all([
            fetchStudentClass(
                selectedAgentClass,
                setStudentClass,
                setStudentsTransferList
            ),
            fetchStudentClassTransferHistory(
                selectedAgentClass.name,
                selectedAgentClass.studentClassReferenceId,
                setStudentsTransferHistory
            )
        ]);
        setStudentsLoading(false);
    };

    const getMaxTransferHistoryId = () => {
        const ascLeftHistory = leftStudentsTransferHistory ? 
            leftStudentsTransferHistory.sort((a, b) => b.transferHistoryId - a.transferHistoryId) : [];
        const ascRightHistory = rightStudentsTransferHistory ?
            rightStudentsTransferHistory!.sort((a, b) => b.transferHistoryId - a.transferHistoryId) : [];
        return Math.max(
            ascLeftHistory.length === 0 ? -1 : ascLeftHistory[0].transferHistoryId,
            ascRightHistory.length === 0 ? -1 : ascRightHistory[0].transferHistoryId
        );
    };

    const updateTransferHistory = (studentsTransferred: IStudentTransferDto[]) => {
        let maxTransferHistoryId = getMaxTransferHistoryId();

        const leftStudentsTransferred: IStudentTransferDto[] = studentsTransferred.filter(el =>
            (el.originClass.studentReferenceId === leftAgentClass!.studentClassReferenceId) ||
            (el.destinationClass?.studentReferenceId === leftAgentClass!.studentClassReferenceId)
        );
        const rightStudentsTransferred: IStudentTransferDto[] = studentsTransferred.filter(el =>
            (el.originClass.studentReferenceId === rightAgentClass!.studentClassReferenceId) ||
            (el.destinationClass?.studentReferenceId === rightAgentClass!.studentClassReferenceId)
        );

        const leftStudentsHistory: IStudentTransferHistoryDto[] = leftStudentsTransferred.map(el => { return {
            transferHistoryId: ++maxTransferHistoryId,
            studentClassId: leftAgentClass!.studentClassReferenceId,
            studentId: el.studentId,
            studentName: el.studentName,
            studentClassOriginId: el.originClass.studentReferenceId,
            studentClassOriginName:
                el.originClass.studentAgentClassId === leftAgentClass!.id ?
                leftAgentClass!.name : rightAgentClass!.name,
            studentClassDestinationId: el.destinationClass!.studentReferenceId,
            studentClassDestinationName:
                el.destinationClass!.studentAgentClassId === leftAgentClass!.id ?
                leftAgentClass!.name : rightAgentClass!.name,
            transferedAt: format(new Date(), 'dd/MM/yyyy HH:mm:ss')
        } });

        setLeftStudentsTransferHistory([...leftStudentsTransferHistory ?? [], ...leftStudentsHistory]);

        const rightStudentsHistory: IStudentTransferHistoryDto[] = rightStudentsTransferred.map(el => { return {
            transferHistoryId: ++maxTransferHistoryId,
            studentClassId: rightAgentClass!.studentClassReferenceId,
            studentId: el.studentId,
            studentName: el.studentName,
            studentClassOriginId: el.originClass.studentReferenceId,
            studentClassOriginName:
                el.originClass.studentAgentClassId === rightAgentClass!.id ?
                rightAgentClass!.name : leftAgentClass!.name,
            studentClassDestinationId: el.destinationClass!.studentReferenceId,
            studentClassDestinationName:
                el.destinationClass!.studentAgentClassId === rightAgentClass!.id ?
                rightAgentClass!.name : leftAgentClass!.name,
            transferedAt: format(new Date(), 'dd/MM/yyyy HH:mm:ss')
        } });
        
        setRightStudentsTransferHistory([...rightStudentsTransferHistory ?? [], ...rightStudentsHistory]);
    };

    const switchDestinationToOrigin = (studentTransfer: IStudentTransferDto): IStudentTransferDto => {
        if (!studentTransfer.incomingTransfer || !studentTransfer.destinationClass) return studentTransfer;
        const { studentManagementClassId, studentAgentClassId, studentReferenceId } = studentTransfer.destinationClass;
        studentTransfer.originClass = { studentManagementClassId, studentAgentClassId, studentReferenceId };
        studentTransfer.destinationClass = null;
        studentTransfer.incomingTransfer = false;
        return studentTransfer;
    };

    const updateTransferList = () => {
        setLeftStudentsTransferList(leftStudentsTransferList.map(el => switchDestinationToOrigin(el))); //estudante
        setRightStudentsTransferList(rightStudentsTransferList.map(el => switchDestinationToOrigin(el)));
    };

    const updateStudentClassCache = () => {
        leftStudentClass!.classStudents = leftStudentsTransferList;
        rightStudentClass!.classStudents = rightStudentsTransferList;
        setStudentClassCache({
            ...studentClassCache,
            [leftStudentClass!.studentClassId]: leftStudentClass,
            [rightStudentClass!.studentClassId]: rightStudentClass,
        });
    };

    const postTransferStudents = async () => {
        setPageLoading(true);
        const studentsToTransfer = [
            ...leftStudentsTransferList.filter(el => el.incomingTransfer),
            ...rightStudentsTransferList.filter(el => el.incomingTransfer)
        ];
        const studentsTransferTraceDto: IStudentTransferTraceDto[] = studentsToTransfer.map(el => { return {
            studentClassOriginId: el.originClass.studentReferenceId,
            studentClassDestinationId: el.destinationClass!.studentReferenceId,
            studentId: el.studentId
        } });
        const transferResponse = await StudentTransferService.PostStudentsTransfer(studentsTransferTraceDto);
        if (!transferResponse) return showErrorToast(
            'Erro ao processar as transferências, por favor recarregue a página e tente novamente!'
        );
        updateTransferHistory(studentsToTransfer);
        updateTransferList();
        updateStudentClassCache();
        showSuccessToast('Transferências realizadas com sucesso!');
        setPageLoading(false);
    };

    return (
        <Container
            style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '10px'
            }}
        >
            {pageLoading && <MLoading />}
            <OStudentTransfer
                listOption={leftListOption}
                setListOption={setLeftListOption}
                searchLoading={searchLoading}
                studentClass={leftStudentClass}
                agentClasses={agentClasses}
                anotherAgentClass={rightAgentClass}
                agentClass={leftAgentClass}
                setStudentClass={setLeftStudentClass}
                setAgentClass={setLeftAgentClass}
                handleSelectAgentClass={handleSelectAgentClass}
                studentsTransferList={leftStudentsTransferList}
                studentsTransferHistory={leftStudentsTransferHistory}
                setStudentsTransferList={setLeftStudentsTransferList}
                setStudentsTransferHistory={setLeftStudentsTransferHistory}
            />
            {
                (leftListOption === TRANSFER_OPTION && rightListOption === TRANSFER_OPTION) &&
                (leftStudentClass && rightStudentClass) &&
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap:'10px',
                        color: 'white'
                    }}
                >
                    <AArrowButton
                        arrowSide='right'
                        disabled={disableTransfer || leftStudentsTransferList.every(student => !student.isChecked)}
                        studentsTransferList={leftStudentsTransferList}
                        handleStudentTransfer={studentsTransfer}
                    />
                    <AArrowButton
                        arrowSide='left'
                        disabled={disableTransfer || rightStudentsTransferList.every(student => !student.isChecked)}
                        studentsTransferList={rightStudentsTransferList}
                        handleStudentTransfer={studentsTransfer}
                    />
                     <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            bgcolor: [...leftStudentsTransferList, ...rightStudentsTransferList].some(el => el.incomingTransfer)
                                ? 'orange' : '#DDDDDD',
                            padding: '10px',
                            borderRadius: '5px',
                            cursor: [...leftStudentsTransferList, ...rightStudentsTransferList].some(el => el.incomingTransfer)
                                ? 'pointer' : 'not-allowed'
                        }}
                        onClick={() => {
                            if (
                                [...leftStudentsTransferList, ...rightStudentsTransferList].some(el => el.incomingTransfer)
                            )
                                postTransferStudents();
                        }}
                    >
                        <SaveIcon />
                    </Box>
                </Box>
            }
            <OStudentTransfer
                listOption={rightListOption}
                setListOption={setRightListOption}
                searchLoading={searchLoading}
                agentClasses={agentClasses}
                studentClass={rightStudentClass}
                anotherAgentClass={leftAgentClass}
                agentClass={rightAgentClass}
                setStudentClass={setRightStudentClass}
                setAgentClass={setRightAgentClass}
                handleSelectAgentClass={handleSelectAgentClass}
                studentsTransferList={rightStudentsTransferList}
                studentsTransferHistory={rightStudentsTransferHistory}
                setStudentsTransferList={setRightStudentsTransferList}
                setStudentsTransferHistory={setRightStudentsTransferHistory}
            />
        </Container>
    );
};

export default StudentTransfer;