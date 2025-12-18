import { ReactNode, Dispatch, SetStateAction } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { IAgentClass } from "../../../interfaces/teams/class.interfaces";
import AStudentList from "../../atoms/AStudentList/AStudentList";
import AStudentTotal from "../../atoms/AStudentTotal/AStudentTotal";
import { IStudentTransferDto } from "../../../interfaces/student/studentTransfer.interfaces";


const renderStudentsList = (
    studentsLoading: boolean,
    agentClass: IAgentClass | null,
    studentsTransferList: IStudentTransferDto[],
    handleStudentCheck: (studentId: number, agentClassId: number) => void,
    handleChangeAllStudents: (isCheck: boolean) => void,
    centeredContentBox: (componentChildren: ReactNode) => JSX.Element
) => {
    if (!agentClass) return (
        centeredContentBox(
            <Typography
                sx={{ fontFamily: 'Inter', color: '#0A5995' }}
            >
                Selecione uma turma filha para iniciar
            </Typography>
        )
    );
    if (studentsLoading) return centeredContentBox(<CircularProgress sx={{ color: '#0A5995' }} />);

    if (studentsTransferList.length === 0) return (
        centeredContentBox(
            <Typography
                sx={{ fontFamily: 'Inter', color: 'rgba(0, 0, 0, 0.6)' }}
            >
                {`A turma filha ${agentClass.name} não tem alunos matriculados!`}
            </Typography>
        )
    );

    return (
        <>
            <Box sx={{ paddingBottom: '25px', height: '100%' }} >
                <AStudentList
                    studentsTransferList={studentsTransferList}
                    handleStudentCheck={handleStudentCheck}
                />
            </Box>
            <AStudentTotal
                studentsTransferList={studentsTransferList}
                handleChangeAllStudents={handleChangeAllStudents}
            />
        </>
    );
};

interface IListBoxProps {
    studentsLoading: boolean;
    agentClass: IAgentClass | null;
    studentsTransferList: IStudentTransferDto[];
    setStudentsTransferList: Dispatch<SetStateAction<IStudentTransferDto[]>>;
    centeredContentBox: (componentChildren: ReactNode) => JSX.Element;
};

const MListBox = ({
    studentsLoading,
    agentClass,
    studentsTransferList,
    setStudentsTransferList,
    centeredContentBox
}: IListBoxProps) => {
    const handleStudentCheck = (studentId: number, agentClassId: number) => {
        setStudentsTransferList(
            studentsTransferList.map(
                (studentTransfer: IStudentTransferDto) => {
                    if (
                        studentTransfer.studentId === studentId &&
                        studentTransfer.originClass.studentAgentClassId === agentClassId
                    )
                        studentTransfer.isChecked = !studentTransfer.isChecked;
                    return studentTransfer;
                }
            )
        );
    };

    const handleChangeAllStudents = (isCheck: boolean) => {
        setStudentsTransferList(
            studentsTransferList.map(
                (studentTransfer: IStudentTransferDto) => {
                    studentTransfer.isChecked = isCheck;
                    return studentTransfer;
                }
            )
        );
    };

    return renderStudentsList(
        studentsLoading,
        agentClass,
        studentsTransferList,
        handleStudentCheck,
        handleChangeAllStudents,
        centeredContentBox
    );
};

export default MListBox;