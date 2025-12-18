import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import HandsOnService from "../../../services/HandsOn/handsOn.service";
import { IStudent, IHandsPresence, IHandsOnAttendanceDto } from "../../../interfaces/teams/handsOn.interfaces";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {
    Box, Button, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from '@mui/icons-material/Save';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import MLoading from "../../molecules/MLoading";
import UndoIcon from '@mui/icons-material/Undo';

const TTeamHandsOnPresence = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as IHandsPresence;
    const [students, setStudents] = useState<IStudent[]>(state.students || []);
    const [studentsTemp, setStudentsTemp] = useState<IStudent[]>([]);
    const [changedAttendance, setChangedAttendance] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { contentId } = useParams<string>();

    const fetchAttendance = async () => {
        setIsLoading(true);
        try {
            const studentList : IHandsOnAttendanceDto[] = students.map(student => (
                {
                    contentId: Number(contentId),
                    studentId: student.studentId,
                    presence: true,
                }
            ));
            const attendance = await HandsOnService.getHandsOnAttendance(studentList);

            const updatedStudents = students.map(student => ({
                ...student,
                attendance: attendance.find(at => at.studentId === student.studentId)?.presence,
                changedAttendance: false,
            }));
            setStudents(updatedStudents);
            setStudentsTemp(
                updatedStudents.map(student => JSON.parse(JSON.stringify(student)))
            );
            setIsLoading(false);
        } catch (error) {
            console.error("Failed to fetch attendance:", error);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [contentId]);

    const verifyChangeAttendance = (newStudentsTemp: IStudent[]) => {
        const reviewedStudentsTemp = newStudentsTemp
            .map(newStudent => {
                if (!newStudent.changedAttendance) return newStudent;

                const student = students.find(student => student.studentId == newStudent.studentId);
                newStudent.changedAttendance = newStudent.attendance !== student?.attendance;
                return newStudent;
            });

        setStudentsTemp(reviewedStudentsTemp);
        setChangedAttendance(reviewedStudentsTemp.some(student => student.changedAttendance === true));
    };

    const toggleAttendance = (studentId: number) => {
        const newStudentsTemp = studentsTemp
            .map(student => {
                if (student.studentId === studentId)
                    return { ...student, attendance: !student.attendance, changedAttendance: true };
                return student;
            });
        verifyChangeAttendance(newStudentsTemp);
    };

    const toggleAllAttendance = (newAttendance: boolean) => {
        const newStudentsTemp = studentsTemp
            .map(student => {
                return { ...student, attendance: newAttendance, changedAttendance: true };
            });
        verifyChangeAttendance(newStudentsTemp);
    };

    const revertAttendance = () => {
        setStudentsTemp(
            students.map(student => JSON.parse(JSON.stringify(student)))
        );
        setChangedAttendance(false);
    };

    const sendAttendance = async () => {
        if(contentId === undefined) throw new Error("contentId is undefined");
        const postBody = studentsTemp
            .filter(student => student.changedAttendance)
            .map(student =>({
                studentId: student.studentId, 
                contentId: parseInt(contentId),
                presence: student.attendance
            })) as IHandsOnAttendanceDto[];
        setIsLoading(true);
        if (postBody.some(student => student.presence))
            await HandsOnService.postHandsOnAttendance(postBody.filter(student => student.presence));
        if (postBody.some(student => !student.presence))
            await HandsOnService.deleteHandsOnAttendance(postBody.filter(student => !student.presence));
        setIsLoading(false);
        setStudents(studentsTemp);
        setChangedAttendance(false);
    };

    const TABLE_HEAD = [
        { title: "Nome do aluno", field: "studentName" },
        { title: "Presença", field: "attendance" },
        { title: "Alterar Presença", field: "setAttendance" }
    ];

    return (
        <>
            <Box sx={{ marginBottom: 3 }}>
                <Button
                    variant="contained"
                    onClick={() => navigate(
                        state.navigateBack == undefined ?
                        `/teams/handsOn/${state.classId}/modules` : state.navigateBack,
                        {
                            state: {
                                ...state,
                                students,
                                fromPresence: true
                            }
                        })}
                    startIcon={<ArrowBackIcon />}
                >
                    Voltar para aulas
                </Button>
            </Box>

            <Box
                sx={{
                    marginBottom: '8px',
                    marginRight: '20px'
                }}
            >
                <h1 style={{fontSize: '26px'}}>Presença Hands-On</h1>
                <h4 style={{ color: 'grey', fontWeight: '400' }} >Turma: {state?.className}</h4>
            </Box>

            {isLoading ? (
                <MLoading />
            ) : (
                <>
                    <Box sx={{
                        border: '1px solid black',
                        borderRadius: 2,
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        my: 2
                    }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, marginRight: 3 }}>
                            <Box sx={{ fontFamily: 'Inter', fontWeight: 'bold' }}>Módulo: {state.trailName}</Box>
                            <Box sx={{ color: '#4263EB', fontFamily: 'Inter', fontWeight: 'bold' }}>Aula {state.moduleId}: {state.moduleName}</Box>
                            <Box sx={{ fontFamily: 'Inter', fontWeight: 'bold' }}>Data: {state.date.toLocaleDateString('pt-BR')}</Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Button startIcon={<CheckBoxIcon />} variant="contained" sx={{ minWidth: 100, marginLeft: 1 }} onClick={() => toggleAllAttendance(true)}>
                                Presença para todos
                            </Button>
                            <Button startIcon={<CheckBoxOutlineBlankIcon />} variant="contained" sx={{ minWidth: 100, marginLeft: 1 }} onClick={() => toggleAllAttendance(false)}>
                                Falta para todos
                            </Button>
                        </Box>
                        {
                            changedAttendance &&
                            (<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Button startIcon={<SaveIcon />} variant="contained" sx={{ minWidth: 100, marginLeft: 1 }} onClick={() => sendAttendance()}>
                                    Salvar alterações
                                </Button>
                                <Button startIcon={<UndoIcon />} variant="contained" sx={{ minWidth: 100, marginLeft: 1 }} onClick={() => revertAttendance()}>
                                    Reverter alterações
                                </Button>
                            </Box>)
                        }
                    </Box>


                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {TABLE_HEAD.map(item => (
                                        <TableCell key={item.field} sx={{ alignItems: "center", top: 64, bgcolor: "#4263EB", color: "white" }}>
                                            {item.title}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {studentsTemp.map(student => (
                                    <TableRow key={student.studentId}>
                                        <TableCell>{student.studentName}</TableCell>
                                        <TableCell>
                                            {student.attendance ? <CheckCircleOutlineIcon color="success" /> : <HighlightOffIcon color="error" />}
                                        </TableCell>
                                        <TableCell>
                                            <Button onClick={() => toggleAttendance(student.studentId)}>Alterar Presença</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}
        </>
    );
};

export default TTeamHandsOnPresence;
