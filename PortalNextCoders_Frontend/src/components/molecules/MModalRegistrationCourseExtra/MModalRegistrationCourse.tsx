import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Chip } from '@mui/material';
import { CourseDetail } from '../../../services/studentNew/studentNew.service';
import StudentCourseExtraService from '../../../services/api/student/studentCourseExtra.service';
import { useAuth } from '../../../context/AuthProvider/useAuth';
import { showErrorToast, showSuccessToast } from '../../../utils/toast';
import MLoading from '../MLoading';

interface MModalRegistrationCourseProps {
    open: boolean;
    onClose: () => void;
    title?: string; 
    dataCourse: CourseDetail | null;
}

const MModalRegistrationCourse: React.FC<MModalRegistrationCourseProps> = ({
    open,
    onClose,
    title = 'Matricular-se no Curso', 
    dataCourse
}) => {
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const {user} = useAuth();

    const handleConfirmEnrollment = async () => {
        if (!dataCourse?.id || !user?.id) {
            showErrorToast("Não foi possível matricular no curso. Dados inválidos.");
            return;
        }

        setLoading(true);
        try {
            await StudentCourseExtraService.RegistrationInExtraCourse(dataCourse.id, user.id);
            
            showSuccessToast("Matrícula confirmada com sucesso!");
            setConfirmDialogOpen(false);
            
            setTimeout(() => {
                onClose();
                window.location.reload();
            }, 1500);
            
        } catch (error) {
            console.error('Erro ao matricular no curso:', error);
            showErrorToast("Ocorreu um erro ao tentar realizar a matrícula.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
            sx: { borderRadius: 4 } 
            }}
        >
            {loading && <MLoading />}
            <DialogTitle>{title}: {dataCourse?.name}</DialogTitle>
            <DialogContent dividers>
                {dataCourse && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {dataCourse.image && (
                            <Box
                                sx={{
                                    width: '100%',
                                    height: 200,
                                    backgroundImage: `url(${dataCourse.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    borderRadius: 2,
                                    border: '1px solid #e0e0e0'
                                }}
                            />
                        )}

                        {dataCourse.description && (
                            <Box>
                                <Typography variant="h6" sx={{ mb: 1, color: '#4263dc', fontWeight: 600 }}>
                                    Sobre o Curso
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6 }}>
                                    {dataCourse.description}
                                </Typography>
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
                                    ID do Curso:
                                </Typography>
                                <Chip 
                                    label={`#${dataCourse.id}`} 
                                    size="small" 
                                    sx={{ backgroundColor: '#e3f2fd', color: '#1976d2' }}
                                />
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
                                    Nome do Curso:
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#666' }}>
                                    {dataCourse.name}
                                </Typography>
                            </Box>
                        </Box>
 
                        <Box sx={{ 
                            p: 2, 
                            backgroundColor: dataCourse.isEnrolled ? '#e8f5e8' : '#fff3e0', 
                            borderRadius: 2,
                            border: `1px solid ${dataCourse.isEnrolled ? '#4caf50' : '#ff9800'}`
                        }}>
                            <Typography variant="body2" sx={{ 
                                color: dataCourse.isEnrolled ? '#2e7d32' : '#f57c00',
                                fontWeight: 500 
                            }}>
                                {dataCourse.isEnrolled 
                                    ? '✓ Você já está matriculado neste curso' 
                                    : '⚠️ Você ainda não está matriculado neste curso'
                                }
                            </Typography>
                        </Box>
 
                        {!dataCourse.isEnrolled && (
                            <Box>
                                <Typography variant="h6" sx={{ mb: 2, color: '#4263dc', fontWeight: 600 }}>
                                    O que você terá acesso:
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Typography variant="body2" sx={{ color: '#666', display: 'flex', alignItems: 'center', gap: 1 }}>
                                        📚 Acesso completo ao conteúdo do curso
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#666', display: 'flex', alignItems: 'center', gap: 1 }}>
                                        🎯 Exercícios práticos e projetos
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#666', display: 'flex', alignItems: 'center', gap: 1 }}>
                                        🏆 Certificado de conclusão
                                    </Typography> 
                                </Box>
                            </Box>
                        )}
                    </Box>
                )}
                
                {!dataCourse && (
                    <Typography>
                        Nenhuma informação do curso disponível.
                    </Typography>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 3, gap: 2 }}>
                <Button 
                    onClick={onClose} 
                    variant="outlined"
                    sx={{ 
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        borderColor: '#4263dc',
                        color: '#4263dc',
                        fontWeight: 600,
                        '&:hover': {
                            borderColor: '#3651c7',
                            backgroundColor: 'rgba(66, 99, 220, 0.04)'
                        }
                    }}
                >
                    Fechar
                </Button>
                <Button 
                    onClick={() => setConfirmDialogOpen(true)} 
                    variant="contained"
                    sx={{ 
                        backgroundColor: '#4263dc',
                        borderRadius: 2,
                        px: 4,
                        py: 1,
                        fontWeight: 600,
                        boxShadow: '0 4px 12px rgba(66, 99, 220, 0.3)',
                        '&:hover': {
                            backgroundColor: '#3651c7',
                            boxShadow: '0 6px 16px rgba(66, 99, 220, 0.4)'
                        }
                    }}
                >
                    Confirmar Matrícula
                </Button>
            </DialogActions>
 
            <Dialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3, textAlign: 'center' }
                }}
            >
                <DialogContent sx={{ pt: 4, pb: 2 }}>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h1" sx={{ fontSize: '3rem', mb: 1 }}>
                            🎓
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#4263dc', mb: 1 }}>
                            Confirmar Matrícula
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                            Tem certeza que deseja se matricular no curso:
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333', mt: 1 }}>
                            "{dataCourse?.name}"
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 3 }}>
                    <Button 
                        onClick={() => setConfirmDialogOpen(false)}
                        variant="outlined"
                        sx={{ 
                            borderRadius: 2,
                            px: 3,
                            borderColor: '#ccc',
                            color: '#666',
                            '&:hover': {
                                borderColor: '#999',
                                backgroundColor: 'rgba(0,0,0,0.04)'
                            }
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleConfirmEnrollment}
                        variant="contained"
                        sx={{ 
                            backgroundColor: '#4caf50',
                            borderRadius: 2,
                            px: 3,
                            '&:hover': {
                                backgroundColor: '#45a049'
                            }
                        }}
                    >
                        Sim, Matricular
                    </Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
};

export default MModalRegistrationCourse;