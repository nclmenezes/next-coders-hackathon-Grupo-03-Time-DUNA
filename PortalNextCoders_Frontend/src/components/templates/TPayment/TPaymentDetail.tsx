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
import IconButton from "@mui/material/IconButton";
import PaymentIcon from "@mui/icons-material/Payment";
import { PaymentInfoModal, RegisterPeriodsPayment } from "../../organisms/OPayments/RegisterPayment";
import TExportPayment from "./TExportPayment";
import { ClassStudent, StudentPaymentResponse } from "../../../interfaces/teams/class.interfaces";
import { useAuth } from "../../../context/AuthProvider/useAuth";
import { UserRoleEnum } from "../../../enums";
import ArticleIcon from '@mui/icons-material/Article';

function TPaymentDetail() {
    const { id } = useParams<string>();
    const navigate = useNavigate();
    const auth = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [students, setStudents] = useState<ClassStudent[]>([]);
    const [studantClassName, setStudantClassName] = useState<string>('');
    const [filterName, setFilterName] = useState<string>("");
    const [openPayment, setOpenPayment] = useState(false);
    const [openInfoPayment, setOpenInfoPayment] = useState(false);
    const [currentStudentId, seCurrentStudentId] = useState(0);
    const [periodId, setPeriodId] = useState(0);
    const [exportModal, setExportModal] = useState(false);

    useEffect(() => {
        setIsLoading(true);

        const fetchData = async () => {
            setIsLoading(true);

            try {
                const resp = await teamsService.getTeamById(Number(id));
                if (resp == null) {
                    return showErrorToast("Não foi possível realizar a busca dos registros!");
                }
                setStudents(resp.results[0].classStudents);
                setStudantClassName(resp.results[0].name)
            } catch (error: any) {
                toast.error(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleOpenPeriodsPayment = (studentId: number) => {
        seCurrentStudentId(studentId);
        setOpenPayment(true);
    };

    const handleClosedPeriodsPayment = () => {
        setOpenPayment(false);
    };

    const handlePeriodButtonClick = (period: number) => {
        setPeriodId(period);
        setOpenInfoPayment(true)
    };

    const handleClosedInfoPeriodsPayment = () => {
        setOpenInfoPayment(false);
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterName(event.target.value);
    };

    const filteredStudents = students.filter((t: ClassStudent) =>
        t.studentName.toLowerCase().includes(filterName.toLowerCase())
    );

    const tableRows = filteredStudents.map((t: ClassStudent) => ({
        id: t.studentId,
        studentName: t.studentName,
        studentGrade: t.studentGrade !== null ? t.studentGrade.toFixed(1) : "-",
        studentAttendance: t.studentAttendance.toFixed(1),
        studentPaymentResponses: t.studentPaymentResponses,
    }));

    const handleOpenExport = () => {
        setExportModal(true);
    }

    const handleCloseExport = () => {
        setExportModal(false);
    }

    const handleStudentPaymentDetail = (studentId: number) => {
        navigate(`/payments/student/${studentId}/class/${id}`);
    }


    return (
        <Box>
            <PageHeader>
                <h1>Alunos da Turma - {studantClassName}</h1>
            </PageHeader>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <input
                    type="text"
                    placeholder="Filtrar por nome"
                    value={filterName}
                    onChange={handleFilterChange}
                    style={{
                        padding: "8px",
                        marginRight: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        marginBottom: "16px",
                    }}
                />
                <Button variant="contained" color="primary" onClick={handleOpenExport}>
                    Exportar Relatório
                </Button>

                <TExportPayment
                    open={exportModal}
                    onClose={handleCloseExport}
                    studentInfo={students}
                    className={studantClassName}
                />
            </div>

            {isLoading ? (
                <MLoading />
            ) : (
                <>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ top: 64, bgcolor: "#4263EB", color: "white" }}>Nome</TableCell>
                                    <TableCell sx={{ top: 64, bgcolor: "#4263EB", color: "white" }}>Pagamentos</TableCell>
                                    {[...Array(3)].map((_, index) => (
                                        <TableCell key={index} sx={{ top: 64, bgcolor: "#4263EB", color: "white" }}>Bonificação - Período {index + 1}</TableCell>
                                    ))}
                                    {auth.user?.role === UserRoleEnum.admin && (
                                        <TableCell sx={{ top: 64, bgcolor: "#4263EB", color: "white" }}>Detalhes</TableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableRows.map((row: any) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.studentName}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleOpenPeriodsPayment(row.id)}>
                                                <PaymentIcon />
                                            </IconButton>
                                        </TableCell>
                                        {[...Array(3)].map((_, index) => {
                                            const paymentResponse = row.studentPaymentResponses.find((pr: StudentPaymentResponse) => pr.periodNumber === index + 1);
                                            return (
                                                <TableCell>
                                                    {paymentResponse ? paymentResponse.monthlyReward.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00'}
                                                </TableCell>
                                            );
                                        })}
                                        {auth.user?.role === UserRoleEnum.admin && (
                                            <TableCell>
                                                <IconButton onClick={() => handleStudentPaymentDetail(row.id)}>
                                                    <ArticleIcon />
                                                </IconButton>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <RegisterPeriodsPayment
                        open={openPayment}
                        onClose={handleClosedPeriodsPayment}
                        onPeriodButtonClick={handlePeriodButtonClick}
                    />

                    <PaymentInfoModal
                        open={openInfoPayment}
                        onClose={handleClosedInfoPeriodsPayment}
                        studentId={currentStudentId}
                        periodId={periodId} />
                </>
            )}
        </Box>
    );
}

export default TPaymentDetail;