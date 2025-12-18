import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    Box, Button, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow,
    Autocomplete, TextField, Tooltip
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from '@mui/icons-material/Save';
import UndoIcon from '@mui/icons-material/Undo';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import MLoading from "../../molecules/MLoading";
import { IMentoringDto, IStudent, IClassData, IPeriod, IAttendanceDto } from '../../../interfaces/mentoring.interface';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import MentoringService from '../../../services/Teams/mentoring.service';
import BlockIcon from '@mui/icons-material/Block';
import DoneAllIcon from '@mui/icons-material/DoneAll';

type attendanceOptions = boolean | null;

const TTeamMentoring = () => {
    const { classId } = useParams<string>();
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as IClassData;

    const MENTORING_PERIODS: IPeriod[] = [
        {
            id: 1,
            name: "Período 1"
        },
        {
            id: 2,
            name: "Período 2"
        },
        {
            id: 3,
            name: "Período 3"
        },
        {
            id: 4,
            name: "Período 4"
        },
        {
            id: 5,
            name: "Período 5"
        },
        {
            id: 6,
            name: "Período 6"
        }
    ];

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [periods, setPeriods] = useState<IPeriod[]>(MENTORING_PERIODS);
    const [mentoring, setMentoring] = useState<IMentoringDto[]>([]);
    const [studentsBeforeChange, setStudentsBeforeChange] = useState<IStudent[]>([]);
    const [students, setStudents] = useState<IStudent[]>([]);
    const [selectedPeriod, setSelectedPeriod] = useState<IPeriod | null>(null);
    const [selectedMentoring, setSelectedMentoring] = useState<IMentoringDto | null>(null);

    const getMentoringData = async (periodId: number) => {
        setIsLoading(true);
        try {
            const mentoringData : IMentoringDto[] = await MentoringService.getMentoringByPeriod(Number(classId), periodId);
            setMentoring(mentoringData);
            setIsLoading(false);
        }
        catch (error) {
            console.error('Failed to fetch mentoring modules by period:', error);
            setIsLoading(false);
        };

    };

    useEffect(() => {
        if (!selectedPeriod) {
            setStudents([]);
            return setMentoring([]);
        };
        setSelectedMentoring(null);
        getMentoringData(selectedPeriod.id);
    }, [selectedPeriod]);

    const setSelected = (value: any, reason: string, setter: React.Dispatch<React.SetStateAction<any>>) => {
        if (reason === "removeOption") setter(null);
        setter(value);
    };

    const getStudentsAttendance = async () => {
        setIsLoading(true);
        try {
            if (!selectedMentoring ) return;
            const studentsAttendance = await MentoringService.getMentoringAttendance(selectedMentoring.id);
            const _students = state.students.map(student => {
                const studentAtt = studentsAttendance.find(el => el.studentId === student.studentId);
                student.changedAsyncAttendance = false;
                student.changedSyncAttendance = false;
                if (!studentAtt) return student;
                student.asyncConfirm = studentAtt.asyncConfirm;
                student.syncConfirm = studentAtt.syncConfirm;
                return student;
            });
            setStudentsBeforeChange(_students);
            setStudents(_students);
            setIsLoading(false);
        }
        catch (error) {
            console.error('Failed to fetch mentoring attendance:', error);
            setIsLoading(false);
        };
    };

    useEffect(() => {
        if (!selectedMentoring) return setStudents([]);
        getStudentsAttendance();
    }, [selectedMentoring]);

    const getNextAttendance = (currAttendance: attendanceOptions) : attendanceOptions => {
        if (currAttendance === null) return false;
        if (!currAttendance) return true;
        return null;
    };

    const verifyChangedAttendance = (studentId: number, nextAttendance: attendanceOptions, attendanceType: string) : boolean => {
        const attendanceBeforeChange = studentsBeforeChange.find(student => student.studentId === studentId);
        if (!attendanceBeforeChange) return false;
        if (attendanceType === "sync") return attendanceBeforeChange.syncConfirm !== nextAttendance;
        if (attendanceType === "async") return attendanceBeforeChange.asyncConfirm !== nextAttendance;
        return false;
    };

    const changeSyncPresence = (studentId: number) => {
        const _students = students.map(student => {
            if (student.studentId === studentId) {
                const nextAttendance: attendanceOptions = getNextAttendance(student.syncConfirm);
                return {
                    ...student,
                    syncConfirm: nextAttendance,
                    changedSyncAttendance: verifyChangedAttendance(studentId, nextAttendance, "sync")
                };
            }
            return student;
        });
        setStudents(_students);
    };

    const changeAsyncPresence = (studentId: number) => {
        const _students = students.map(student => {
            if (student.studentId === studentId) {
                const nextAttendance: attendanceOptions = getNextAttendance(student.asyncConfirm);
                return {
                    ...student,
                    asyncConfirm: nextAttendance,
                    changedAsyncAttendance: verifyChangedAttendance(studentId, nextAttendance, "async")
                };
            }
            return student;
        });
        setStudents(_students);
    };

    const revertPresence = () => setStudents(studentsBeforeChange);

    const savePresence = async () => {
        if (!selectedMentoring) return;
        setIsLoading(true);
        try {
            const studentsAttendance : IAttendanceDto[] = students
                .filter(student => student.changedAsyncAttendance || student.changedSyncAttendance)
                .map(
                    student =>
                    (
                        {
                            mentoringId: selectedMentoring.id,
                            studentId: student.studentId,
                            asyncConfirm: student.asyncConfirm,
                            syncConfirm: student.syncConfirm
                        }
                    )
                );
                
            const sendAttendance = await MentoringService.sendMentoringAttendance(studentsAttendance);

            if (sendAttendance.length === 0) return setIsLoading(false);

            const resetChangedStudents = students
                .map(student => 
                    {
                        student.changedAsyncAttendance = false;
                        student.changedSyncAttendance = false;
                        return student;
                    }
                );

            setStudents(resetChangedStudents);
            setStudentsBeforeChange(resetChangedStudents);

            setIsLoading(false);
        }
        catch (error) {
            console.error('Failed to post mentoring attendance:', error);
            setIsLoading(false);
        }
    };

    const changeAllSyncAttendances = () => {
        const attendance = !students.every(student => student.syncConfirm === true);
        const _students = students.map(student => {
            return {
                ...student,
                syncConfirm: attendance,
                changedSyncAttendance: verifyChangedAttendance(student.studentId, attendance, "sync")
            }
        });
        setStudents(_students);
    };

    const changeAllAsyncAttendances = () => {
        const attendance = !students.every(student => student.asyncConfirm === true);
        const _students = students.map(student => {
            return {
                ...student,
                asyncConfirm: attendance,
                changedAsyncAttendance: verifyChangedAttendance(student.studentId, attendance, "async")
            }
        });
        setStudents(_students);
    };

    const handleAttendanceIcon = (attendance: boolean | null) => {
        if (attendance === null) return <RadioButtonUncheckedIcon color='primary' />;
        if (!attendance) return <HighlightOffIcon color="error" />;
        return <CheckCircleOutlineIcon color="success" />;
    };

    return (
        <>
            <Box sx={{ marginBottom: 3 }}>
                <Button
                    variant="contained"
                    onClick={
                        () => navigate(
                            state.navigateBack == undefined ?
                            `/teams/detail/${classId}` : state.navigateBack, { state }
                        )
                    }
                    startIcon={<ArrowBackIcon />}
                >
                    {state.navigateBack == undefined ? 'Voltar para detalhes' : 'Voltar para Gestão de Turma'}
                </Button>
            </Box>

            <Box sx={{ marginBottom: 1 }}>
                <h1 style={{ fontSize: '26px' }}>Selecione a Mentoria</h1>
                <h4 style={{ color: 'grey', fontWeight: '400' }} >Turma: {state?.className}</h4>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    gap: '1vw',
                    justifyContent: 'space-between',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'bottom',
                        gap: '0.5vw',
                        width: '40vw',
                        marginTop: '20px',
                    }}
                >
                    <Autocomplete
                        id="periods-autocomplete"
                        options={periods}
                        getOptionLabel={(option) => option.name}
                        onChange={(_: unknown, value: IPeriod | null, reason: string) => setSelected(value, reason, setSelectedPeriod)}
                        renderInput={(params) => (
                            <TextField {...params} label="Períodos" placeholder="Selecione o período da mentoria" />
                        )}
                        value={selectedPeriod || null}
                        sx={{ width: '20vw' }}
                    />
                    {mentoring.length !== 0 && (
                        <Autocomplete
                            id="mentoring-autocomplete"
                            options={mentoring}
                            getOptionLabel={(option) => option.name}
                            onChange={(_: unknown, value: IMentoringDto | null, reason: string) => setSelected(value, reason, setSelectedMentoring)}
                            renderInput={(params) => (
                                <TextField {...params} label="Mentoria" placeholder="Selecione a mentoria" />
                            )}
                            value={selectedMentoring || null}
                            sx={{ width: '20vw'}}
                        />
                    )}
                </Box>
                {students.some(student => student.changedSyncAttendance || student.changedAsyncAttendance) && (
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '1vw',
                            flexWrap: 'wrap',
                            alignItems: 'end',
                            justifyContent: 'center',
                            width: '100%',
                        }}
                    >
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            sx={{ padding: '10px 15px' }}
                            onClick={() => savePresence()}
                        >
                            Salvar alterações
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<UndoIcon />}
                            sx={{ padding: '10px 15px' }}
                            onClick={() => revertPresence()}
                        >
                            Reverter alterações
                        </Button>
                    </Box>
                )}
            </Box>

            {
                isLoading ? <MLoading /> :
                    (
                        <TableContainer
                            component={Paper}
                            sx={{
                                boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.2), 0px 4px 6px rgba(0, 0, 0, 0.1)',
                                marginTop: '20px'
                            }}
                        >
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            key={'students'}
                                            sx={{
                                                alignItems: "center",
                                                top: 64,
                                                bgcolor: "#4263EB",
                                                color: "white",
                                            }}>
                                            Alunos
                                        </TableCell>
                                        <TableCell
                                            key={'sync attendance'}
                                            sx={{
                                                alignItems: "center",
                                                top: 64,
                                                bgcolor: "#4263EB",
                                                color: "white",
                                                width: '40%'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    width: '30%'
                                                }}
                                            >
                                                <Box sx={{ minWidth: '150px' }}>{`Presença Síncrona (${students.length > 0 ? ((students.filter(student => student.syncConfirm).length / students.length) * 100).toFixed(2) : '0.00'}%)`}</Box>
                                                
                                                {
                                                    students.length !== 0 &&
                                                    <Tooltip
                                                        title={students.every(student => student.syncConfirm === true) ? "Retirar presença de todos" : "Dar presença para todos"}
                                                        placement="top"
                                                    >
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={changeAllSyncAttendances}>
                                                            {
                                                                students.every(student => student.syncConfirm === true) ?
                                                                    <BlockIcon sx={{ cursor: 'pointer' }} /> :
                                                                    <DoneAllIcon sx={{ cursor: 'pointer' }} />
                                                            }
                                                        </Box>
                                                    </Tooltip>
                                                }
                                            </Box>
                                        </TableCell>
                                        <TableCell
                                            key={'async attendance'}
                                            sx={{
                                                alignItems: "center",
                                                top: 64,
                                                bgcolor: "#4263EB",
                                                color: "white",
                                                width: '40%'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    width: '30%'
                                                }}
                                            >
                                                <Box sx={{ minWidth: '150px' }}>{`Presença Assíncrona (${students.length > 0 ? ((students.filter(student => student.asyncConfirm).length / students.length) * 100).toFixed(2) : '0.00'}%)`}</Box>
                                                
                                                {
                                                    students.length !== 0 &&
                                                    <Tooltip
                                                        title={students.every(student => student.asyncConfirm === true) ? "Retirar presença de todos" : "Dar presença para todos"}
                                                        placement="top"
                                                    >
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={changeAllAsyncAttendances}>
                                                            {
                                                                students.every(student => student.asyncConfirm === true) ?
                                                                    <BlockIcon sx={{ cursor: 'pointer' }} /> :
                                                                    <DoneAllIcon sx={{ cursor: 'pointer' }} />
                                                            }
                                                        </Box>
                                                    </Tooltip>
                                                }
                                            </Box>
                                        </TableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {students.map((itemRow: IStudent) => (
                                        <TableRow key={itemRow.studentId} >
                                            <TableCell>{itemRow.studentName}</TableCell>
                                            <TableCell>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '10%',
                                                    }}
                                                >
                                                    {handleAttendanceIcon(itemRow.syncConfirm)}
                                                    <Button variant="outlined" size="small" onClick={() => changeSyncPresence(itemRow.studentId)}>Alterar</Button>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '10%',
                                                    }}
                                                >
                                                    {handleAttendanceIcon(itemRow.asyncConfirm)}
                                                    <Button variant="outlined" size="small" onClick={() => changeAsyncPresence(itemRow.studentId)}>Alterar</Button>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )
            }
        </>
    );
};

export default TTeamMentoring;