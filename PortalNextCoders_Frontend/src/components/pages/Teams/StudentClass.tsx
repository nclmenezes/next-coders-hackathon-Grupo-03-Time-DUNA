import { format } from 'date-fns';
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import MLoading from "../../molecules/MLoading";
import {
  Box, Button, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip,
  Typography,
} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import { showErrorToast } from "../../../utils/toast";
import { toast } from "react-hot-toast";
import teamsService from "../../../services/Teams/teams.service";
import { useAuth } from "../../../context/AuthProvider/useAuth";
import { PaymentInfoModal, RegisterPeriodsPayment } from '../../organisms/OPayments/RegisterPayment';
import { parseISO, subHours } from 'date-fns'
import { StudentClassListPagination, IStudentClassData, ClassStudent } from "../../../interfaces/teams/class.interfaces";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { ILocationState } from '../../../interfaces/teams/class.interfaces';

const TABLE_HEAD = [
  { title: "Aluno", field: "student" },
  { title: "Nota", field: "grade" },
  { title: "Presença", field: "presence" },
  { title: "Módulo", field: "module" },
  { title: "Último Acesso", field: "lastAcess" },
  { title: "Opções", fields: "" }
];

function StudentClass() {
  const { studentClassManagementId, studentClassId } = useParams<string>();
  const { user } = useAuth();
  const location = useLocation();
  const state = location.state as ILocationState;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [studentClassData, setStudentClassData] = useState<IStudentClassData | undefined>(undefined);
  const [students, setStudents] = useState<ClassStudent[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [openPayment, setOpenPayment] = useState(false);
  const [openInfoPayment, setOpenInfoPayment] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState(0);
  const [periodId, setPeriodId] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (state && state.studentClassData) {
          setStudentClassData(state.studentClassData);
          setStudents(state.studentClassData.classStudents);
          return setIsLoading(false);
        }
        const _studentClassData: StudentClassListPagination | null = await teamsService.getTeamById(Number(studentClassId));
        if (!_studentClassData) return showErrorToast("Não foi possível realizar a busca dos registros!");
        setStudentClassData(_studentClassData.results ? _studentClassData.results[0] : undefined);
        setStudents(_studentClassData.results ? _studentClassData.results[0].classStudents : []);
      } catch (error: any) {
        toast.error(error.message);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [studentClassId]);

  const handleCandidateClick = (studentId: number) => {
    navigate(
      `/teamsDetail/${studentId}/${studentClassId}`,
      { 
        state: {
          isFromNewApi: { studentClassManagementId, studentClassId }
        } 
      }
    );
  };

  const handleOpenPeriodsPayment = (studentId: number) => {
    setCurrentStudentId(studentId);
    setOpenPayment(true);
  };

  const handleClosedPeriodsPayment = () => {
    setOpenPayment(false);
  };

  const handlePeriodButtonClick = (period: number) => {
    setPeriodId(period);
    setOpenInfoPayment(true);
  };

  const handleClosedInfoPeriodsPayment = () => {
    setOpenInfoPayment(false);
  };

  const tableRows = students.map((student: ClassStudent) => ({
    id: student.studentId,
    student: student.studentName,
    grade: <div style={{ fontWeight: 'bold' }}>{student.studentGrade !== null ? student.studentGrade.toFixed(1) : "-"}</div>,
    presence: <div>{student.studentAttendance.toFixed(1)}%</div>,
    module: <div>{student.currentSubModule}</div>,
    lastAcess: <div>{student.lastLogin !== null ? format(subHours(parseISO(student.lastLogin), 3), 'yyyy-MM-dd HH:mm:ss') : null}</div>,
  }));

  const TrailInfos = () => {
    if (studentClassData == undefined) return null;
    const displayAdminButtons = user?.role !== 'company' ? 'initial' : 'none';
    return (
      <Box
        sx={{
          border: '1px solid black',
          borderRadius: 2,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '25px',
          my: 2
        }}
      >
        <Box key={studentClassData.studentClassId} sx={{ display: 'flex', flexDirection: 'column', fontFamily: 'Inter', gap: 1 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ color: '#4263EB', fontFamily: 'Inter', fontWeight: 'bold' }}>Turma: {studentClassData.name}</Box>
            <Box sx={{ fontFamily: 'Inter', fontWeight: 'bold' }}>Início: {state.managementLocation?.managementClasses.find(el => el.id === Number(studentClassManagementId))?.startAt}</Box>
            <Box sx={{ fontFamily: 'Inter', fontWeight: 'bold' }}>Final: {state.managementLocation?.managementClasses.find(el => el.id === Number(studentClassManagementId))?.endAt}</Box>
          </Box>
          <Box sx={{ display: 'flex', fontFamily: 'Inter', gap: 2 }}>
            <Box sx={{ fontFamily: 'Inter', fontWeight: 'bold' }}>Quantidade de Alunos: {studentClassData.students}</Box>
            <Box sx={{ fontFamily: 'Inter', fontWeight: 'bold' }}>Nota Média: {studentClassData.grade !== null ? studentClassData.grade.toFixed(1) : null}</Box>
            <Box sx={{ fontFamily: 'Inter', fontWeight: 'bold' }}>Presença: {studentClassData.attendance !== null ? studentClassData.attendance.toFixed(1) : null}</Box>
          </Box>
          <Box sx={{ color: '#4263EB', fontFamily: 'Inter', fontWeight: 'bold', display: displayAdminButtons}}>Turma mãe: {state.managementLocation?.managementClasses.find(el => el.id === Number(studentClassManagementId))?.name}</Box>
        </Box>
      
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 2,
            width: '100%',
            maxWidth: 500
          }}
        >
          <Button
            variant="contained"
            sx={{ minWidth: 150, maxWidth: 200, flex: '1 0 45%' }}
            onClick={() => navigate(`/calendar/${Number(studentClassId)}`)}
          >
            Calendário
          </Button>
        
          <Button
            variant="contained"
            sx={{ minWidth: 150, flex: '1 0 45%', display: displayAdminButtons }}
            onClick={() => navigate(`/managementClass/${studentClassManagementId}/${state.agentLocation?.agentClasses.find(el => el.studentClassReferenceId === Number(studentClassId))?.id }/edit`, {state: {...state, navigateBack: location.pathname}})}
          >
            Gerenciamento da turma
          </Button>

          <Button
            variant="contained"
            sx={{ minWidth: 150, flex: '1 0 45%', display: displayAdminButtons }}
            onClick={() =>
              navigate(`/teams/handsOn/${Number(studentClassId)}/trails`, {
                state: {
                  ...state,
                  navigateBack: location.pathname,
                  studentClassData,
                  students: students.map((student) => {
                    const { studentId, studentName } = student;
                    return { studentId, studentName };
                  }),
                  className: studentClassData.name,
                }
              })
            }
          >
            Presença Hands-On
          </Button>

          <Button
            variant="contained"
            sx={{ minWidth: 150, flex: '1 0 45%', display: displayAdminButtons }}
            onClick={() =>
              navigate(`/teams/mentoring/${Number(studentClassId)}/presence`, {
                state: {
                  ...state,
                  navigateBack: location.pathname,
                  studentClassData,
                  students: students.map((student) => {
                    const { studentId, studentName } = student;
                    return { studentId, studentName };
                  }),
                  startDate: studentClassData.startAt,
                  endDate: studentClassData.endAt,
                  className: studentClassData.name
                }
              })
            }
          >
            Presença Mentoria
          </Button>
        </Box>
      </Box>
    );
  };

  const navigateBack = (): void => {
    if (!state) navigate(`/managementClass/${studentClassManagementId}`, { replace: false });
    else navigate(`/managementClass/${studentClassManagementId}`, { replace: true, state });
  };

  return (
    <Box>
      <Box
          sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
          }}
      >
          <Typography
              variant="h1"
              fontFamily={'Inter'}
              fontWeight={600}
              fontSize={28}
          >
              Gestão de Turma
          </Typography>
          <Box
              sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '5px',
                  color: 'white',
                  bgcolor: '#4263EB',
                  padding: '5px 0',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  userSelect: 'none',
                  width: '120px'
              }}
              onClick={navigateBack}
          >
              <KeyboardBackspaceIcon />
              <Typography>Voltar</Typography>
          </Box>
      </Box>

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
                      sx={{ alignItems: "center", top: 64, bgcolor: "#4263EB", color: "white" }}
                    >
                      { item.title }
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  tableRows.map((itemRow: any) => (
                    <TableRow key={itemRow.registerPaymentId}>
                      <TableCell>{itemRow.student}</TableCell>
                      <TableCell>{itemRow.grade}</TableCell>
                      <TableCell>{itemRow.presence}</TableCell>
                      <TableCell>{itemRow.module}</TableCell>
                      <TableCell>{itemRow.lastAcess}</TableCell>
                      <TableCell>
                        <Tooltip title="Detalhes" arrow>
                          <IconButton onClick={() => handleCandidateClick(itemRow.id)} style={{ marginRight: '8px' }}>
                            <FindInPageIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Visualizar Pagamentos" arrow>
                          <IconButton onClick={() => handleOpenPeriodsPayment(itemRow.id)}>
                            <PaymentIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>

                    </TableRow>
                  ))
                }
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
        </>
      )}
    </Box>
  );
}

export default StudentClass;
