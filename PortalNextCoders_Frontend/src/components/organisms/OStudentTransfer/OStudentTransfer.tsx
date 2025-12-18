import { Box, CircularProgress } from "@mui/material";
import { Dispatch, SetStateAction, ReactNode, useState } from "react";
import { IAgentClass, IStudentClassData } from "../../../interfaces/teams/class.interfaces";
import {
    IStudentTransferDto,
    ListOptions,
    IStudentTransferHistoryDto } from "../../../interfaces/student/studentTransfer.interfaces";
import { TRANSFER_OPTION, INFO_OPTION, HISTORY_OPTION } from "../../../constants/studentTransfer/studentTransfer";
import MSearchAgentClass from "../../molecules/MSearchAgentClass/MSearchAgentClass";
import MListBox from "../../molecules/MListBox/MListBox";
import AClassInfo from "../../atoms/AClassInfo/AClassInfo";
import ATransferHistoryList from "../../atoms/ATransferHistoryList/ATransferHistoryList";

interface IStudentTransferProps {
    listOption: ListOptions;
    setListOption: Dispatch<SetStateAction<ListOptions>>;
    searchLoading: boolean;
    studentClass: IStudentClassData | null;
    agentClasses: IAgentClass[];
    anotherAgentClass: IAgentClass | null;
    agentClass: IAgentClass | null;
    setStudentClass: Dispatch<SetStateAction<IStudentClassData | null>>;
    setAgentClass: Dispatch<SetStateAction<IAgentClass | null>>;
    handleSelectAgentClass: (
        selectedAgentClass: IAgentClass | null,
        setAgentClass: Dispatch<SetStateAction<IAgentClass | null>>,
        setStudentClass: Dispatch<SetStateAction<IStudentClassData | null>>,
        setLoadingStudents: Dispatch<SetStateAction<boolean>>,
        setStudentsTransferList: Dispatch<SetStateAction<IStudentTransferDto[]>>,
        setStudentsTransferHistory: Dispatch<SetStateAction<IStudentTransferHistoryDto[] | null>>
    ) => void;
    studentsTransferList: IStudentTransferDto[];
    studentsTransferHistory: IStudentTransferHistoryDto[] | null;
    setStudentsTransferList: Dispatch<SetStateAction<IStudentTransferDto[]>>;
    setStudentsTransferHistory: Dispatch<SetStateAction<IStudentTransferHistoryDto[] | null>>;
};

const centeredContentBox = (componentChildren: ReactNode): JSX.Element  => (
    <Box
        sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            padding: '10px 20px 20px 20px',
            userSelect: 'none'
        }}
    >
        {componentChildren}
    </Box>
);

const OStudentTransfer = ({
    listOption,
    setListOption,
    searchLoading,
    studentClass,
    agentClasses,
    anotherAgentClass,
    agentClass,
    setStudentClass,
    setAgentClass,
    handleSelectAgentClass,
    studentsTransferList,
    studentsTransferHistory,
    setStudentsTransferList,
    setStudentsTransferHistory
}: IStudentTransferProps) => {
    const [studentsLoading, setStudentsLoading] = useState<boolean>(false);

    const selectAgentClass = (selectedAgentClass: IAgentClass | null) => {
        if (!selectedAgentClass) setListOption(TRANSFER_OPTION);
        handleSelectAgentClass(
            selectedAgentClass,
            setAgentClass,
            setStudentClass,
            setStudentsLoading,
            setStudentsTransferList,
            setStudentsTransferHistory
        );
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #DDDDDD',
                gap: '10px',
                borderRadius: '3px'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '30px',
                    borderBottom: '1px solid #DDDDDD',
                    padding: '0 20px',
                    whiteSpace: 'nowrap'
                }}
            >
                <Box
                    sx={{
                        borderBottom: `3px solid ${listOption === TRANSFER_OPTION ? '#0A5995' : '#FFFFFF'}`,
                        color: listOption === TRANSFER_OPTION ? '#0A5995' : 'black',
                        userSelect: 'none',
                        cursor: 'pointer',
                        padding: '10px 0 3px 0'
                    }}
                    onClick={() => {
                        if (listOption !== TRANSFER_OPTION) setListOption(TRANSFER_OPTION);
                    }}
                >
                    Transferir alunos
                </Box>
                <Box
                    sx={{
                        borderBottom: `3px solid ${listOption === INFO_OPTION ? '#0A5995' : '#FFFFFF'}`,
                        color: listOption === INFO_OPTION ? '#0A5995' : 'black',
                        userSelect: 'none',
                        cursor: (agentClass && !studentsLoading) ? 'pointer' : 'not-allowed',
                        padding: '10px 0 3px 0'
                    }}
                    onClick={() => {
                        if (
                            (agentClass && !studentsLoading) &&
                            listOption !== INFO_OPTION
                        ) setListOption(INFO_OPTION);
                    }}
                >
                    Informações da turma
                </Box>
                <Box
                    sx={{
                        borderBottom: `3px solid ${listOption === HISTORY_OPTION ? '#0A5995' : '#FFFFFF'}`,
                        color: listOption === HISTORY_OPTION ? '#0A5995' : 'black',
                        userSelect: 'none',
                        cursor: (agentClass && !studentsLoading) ? 'pointer' : 'not-allowed',
                        padding: '10px 0 3px 0'
                    }}
                    onClick={() => {
                        if (
                            (agentClass && !studentsLoading) &&
                            listOption !== HISTORY_OPTION
                        ) setListOption(HISTORY_OPTION);
                    }}
                >
                    Histórico de transferência
                </Box>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '10px 0 10px 0',
                    borderBottom: '1px solid #DDDDDD'
                }}
            >
                <MSearchAgentClass
                    disableSearch={studentsLoading}
                    searchLoading={searchLoading}
                    agentClasses={agentClasses}
                    anotherAgentClass={anotherAgentClass}
                    selectAgentClass={selectAgentClass}
                />
            </Box>
            {
                listOption === TRANSFER_OPTION &&
                <MListBox
                    studentsLoading={studentsLoading}
                    agentClass={agentClass}
                    studentsTransferList={studentsTransferList}
                    setStudentsTransferList={setStudentsTransferList}
                    centeredContentBox={centeredContentBox}
                />
            }
            {
                listOption === INFO_OPTION &&
                (
                    studentsLoading ? centeredContentBox(<CircularProgress sx={{ color: '#0A5995' }} />) :
                    studentClass && agentClass &&
                    <AClassInfo
                        agentClass={agentClass}
                        studentClass={studentClass}
                    />
                )
            }
            {
                listOption === HISTORY_OPTION && 
                (
                    studentsLoading ? centeredContentBox(<CircularProgress sx={{ color: '#0A5995' }} />) :
                    (
                        studentsTransferHistory ?
                        <ATransferHistoryList
                            studentsTransferHistory={studentsTransferHistory}
                        /> :
                        centeredContentBox(<p style={{ color: 'rgba(0, 0, 0, 0.6)' }}>Não foi possível obter o histórico de transferências</p>)
                    )
                )
            }
        </Box>
    );
};

export default OStudentTransfer;