import { format } from 'date-fns';
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MLoading from "../../molecules/MLoading";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import BlockIcon from '@mui/icons-material/Block';
import { PageHeader } from "../../pages/Candidate/styles";
import { showErrorToast } from "../../../utils/toast";
import { toast } from "react-hot-toast";
import teamsService from "../../../services/Teams/teams.service";
import { useAuth } from "../../../context/AuthProvider/useAuth";
import { PaymentInfoModal, RegisterPeriodsPayment } from '../../organisms/OPayments/RegisterPayment';
import { parseISO, subHours } from 'date-fns'
import {OStudentBlock} from "../../organisms/OStudentBlock/OStudentBlock";

function TTeamDetail() {
  const { id } = useParams<string>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [teamDetail, setTeamDetail] = useState<any>([]);
  const [students, setStudents] = useState<any>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [openPayment, setOpenPayment] = useState(false);
  const [openBlockStudent, setOpenBlockStudent] = useState(false);
  const [openInfoPayment, setOpenInfoPayment] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState(0);
  const [currentStudentName, setCurrentStudentName] = useState("");
  const [periodId, setPeriodId] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const resp = await teamsService.getTeamById(Number(id));
        if (resp == null) {
          return showErrorToast("Não foi possível realizar a busca dos registros!");
        }
        setTeamDetail(resp.results[0]);
        setStudents(resp.results[0].classStudents);
      } catch (error: any) {
        toast.error(error.message);
      }

      setIsLoading(false);
    };

    fetchData();
  }, [id]);

  const handleCandidateClick = (studentId: number) => {
    navigate(`/teamsDetail/${studentId}/${id}`);
  };

  const handleOpenPeriodsPayment = (studentId: number) => {
    setCurrentStudentId(studentId);
    setOpenPayment(true);
  };

  const handleOpenBlockStudent = (studentId: number, studentName: string) => {
    setCurrentStudentId(studentId);
    setCurrentStudentName(studentName);
    setOpenBlockStudent(true);
  };

  const handleClosedPeriodsPayment = () => {
    setOpenPayment(false);
  };
  
  const handleCloseBlockStudent = () => {
    setOpenBlockStudent(false);
  };

  const handlePeriodButtonClick = (period: number) => {
    setPeriodId(period);
    setOpenInfoPayment(true);
  };

  const handleClosedInfoPeriodsPayment = () => {
    setOpenInfoPayment(false);
  };

  const showActiveStatus = (status: number) => {
    return status === 2 ? <Chip label="Inativo" color="error" size="small" /> : <Chip label="Ativo" color="success" size="small" />
  };

  const TABLE_HEAD = [
    { title: "Aluno", field: "student" },
    { title: "Status", field: "status" },
    { title: "Nota", field: "grade" },
    { title: "Presença", field: "presence" },
    { title: "Módulo", field: "module" },
    { title: "Último Acesso", field: "lastAcess" },
    { title: "Opções", fields: "" }
  ];

  const tableRows = students.map((t: any) => ({
    id: t.studentId,
    student: t.studentName,
    status: t.status,
    grade: <div style={{ fontWeight: 'bold' }}>{t.studentGrade !== null ? t.studentGrade.toFixed(1) : "-"}</div>,
    presence: <div>{t.studentAttendance.toFixed(1)}%</div>,
    module: <div>{t.currentSubModule}</div>,
    lastAcess: <div>{t.lastLogin !== null ? format(subHours(parseISO(t.lastLogin), 3), 'yyyy-MM-dd HH:mm:ss') : null}</div>,
  }));

  const TrailInfos = () => (
    <Box sx={{
      border: '1px solid black',
      borderRadius: 2,
      p: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      my: 2
    }}>
      {teamDetail && teamDetail.studentClassId && (
        <Box key={teamDetail.studentClassId} sx={{ display: 'flex', flexDirection: 'column', fontFamily: 'Inter', gap: 1 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ color: '#4263EB', fontFamily: 'Inter', fontWeight: 'bold' }}>Turma: {teamDetail.name}</Box>
            <Box sx={{ fontFamily: 'Inter', fontWeight: 'bold' }}>Início: {teamDetail.startAt}</Box>
            <Box sx={{ fontFamily: 'Inter', fontWeight: 'bold' }}>Final: {teamDetail.endAt}</Box>
          </Box>
          <Box sx={{ display: 'flex', fontFamily: 'Inter', gap: 2 }}>
            <Box sx={{ fontFamily: 'Inter', fontWeight: 'bold' }}>Quantidade de Alunos: {teamDetail.students}</Box>
            <Box sx={{ fontFamily: 'Inter', fontWeight: 'bold' }}>Nota Média: {teamDetail.grade !== null ? teamDetail.grade.toFixed(1) : null}</Box>
            <Box sx={{ fontFamily: 'Inter', fontWeight: 'bold' }}>Presença: {teamDetail.attendance !== null ? teamDetail.attendance.toFixed(1) : null}</Box>
          </Box>
        </Box>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Button variant="contained" sx={{ minWidth: 100, marginLeft: 2 }} onClick={() => navigate(`/calendar/${Number(id)}`)}>
          Calendário
        </Button>
      </Box>
      {user?.role !== 'company' && (
        <>
          <Button variant="contained" sx={{ minWidth: 100, marginLeft: 2 }} onClick={() => navigate(`/teams/management/${Number(id)}`)}>
            Gerenciamento da turma
          </Button>
          <Button
            variant="contained"
            sx={{ minWidth: 100, marginLeft: 2 }}
            onClick={
              () => navigate(
                `/teams/handsOn/${Number(id)}/trails`,
                  {state: {
                    students: students.map(
                      (student: any) => {
                          const { studentId, studentName } = student;
                          return { studentId, studentName };
                      }),
                    className: teamDetail.name
                  }}
              )
            }
          >
            Presença Hands-On
          </Button>
          <Button 
            variant="contained" 
            sx={{ minWidth: 100, marginLeft: 2 }} 
            onClick={
              () => navigate(
                `/teams/mentoring/${Number(id)}/presence`,
                  {state: {
                    students: students.map(
                      (student: any) => {
                          const { studentId, studentName } = student;
                          return { studentId, studentName };
                    }),
                    startDate: teamDetail.startAt, endDate: teamDetail.endAt,
                    className: teamDetail.name
                  }}
              )
            }
          >
            Presença Mentoria
          </Button>
        </>
      )}
    </Box>
  );

  return (
    <Box>
      <PageHeader>
        <h1>Gestão de Turma</h1>
      </PageHeader>

      {isLoading ? (
        <MLoading />
      ) : (
        <>
          <TrailInfos />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {TABLE_HEAD.map((item: any) => (
                    <TableCell
                      key={item.field}
                      sx={{ alignItems: "center", top: 64, bgcolor: "#4263EB", color: "white" }}>
                      {item.title}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableRows.map((itemRow: any) => (
                  <TableRow key={itemRow.registerPaymentId}>
                    <TableCell>{itemRow.student}</TableCell>
                    <TableCell>{showActiveStatus(itemRow.status)}</TableCell>
                    <TableCell>{itemRow.grade}</TableCell>
                    <TableCell>{itemRow.presence}</TableCell>
                    <TableCell>{itemRow.module}</TableCell>
                    <TableCell>{itemRow.lastAcess}</TableCell>
                    <TableCell>
                      <Tooltip title="Detalhes" arrow>
                        <IconButton onClick={() => handleCandidateClick(itemRow.id)} style={{ marginRight: '8px' }}>
                          <FindInPageIcon sx={{color: 'blue'}} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Visualizar Pagamentos" arrow>
                        <IconButton onClick={() => handleOpenPeriodsPayment(itemRow.id)}>
                          <PaymentIcon  sx={{ color: 'green' }} />
                        </IconButton>
                      </Tooltip> 
                      <Tooltip title="Trancar Mátricula do Aluno" arrow>
                        <IconButton
                            onClick={() => handleOpenBlockStudent(itemRow.id, itemRow.student)}
                            sx={{ color: 'red' }}
                        >
                          <BlockIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Stack alignItems="center">
              <TablePagination
                rowsPerPageOptions={[]}
                component="div"
                count={totalPages}
                rowsPerPage={10}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
              />
            </Stack>
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
              periodId={periodId}
              trash={false}
          />
          
          <OStudentBlock
              open={openBlockStudent}
              onClose={handleCloseBlockStudent}
              studentId={currentStudentId}
              studentName={currentStudentName}
          />
        </>
      )}
    </Box>
  );
}

export default TTeamDetail;
