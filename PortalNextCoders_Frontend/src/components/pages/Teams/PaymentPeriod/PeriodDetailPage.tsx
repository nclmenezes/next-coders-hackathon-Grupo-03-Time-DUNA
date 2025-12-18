import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    Chip,
    Container,
    Tooltip,
    Button
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import PaymentIcon from '@mui/icons-material/Payment';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import InfoIcon from '@mui/icons-material/Info';
import periodService from '../../../../services/api/contractorengine/period.service';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DownloadIcon from '@mui/icons-material/Download';
import StudentPaymentsContent from './StudentPaymentsContent';
import { PeriodDetail, StudentDetail, StudentPeriodAverage, StudentPeriodPayment } from '../../../../services/api/contractorengine/types';

const PeriodDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { studentClassManagementId, periodId } = useParams<{
        studentClassManagementId: string;
        periodId: string;
    }>();

    const [periodDetail, setPeriodDetail] = useState<PeriodDetail | null>(null);
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
    const [openPresenceDetails, setOpenPresenceDetails] = useState<{[key: number]: boolean}>({});

    const [selectedStudentPayments, setSelectedStudentPayments] = useState<StudentPeriodPayment[]>([]);
    const [selectedStudentData, setSelectedStudentData] = useState<{
        name: string;
        studentId: number;
        studentClassId: number;
        studentClassManagementPeriodId: number;
    } | null>(null);

    const calculateGeneralPresence = (averages: StudentPeriodAverage[]): number => {
        const presenceAvg = (averages.find(avg => avg.activityType.type === 'Presença')?.average || 0) * 10;
        const handsOnAvg = (averages.find(avg => avg.activityType.type === 'Hands-On')?.average || 0) * 10;
        const mentoriaAvg = (averages.find(avg => avg.activityType.type === 'Mentorias')?.average || 0) * 10;
    
        const generalPresence = (0.6 * presenceAvg + 0.2 * handsOnAvg + 0.2 * mentoriaAvg);
    
        return generalPresence;
    };

    const fetchPeriodDetails = async () => {
        try {
            const response = await periodService.getPeriodDetailById(
                Number(periodId)
            );
            setPeriodDetail(response);
        } catch (error) {
            console.error('Erro ao buscar detalhes do período:', error);
        }
    };

    useEffect(() => {
        fetchPeriodDetails();
    }, [studentClassManagementId, periodId]);

    const renderPresenceDetails = (student: StudentDetail) => {
        const presenceAvg = (student.studentPeriodAverages.find(avg => avg.activityType.type === 'Presença')?.average || 0) * 10;
        const handsOnAvg = (student.studentPeriodAverages.find(avg => avg.activityType.type === 'Hands-On')?.average || 0) * 10;
        const mentoriaAvg = (student.studentPeriodAverages.find(avg => avg.activityType.type === 'Mentorias')?.average || 0) * 10;
    
        return (
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 1, 
                p: 2, 
                backgroundColor: 'rgba(0,0,0,0.05)' 
            }}>
                <Typography variant="body2">
                    Presença: {presenceAvg.toFixed(0)}% (60%)
                </Typography>
                <Typography variant="body2">
                    Hands-On: {handsOnAvg.toFixed(0)}% (20%)
                </Typography>
                <Typography variant="body2">
                    Mentorias: {mentoriaAvg.toFixed(0)}% (20%)
                </Typography>
            </Box>
        );
    };

    const renderActivityAverage = (average: number, activityType: string) => {
        let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';
        
        switch (activityType) {
            case 'Presença':
                const percentAverage = average * 100;
                color = percentAverage === 100 ? 'success' : percentAverage >= 70 ? 'info' : 'warning';
                return (
                    <Chip 
                        label={`${percentAverage.toFixed(0)}%`} 
                        color={color}
                        size="small"
                    />
                );
            case 'Nota':
                color = average >= 7 ? 'success' : average >= 5 ? 'warning' : 'error';
                return (
                    <Chip 
                        label={average.toFixed(2)} 
                        color={color}
                        size="small"
                    />
                );
            case 'Hands-On':
            case 'Mentorias':
                const percentAverageActivity = average * 100;
                color = percentAverageActivity === 100 ? 'success' : percentAverageActivity >= 70 ? 'info' : 'warning';
                return (
                    <Chip 
                        label={`${percentAverageActivity.toFixed(0)}%`} 
                        color={color}
                        size="small"
                    />
                );
        }
    };

    const togglePresenceDetails = (studentId: number) => {
        setOpenPresenceDetails(prev => ({
            ...prev,
            [studentId]: !prev[studentId]
        }));
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    if (!periodDetail) {
        return <Typography>Carregando...</Typography>;
    }

    const exportToExcel = () => {
        if (!periodDetail) return;

        // Preparar dados para exportação
        const exportData = periodDetail.studentDetails.map(student => ({
            Nome: student.name,
            Recompensa: student.reward,
            'Presença Geral': calculateGeneralPresence(student.studentPeriodAverages).toFixed(0) + '%',
            Nota: student.studentPeriodAverages.find(avg => avg.activityType.type === 'Nota')?.average.toFixed(2) || '0.00'
        }));

        // Criar planilha
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, `Período ${periodDetail.number}`);

        // Gerar arquivo Excel
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        saveAs(blob, `Periodo_${periodDetail.number}_Detalhes.xlsx`);
    };

    return (
        <Container maxWidth="xl">
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                gap: 2, 
                mb: 3 
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={handleGoBack} color="primary">
                        <KeyboardBackspaceIcon />
                    </IconButton>
                    <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PaymentIcon /> Período {periodDetail.number}
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<DownloadIcon />}
                    onClick={exportToExcel}
                >
                    Exportar Excel
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome do Aluno</TableCell>
                            <TableCell>Presença Geral</TableCell>
                            <TableCell>Nota</TableCell>
                            <TableCell>Recompensa</TableCell>
                            <TableCell>Pagamentos</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {periodDetail.studentDetails.map((student) => (
                            <React.Fragment key={student.studentId}>
                                <TableRow>
                                    <TableCell>{student.name}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Chip 
                                                label={`${calculateGeneralPresence(student.studentPeriodAverages).toFixed(0)}%`} 
                                                color="primary" 
                                                size="small"
                                                onClick={() => togglePresenceDetails(student.studentId)}
                                            />
                                            <Tooltip title="Clique para ver detalhes">
                                                <IconButton 
                                                    size="small" 
                                                    sx={{ ml: 1 }}
                                                    onClick={() => togglePresenceDetails(student.studentId)}
                                                >
                                                    <InfoIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        {student.studentPeriodAverages
                                            .filter(avg => avg.activityType.type === 'Nota')
                                            .map(avg => renderActivityAverage(avg.average, avg.activityType.type))
                                        }
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={`R$ ${student.reward.toFixed(2)}`} 
                                            color="primary" 
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                    <IconButton 
                                        onClick={() => {
                                            setSelectedStudentPayments(student.studentPeriodPayments);
                                            setSelectedStudentData({
                                                name: student.name,
                                                studentId: student.studentId,
                                                studentClassId: student.studentClassId,
                                                studentClassManagementPeriodId: periodDetail.id
                                            });
                                            setIsPaymentDialogOpen(true);
                                        }}
                                        sx={{
                                            backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                            color: '#455a64',
                                            padding: '8px',
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                                color: '#263238'
                                            }
                                        }}
                                    >
                                        <MonetizationOnIcon />
                                    </IconButton>
                                    </TableCell>
                                </TableRow>
                                {openPresenceDetails[student.studentId] && (
                                    <TableRow>
                                        <TableCell colSpan={5}>
                                            {renderPresenceDetails(student)}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog 
                open={isPaymentDialogOpen} 
                onClose={() => setIsPaymentDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Detalhes de Pagamento - {selectedStudentData?.name}
                </DialogTitle>
                <DialogContent>
                <StudentPaymentsContent 
                    studentName={selectedStudentData?.name || ''}
                    studentId={selectedStudentData?.studentId || 0}
                    studentClassId={selectedStudentData?.studentClassId || 0}
                    studentClassManagementPeriodId={selectedStudentData?.studentClassManagementPeriodId || 0}
                    studentPeriodPayments={selectedStudentPayments}
                    onUpdatePayments={(updatedPayments) => {
                        setSelectedStudentPayments(updatedPayments);
                    }}
                    onClose={() => setIsPaymentDialogOpen(false)}
                />
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default PeriodDetailPage;