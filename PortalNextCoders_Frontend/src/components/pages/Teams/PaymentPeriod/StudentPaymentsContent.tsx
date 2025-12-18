import React, { useState, useEffect } from 'react';
import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Box,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Snackbar,
    Alert,
    CircularProgress,
    TextFieldProps
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import { format } from 'date-fns';

import periodService from '../../../../services/api/contractorengine/period.service';
import { StudentPeriodPayment, UpdateStudentPaymentDto } from '../../../../services/api/contractorengine/types';

interface StudentPaymentsContentProps {
    studentName: string;
    studentId: number;
    studentClassId: number;
    studentClassManagementPeriodId: number;
    studentPeriodPayments: StudentPeriodPayment[];
    onUpdatePayments: (payments: StudentPeriodPayment[]) => void;
    onClose: () => void;
}

const StudentPaymentsContent: React.FC<StudentPaymentsContentProps> = ({ 
    studentName,
    studentId,
    studentClassId,
    studentClassManagementPeriodId,
    studentPeriodPayments,
    onUpdatePayments,
    onClose 
}) => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentPayment, setCurrentPayment] = useState<StudentPeriodPayment | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [isLoading, setIsLoading] = useState(false);

    const [paymentValue, setPaymentValue] = useState('');
    const [paymentType, setPaymentType] = useState('');
    const [paymentFile, setPaymentFile] = useState<File | undefined>(undefined);
    const [paymentAt, setPaymentAt] = useState<Date | null>(new Date());

    const paymentTypes = [
        { id: 1, type: 'Bolsa' },
        { id: 2, type: 'Bonificação' },
    ];

    const resetFormStates = () => {
        setPaymentValue('');
        setPaymentType('');
        setPaymentFile(undefined);
        setPaymentAt(new Date());
    };

    const openProofLink = (fileUrl: string) => {
        if (fileUrl) {
            window.open(fileUrl, '_blank');
        } else {
            showSnackbar('Não há comprovante disponível para este pagamento.', 'error');
        }
    };

    const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleCreatePayment = async () => {
        try {
            setIsLoading(true);
            const formData = new FormData();
            
            formData.append('studentId', studentId.toString());
            formData.append('studentClassId', studentClassId.toString());
            formData.append('studentClassManagementPeriodId', studentClassManagementPeriodId.toString());
            formData.append('paymentTypeId', paymentType);
            formData.append('value', paymentValue);
            formData.append('createdBy', '1');
            
            if (paymentAt) {
                formData.append('paymentAt', paymentAt.toISOString());
            }
    
            if (paymentFile) {
                formData.append('filePayment', paymentFile);
            }
    
            const newPayment = await periodService.createStudentPayment(formData);
            
            onUpdatePayments([...studentPeriodPayments, newPayment]);
            
            showSnackbar('Pagamento criado com sucesso!');
            setIsCreateModalOpen(false);
            resetFormStates();
        } catch (error) {
            showSnackbar('Erro ao criar pagamento', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePayment = async () => {
        try {
            setIsLoading(true);
            if (!currentPayment) return;

            const updateDto: UpdateStudentPaymentDto = {
                id: currentPayment.id,
                paymentTypeId: Number(paymentType),
                value: Number(paymentValue),
                paymentAt: paymentAt ? paymentAt.toISOString() : undefined,
                updatedBy: 1
            };

            const updatedPayment = await periodService.updateStudentPayment(updateDto);
            
            const updatedPayments = studentPeriodPayments.map(payment => 
                payment.id === updatedPayment.id ? updatedPayment : payment
            );
            
            onUpdatePayments(updatedPayments);
            
            showSnackbar('Pagamento atualizado com sucesso!');
            setIsEditModalOpen(false);
            resetFormStates();
        } catch (error) {
            showSnackbar('Erro ao atualizar pagamento', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeletePayment = async (paymentId: number) => {
        try {
            setIsLoading(true);
            await periodService.deleteStudentPayment(paymentId);
            
            const updatedPayments = studentPeriodPayments.filter(payment => payment.id !== paymentId);
            onUpdatePayments(updatedPayments);
            
            showSnackbar('Pagamento excluído com sucesso!');
        } catch (error) {
            showSnackbar('Erro ao excluir pagamento', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (currentPayment && isEditModalOpen) {
            setPaymentAt(currentPayment.paymentAt ? new Date(currentPayment.paymentAt) : new Date());
        }
    }, [currentPayment, isEditModalOpen]);

    const sortedPayments = studentPeriodPayments.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const renderPaymentModal = (isCreate: boolean) => (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Dialog 
                open={isCreate ? isCreateModalOpen : isEditModalOpen} 
                onClose={() => {
                    isCreate ? setIsCreateModalOpen(false) : setIsEditModalOpen(false);
                    resetFormStates();
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {isCreate ? 'Criar Novo Pagamento' : 'Editar Pagamento'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField 
                            label="Valor" 
                            type="number"
                            value={paymentValue}
                            onChange={(e) => setPaymentValue(e.target.value)}
                            fullWidth
                            required
                        />
                        <FormControl fullWidth required>
                            <InputLabel>Tipo de Pagamento</InputLabel>
                            <Select
                                value={paymentType}
                                label="Tipo de Pagamento"
                                onChange={(e) => setPaymentType(e.target.value)}
                            >
                                {paymentTypes.map((type) => (
                                    <MenuItem key={type.id} value={type.id}>
                                        {type.type}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <DateTimePicker
                            label="Data do Pagamento"
                            value={paymentAt}
                            onChange={(newValue) => setPaymentAt(newValue)}
                            slotProps={{ textField: { fullWidth: true } }}
                            />
                        <Button 
                            variant="contained" 
                            component="label"
                            startIcon={<DownloadIcon />}
                            color={paymentFile ? 'success' : 'primary'}
                        >
                            {paymentFile ? 'Comprovante Carregado' : 'Upload Comprovante'}
                            <input
                                type="file"
                                hidden
                                onChange={(e) => setPaymentFile(e.target.files?.[0])}
                            />
                        </Button>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={isCreate ? handleCreatePayment : handleUpdatePayment}
                            disabled={!paymentValue || !paymentType || !paymentAt || isLoading}
                        >
                            {isLoading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                isCreate ? 'Criar' : 'Atualizar'
                            )}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </LocalizationProvider>
    );

    return (
        <Box>
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 2 
            }}>
                <Chip 
                    label={`Total Pagamentos: R$ ${studentPeriodPayments.reduce((sum, payment) => sum + payment.value, 0).toFixed(2)}`} 
                    color="primary" 
                />
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<AddIcon />}
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    Criar Pagamento
                </Button>
            </Box>

            {sortedPayments.length === 0 ? (
                <Typography>Não há pagamentos registrados para este aluno.</Typography>
            ) : (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Valor</TableCell>
                                <TableCell>Tipo de Pagamento</TableCell>
                                <TableCell>Data de Criação</TableCell>
                                <TableCell>Última Alteração</TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedPayments.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell>
                                        <Chip 
                                            label={`R$ ${payment.value.toFixed(2)}`} 
                                            color="primary" 
                                            size="small" 
                                        />
                                    </TableCell>
                                    <TableCell>{payment.paymentType.type}</TableCell>
                                    <TableCell>
                                        {format(new Date(payment.createdAt), 'dd/MM/yyyy HH:mm')}
                                    </TableCell>
                                    <TableCell>
                                        {payment.updatedAt 
                                            ? format(new Date(payment.updatedAt), 'dd/MM/yyyy HH:mm')
                                            : 'Não atualizado'
                                        }
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            {payment.fileNameUrl && (
                                                <IconButton 
                                                    color="primary" 
                                                    size="small"
                                                    onClick={() => openProofLink(payment.fileNameUrl)}
                                                    title="Ver Comprovante"
                                                >
                                                    <VisibilityIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                            <IconButton 
                                                color="secondary" 
                                                size="small"
                                                sx={{
                                                    backgroundColor: 'rgba(103, 58, 183, 0.4)', 
                                                    color: 'white', 
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(103, 58, 183, 0.6)', 
                                                    }
                                                }}
                                                disabled={isLoading}
                                                onClick={() => {
                                                    setCurrentPayment(payment);
                                                    setPaymentValue(payment.value.toString());
                                                    setPaymentType(payment.paymentType.id.toString());
                                                    setIsEditModalOpen(true);
                                                }}
                                                title="Editar Pagamento"
                                            >
                                                {isLoading ? (
                                                    <CircularProgress size={20} color="inherit" />
                                                ) : (
                                                    <EditIcon fontSize="small" />
                                                )}
                                            </IconButton>
                                            <IconButton 
                                                color="error" 
                                                size="small"
                                                disabled={isLoading}
                                                onClick={() => handleDeletePayment(payment.id)}
                                                title="Excluir Pagamento"
                                            >
                                                {isLoading ? (
                                                    <CircularProgress size={20} color="inherit" />
                                                ) : (
                                                    <DeleteIcon fontSize="small" />
                                                )}
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {renderPaymentModal(true)}
            {renderPaymentModal(false)}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={() => setSnackbarOpen(false)} 
                    severity={snackbarSeverity}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default StudentPaymentsContent;