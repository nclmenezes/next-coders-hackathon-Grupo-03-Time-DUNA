import {
    Box,
    Checkbox,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon
} from "@mui/material";
import { IStudentTransferDto } from "../../../interfaces/student/studentTransfer.interfaces";

interface IStudentListProps {
    studentsTransferList: IStudentTransferDto[];
    handleStudentCheck: (studentId: number, agentClassId: number) => void;
};

const AStudentList = ({
    studentsTransferList,
    handleStudentCheck
}: IStudentListProps) => (
    <List sx={{ padding: 0, height: '60vh', overflowY: 'auto' }} >
        {
            studentsTransferList
                .sort((a, b) => a.studentName.localeCompare(b.studentName))
                .map((student: IStudentTransferDto) => (
                    <ListItem key={`${student.studentId}-${student.originClass.studentAgentClassId}`}>
                        <ListItemButton
                            onClick={() => handleStudentCheck(student.studentId, student.originClass.studentAgentClassId)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={student.isChecked}
                                    sx={{
                                        '&.Mui-checked': { color: '#0A5995' }
                                    }}
                                />
                            </ListItemIcon>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontFamily: 'Inter',
                                        color: student.incomingTransfer ? '#0A5995' : 'black'
                                    }}
                                >
                                    {
                                        student.studentName +
                                        (student.incomingTransfer ? ' (recebido)' : '')
                                    }
                                </Typography>
                                <Typography
                                    sx={{
                                        fontFamily: 'Inter',
                                        fontSize: '0.9em',
                                        color: student.incomingTransfer ? '#0A5995' : 'rgba(0, 0, 0, 0.6)'
                                    }}
                                >
                                    Attendance: {
                                        student.incomingTransfer ? '0.00' :
                                        student.studentAttendance == null ? '0.00' : student.studentAttendance.toFixed(2)
                                    }% | Grade: {
                                        student.incomingTransfer ? '0.00' :
                                        student.studentGrade == null ? '0.00' : student.studentGrade.toFixed(2)
                                    }/10
                                </Typography>
                            </Box>
                        </ListItemButton>
                    </ListItem>
                ))
        }
    </List>
);

export default AStudentList;