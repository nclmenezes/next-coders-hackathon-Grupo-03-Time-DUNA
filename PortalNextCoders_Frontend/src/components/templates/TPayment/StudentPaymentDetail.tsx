import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MLoading from "../../molecules/MLoading";
import {
    Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from "@mui/material";
import teamsService from "../../../services/Teams/teams.service";
import { PageHeader } from "../../pages/Candidate/styles";
import { showErrorToast } from "../../../utils/toast";
import { toast } from "react-hot-toast";
import { ClassStudent, StudentPaymentResponse } from "../../../interfaces/teams/class.interfaces";
import { PaymentInfoModal } from "../../organisms/OPayments/RegisterPayment";
import { useAuth } from "../../../context/AuthProvider/useAuth";
import studentPaymentService, { IRegisterPaymentDto } from "../../../services/api/student/studentPayment.service";
import { format } from "date-fns";

function StudentPaymentDetail() {
    const { studentId, classId } = useParams<string>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [student, setStudent] = useState<ClassStudent | null>(null);
    const [studantClassName, setStudantClassName] = useState<string>('');
    const [isPaymentDetailOpen, setIsPaymentDetailOpen] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);
    const auth = useAuth();
    const [paymentData, setPaymentData] = useState<IRegisterPaymentDto[]>([]);

    useEffect(() => {
        const fetchAdminData = async () => {
            setIsLoading(true);

            try {
                const resp = await teamsService.getTeamById(Number(classId));
                if (resp == null) {
                    return showErrorToast("Não foi possível realizar a busca dos registros!");
                }
                const studentData = resp.results[0].classStudents.find(s => s.studentId === Number(studentId));
                setStudent(studentData || null);
                setStudantClassName(resp.results[0].name)
            } catch (error: any) {
                toast.error(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchStudentData = async () => {
            if (!auth.user?.id) return;
            
            setIsLoading(true);
            try {
                // Assuming periods 1, 2, 3 for now. This could be made dynamic if needed.
                const periods = [1, 2, 3];
                const allPayments: IRegisterPaymentDto[] = [];
                for (const period of periods) {
                    const payments = await studentPaymentService.ListRegisters(auth.user.id, period);
                    allPayments.push(...payments);
                }
                setPaymentData(allPayments);
            } catch (error: any) {
                toast.error(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (auth.user?.role === 'student') {
            fetchStudentData();
        } else {
            fetchAdminData();
        }
    }, [studentId, classId, auth.user?.role, auth.user?.id]);

    const handleBack = () => {
        navigate(-1);
    }

    const handlePaymentDetailClick = (period: number) => {
        setSelectedPeriod(period);
        setIsPaymentDetailOpen(true);
    };

    const handleClosePaymentDetail = () => {
        setIsPaymentDetailOpen(false);
        setSelectedPeriod(null);
    };

    if (auth.user?.role === 'student') {
        return (
            <Box>
                <PageHeader>
                    <h1>Detalhes de Pagamento</h1>
                    <Button variant="contained" color="primary" onClick={handleBack}>
                        Voltar
                    </Button>
                </PageHeader>
                {isLoading ? (
                    <MLoading />
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Valor</TableCell>
                                    <TableCell>Tipo de Pagamento</TableCell>
                                    <TableCell>Dia do Pagamento</TableCell>
                                    <TableCell>Anexo</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paymentData.map((payment: IRegisterPaymentDto) => (
                                    <TableRow key={payment.registerPaymentId}>
                                        <TableCell>R${payment.value.toLocaleString(`pt-br`, { minimumFractionDigits: 2 })}</TableCell>
                                        <TableCell>{payment.paymentType.type}</TableCell>
                                        <TableCell>{payment.paymentAt ? format(new Date(payment.paymentAt), 'yyyy-MM-dd') : ''}</TableCell>
                                        <TableCell>
                                            {payment.fileNameUrl ? (
                                                <a href={payment.fileNameUrl} target="_blank" rel="noopener noreferrer">
                                                    Ver Anexo
                                                </a>
                                            ) : (
                                                "Nenhum Anexo"
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        )
    }

    return (
        <Box>
            <PageHeader>
                <h1>Detalhes de Pagamento de {student?.studentName}</h1>
                <Button variant="contained" color="primary" onClick={handleBack}>
                    Voltar
                </Button>
            </PageHeader>

            {isLoading ? (
                <MLoading />
            ) : (
                <>
                    {student && student.studentPaymentResponses && student.studentPaymentResponses.length > 0 ? (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ top: 64, bgcolor: "#4263EB", color: "white" }}>Período</TableCell>
                                        <TableCell sx={{ top: 64, bgcolor: "#4263EB", color: "white" }}>Presença</TableCell>
                                        <TableCell sx={{ top: 64, bgcolor: "#4263EB", color: "white" }}>Nota</TableCell>
                                        <TableCell sx={{ top: 64, bgcolor: "#4263EB", color: "white" }}>Bonificação Mensal</TableCell>
                                        <TableCell sx={{ top: 64, bgcolor: "#4263EB", color: "white" }}>Comprovantes</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {student.studentPaymentResponses.map((payment: StudentPaymentResponse) => (
                                        <TableRow key={payment.periodNumber}>
                                            <TableCell>{payment.periodNumber}</TableCell>
                                            <TableCell>{payment.presence}</TableCell>
                                            <TableCell>{payment.grade}</TableCell>
                                            <TableCell>{payment.monthlyReward.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handlePaymentDetailClick(payment.periodNumber)}
                                                >
                                                    Visualizar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <p>Nenhum detalhe de pagamento disponível.</p>
                    )}
                </>
            )}

            {isPaymentDetailOpen && selectedPeriod && studentId && (
                <PaymentInfoModal
                    open={isPaymentDetailOpen}
                    onClose={handleClosePaymentDetail}
                    studentId={Number(studentId)}
                    periodId={selectedPeriod}
                    trash={false}
                />
            )}
        </Box>
    );
}

export default StudentPaymentDetail;
