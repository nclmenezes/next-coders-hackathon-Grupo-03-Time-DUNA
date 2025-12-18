import { useState } from "react";
import { Box, Button, Chip } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { PageHeader } from "../../pages/Candidate/styles";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router";
import { List, ListItemButton, ListItem, ListItemText, Typography, CircularProgress } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import { TStudentTeamModuleDetailPage } from "../../../interfaces/teams/studentTeamDetail";
import mentoringService from "../../../services/Teams/mentoring.service";
import { IMentoringDto } from "../../../interfaces/mentoring.interface";
export interface IMentoring {
    periodName: string;
    periodId: number;
};

interface IMentoringDtoAttendance extends IMentoringDto {
    asyncConfirm: boolean | null;
    syncConfirm: boolean | null;
};

const MentoringPresenceItem = (period: IMentoring) => {
    const [open, setOpen] = useState<boolean | null>(false);
    const { studentId, studentTeamId } = useParams<string>();
    const [periodInformation, setPeriodInformation] = useState<IMentoringDtoAttendance[]>([]);
    
    const getPeriodInformation = async () => {
        if (open) return setOpen(false);
        if (periodInformation.length > 0) return setOpen(true);
        setOpen(null);
        const [_periodInformation, _attendanceInformation] = await Promise.all([
            mentoringService.getMentoringByPeriod(Number(studentTeamId), period.periodId),
            mentoringService.getMentoringAttendanceByStudentAndPeriodId(Number(studentTeamId), Number(studentId), period.periodId)
        ]);
        setPeriodInformation(_periodInformation.map((item) => {
            const _findAttendace = _attendanceInformation.find((el) => el.name === item.name);
            if (!_findAttendace) return {...item, asyncConfirm: null, syncConfirm: null};
            return {...item, asyncConfirm: _findAttendace.asyncConfirm, syncConfirm: _findAttendace.syncConfirm};
        }));
        setOpen(true);
    };

    const handleAttendanceChip = (attendance: any) => {
        if (attendance === null) return <Chip label="Não inserida" />;
        if (!attendance) return <Chip label="Falta" color="error" />;
        return <Chip label="Presente" color="success" />;
    };

    return (
        <Box>
            <ListItemButton
                disableRipple
                onClick={getPeriodInformation}
                sx={{
                    display: "flex",
                    borderBottom: "1px solid #EBF0F3",
                    justifyContent: "space-between",
                    "&:hover": { bgcolor: "#4263EB" },
                    bgcolor: "#4263EB",
                    borderRadius: 1,
                }}
            >
                <ListItemText
                    primary=
                        {
                            periodInformation.length ?
                            `
                                ${period.periodName}
                                (${
                                    Math.round((periodInformation.reduce((acc, el) => acc + (el.syncConfirm ? 1 : 0) + (el.asyncConfirm ? 1 : 0), 0))
                                    / (periodInformation.length * 2) *1000) / 10
                                }%)
                            ` : 
                            period.periodName
                        }
                    sx={
                        {
                            color: "#F8F9FA",
                            fontFamily: "Inter",
                            fontWeight: 400,
                        }
                    }
                />
                {
                    open ? (<ExpandLess sx={{ color: "#FFFFFF" }} />) :
                    open === null ? (<CircularProgress size={20} color="secondary" />) :
                    (<ExpandMore sx={{ color: "#FFFFFF" }} />)
                }
            </ListItemButton>

            <Collapse in={!!open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ my: 2 }}>
                    {
                        periodInformation.map((item) => (
                            <ListItem>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        width: "100%",
                                        height: "100%",
                                        py: 1,
                                        px: 5,
                                        bgcolor: "#EFEFEF",
                                        borderRadius: 1

                                    }}
                                >
                                    <Typography>{item.name}</Typography>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontWeight: 100,
                                                fontSize: 15,
                                                color: "#3d3d3d"
                                            }}
                                        >
                                            Presença Síncrona
                                        </Typography>
                                        <Typography 
                                            variant="h6"
                                            sx={{
                                                fontWeight: 600
                                            }}
                                        >
                                            {handleAttendanceChip(item.syncConfirm)}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontWeight: 100,
                                                fontSize: 15,
                                                color: "#3d3d3d"
                                            }}
                                        >
                                            Presença Assíncrona
                                        </Typography>
                                        <Typography 
                                            variant="h6"
                                            sx={{
                                                fontWeight: 600
                                            }}
                                        >
                                           {handleAttendanceChip(item.asyncConfirm)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </ListItem>
                        ))
                    }
                </List>
            </Collapse>
        </Box>
    )
}

const StudentMentoringPresence = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as TStudentTeamModuleDetailPage;

    const mentoringData: IMentoring[] = [
        { periodName: "Período 1", periodId: 1 },
        { periodName: "Período 2", periodId: 2 },
        { periodName: "Período 3", periodId: 3 }
    ];

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "100%",
                height: "100%",
                bgcolor: "#F8F9FA",
                p: 2
            }}
        >
            <PageHeader>
                <h1>Presença da mentoria</h1>
            </PageHeader>
            <Button
                sx={{
                    width: "10%"
                }}
                variant="contained"
                color="primary"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(window.location.pathname.replace("/mentoring", ""), {
                    state: { 
                        studentModulesData: state.studentModulesData,
                        classInfoData: state.classInfoData,
                        totalPagesData: state.totalPagesData,
                        isFromNewApi: state.isFromNewApi
                    }
                })}
            >
                Voltar
            </Button>
            {mentoringData.map(mentoria => MentoringPresenceItem(mentoria))}
        </Box>
    )
};

export default StudentMentoringPresence;