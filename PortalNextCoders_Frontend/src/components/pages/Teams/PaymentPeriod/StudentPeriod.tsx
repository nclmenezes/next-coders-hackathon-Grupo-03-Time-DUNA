import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Container,
    IconButton,
    Chip
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import { format, parseISO, isAfter, isBefore, isWithinInterval } from 'date-fns';
import MLoading from '../../../molecules/MLoading';

enum PeriodType {
    Closed = 1,
    NotStarted = 2,
    Progress = 3
}


import periodService from '../../../../services/api/contractorengine/period.service';
import { IStudentPeriod } from '../../../../services/api/contractorengine/types';

const PagamentosPage: React.FC = () => {
    const navigate = useNavigate();
    const { studentClassManagementId } = useParams<{ studentClassManagementId: string }>();
    
    const [periods, setPeriods] = useState<IStudentPeriod[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchPeriodos = async () => {
        try {
            setIsLoading(true);
            // Substitua pela sua chamada de API real
            const response = await periodService.getPeriodosByManagementClassId(
                Number(studentClassManagementId)
            );
            
            // Atualizar o tipo de período baseado na data atual
            const updatedPeriods = response.map(period => {
                const now = new Date();
                const startDate = parseISO(period.startAt);
                const endDate = parseISO(period.endAt);

                if (isAfter(now, endDate)) {
                    return { ...period, periodTypeId: PeriodType.Closed };
                } else if (isBefore(now, startDate)) {
                    return { ...period, periodTypeId: PeriodType.NotStarted };
                } else {
                    return { ...period, periodTypeId: PeriodType.Progress };
                }
            });

            setPeriods(updatedPeriods);
            setIsLoading(false);
        } catch (error) {
            console.error('Erro ao buscar períodos:', error);
            setIsLoading(false);
        }
    };

    const navigateToPeriodoDetalhes = (periodoId: number) => {
        navigate(`/managementClass/${studentClassManagementId}/pagamentos/${periodoId}`);
    };

    const handleVoltar = () => {
        navigate(-1);
    };

    useEffect(() => {
        fetchPeriodos();
    }, [studentClassManagementId]);

    // Função para obter detalhes do período
    const getPeriodDetails = (periodTypeId: PeriodType) => {
        switch (periodTypeId) {
            case PeriodType.Closed:
                return {
                    label: 'Período Encerrado',
                    color: 'error',
                    icon: <CheckCircleIcon />
                };
            case PeriodType.NotStarted:
                return {
                    label: 'Período Não Iniciado',
                    color: 'warning',
                    icon: <HourglassEmptyIcon />
                };
            case PeriodType.Progress:
                return {
                    label: 'Período em Andamento',
                    color: 'success',
                    icon: <PlayCircleFilledIcon />
                };
            default:
                return {
                    label: 'Período Desconhecido',
                    color: 'default',
                    icon: <PaymentIcon />
                };
        }
    };

    if (isLoading) {
        return <MLoading />;
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                mb: 3 
            }}>
                <IconButton onClick={handleVoltar} color="primary">
                    <KeyboardBackspaceIcon />
                </IconButton>
                <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PaymentIcon /> Períodos de Pagamento
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {periods.map((periodo) => {
                    const periodDetails = getPeriodDetails(periodo.periodTypeId);
                    
                    return (
                        <Grid item xs={12} sm={6} md={4} key={periodo.id}>
                            <Paper 
                                elevation={3}
                                sx={{ 
                                    p: 2, 
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: 6
                                    }
                                }}
                                onClick={() => navigateToPeriodoDetalhes(periodo.id)}
                            >
                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    mb: 2
                                }}>
                                    <Typography 
                                        variant="h6" 
                                        sx={{ 
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Período {periodo.number}
                                    </Typography>
                                    <Chip 
                                        icon={periodDetails.icon}
                                        label={periodDetails.label}
                                        color={periodDetails.color as any}
                                        size="small"
                                    />
                                </Box>
                                <Typography variant="body2">
                                    Início: {format(parseISO(periodo.startAt), 'dd/MM/yyyy')}
                                </Typography>
                                <Typography variant="body2">
                                    Fim: {format(parseISO(periodo.endAt), 'dd/MM/yyyy')}
                                </Typography>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>
        </Container>
    );
};

export default PagamentosPage;