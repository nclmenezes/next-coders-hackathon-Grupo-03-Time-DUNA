import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Typography,
  Tab,
  Tabs,
  Paper,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContentText,
  Avatar,
  SelectChangeEvent,
  DialogContent,
  IconButton,
  Autocomplete,
  TextField
} from "@mui/material";
import { styled } from "@mui/material/styles";
import WarningIcon from '@mui/icons-material/Warning';

import { formatDate } from "../../../utils/format";
import ConfirmationDialog from "../../atoms/ConfirmationDialog";
import OCandidateExam from "./OCandidateExamList";
import OCandidateInformation from "./OCandidateInformation";

import {
  CandidateDetailInterface,
  QuestionInterface,
} from "../../../interfaces/candidate.interface";
import CandidateService from "../../../services/candidate.service";
import ExamService from "../../../services/api/classes/exam.service";
import {
  showErrorToast,
  showSuccessToast,
  showLoadingToast,
  dismissToast,
} from "../../../utils/toast";
import { theme } from "../../../styles/theme";
import { getInitialsFromFullName } from "../../../utils/get-initials-from-full-name";
import { MEditCandidateStatus } from "../../molecules/MCandidateStatus/MEditCandidateStatus";

import agentsService from "../../../services/Teams/agents.service";
import managementClassesService from "../../../services/Teams/classes/managementClasses.service";
import { ResponsePagination, AgentDto, IManagementClass, IAgentClass } from "../../../interfaces/teams/class.interfaces";
import MLoading from "../../molecules/MLoading";

import ACandidateConfirm from "../../atoms/ACandidateConfirm/ACandidateConfirm";
import MCandidateClass from "../../molecules/MCandidateClass/MCandidateClass";

interface StudentAnswer {
  answer: string;
  isCorrect: boolean;
}

interface Question {
  question: string;
  studentAnswer: StudentAnswer;
  correctAnswer: StudentAnswer;
}

function transformQuestions(questions: QuestionInterface[]): Question[] {
  return questions.map((q) => ({
    question: q.text,
    studentAnswer:
      q.candidateAnswers.length > 0
        ? {
            answer: q.candidateAnswers[0].text,
            isCorrect: q.isCandidateAnswersCorrect,
          }
        : { answer: "", isCorrect: false },
    correctAnswer:
      q.correctAnswers.length > 0
        ? { answer: q.correctAnswers[0].text, isCorrect: true }
        : { answer: "", isCorrect: false },
  }));
}

const CandidateDetailsWrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const InformationWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(3),
}));

interface SimpleDialogProps {
  classes: any[];
  open: boolean;
  selectedValue?: string;
  onClose: (value?: string) => void;
  profileId: number;
  withoutTest: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const ClassesDialog = (props: SimpleDialogProps) => {
  const navigate = useNavigate();

  const { classes, onClose, selectedValue, open, profileId, withoutTest, setIsLoading } = props;
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const [activeContractors, setActiveContractors] = useState<AgentDto[]>([]);

  const [activeManagementClasses, setActiveManagementClasses] = useState<IManagementClass[]>([]);

  const [filterManagementClasses, setFilterManagementClasses] = useState<IManagementClass[]>([]);
  const [filterStudentClasses, setFilterStudentClasses] = useState<IAgentClass[]>([]);

  const [selectContractorId, setSelectContractorId] = useState<number | null>(null);
  const [selectManagementClassId, setSelectManagementClassId] = useState<number | null>(null);
  const [selectStudentClassId, setSelectStudentClassId] = useState<number | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    await getActiveContractors();
    await getActiveManagementClasses();
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectContractorId || !activeManagementClasses) return;
    setFilterManagementClasses(
      activeManagementClasses.filter(
        (managementClass: IManagementClass) => managementClass.contractor.id === selectContractorId
      )
    );
  }, [selectContractorId]);

  useEffect(() => {
    if (!selectManagementClassId || !filterManagementClasses) return;
    setFilterStudentClasses(
      filterManagementClasses.find(
        (managementClass: IManagementClass) => managementClass.id === selectManagementClassId
      )!.studentClasses
    );
  }, [selectManagementClassId]);

  const handleClose = () => {
    onClose(selectedValue);
  };

  const getActiveContractors = async () => {
    const _activeContractors: ResponsePagination<AgentDto[]> | null = await agentsService.GetAgents(1, 30);
    if (!_activeContractors?.data) {
      showErrorToast("Nenhum contratante foi encontrado!", { duration: 2000 });
      return setActiveContractors([]);
    };
    setActiveContractors(_activeContractors.data);
  };

  const getActiveManagementClasses = async () => {
    const _activeClasses: ResponsePagination<IManagementClass[]> | null = await managementClassesService.GetManagementClasses(1, 30, null);
    if (!_activeClasses?.data) {
      showErrorToast("Nenhuma turma mãe foi encontrada!", { duration: 2000 });
      return setActiveManagementClasses([]);
    };
    setActiveManagementClasses(_activeClasses.data);
  };

  const handleSelectContractor = (event: SelectChangeEvent) => {
    const selectedValue = event.target.value;
    if (selectedValue == undefined) return;
    setSelectContractorId(Number(selectedValue));
    setSelectManagementClassId(null);
    setSelectStudentClassId(null);
  };

  const handleSelectManagementClass = (event: SelectChangeEvent) => {
    const selectedValue = event.target.value;
    if (selectedValue == undefined) return;
    setSelectContractorId(Number(selectedValue));
    setSelectStudentClassId(null);
  };

  const handleSelectStudentClass = (event: SelectChangeEvent) => {
    const selectedValue = event.target.value;
    if (selectedValue == undefined) return;
    setSelectManagementClassId(Number(selectedValue));
  };

  const handleConfirmDialog = () => {
    setConfirmationOpen(true);
  };

  const handleConfirm = async () => {
    const toastId = showLoadingToast("Aprovando candidato...", {
      position: "top-center",
    });

    if (!selectStudentClassId || !selectContractorId) return;

    try {
      if (withoutTest) {
        await CandidateService.approveCandidateWithoutTest(profileId, selectStudentClassId, {
          contractorId: selectContractorId,
          contractorCoverageId: 0
        });
      }
      else {
        await CandidateService.approveCandidate(profileId, selectStudentClassId, {
          contractorId: selectContractorId,
          contractorCoverageId: 0
        });
      }
      showSuccessToast("Candidato Aprovado", {duration: 2000})
      navigate("/candidates");
    } catch (error) {
      console.log(error)
      showErrorToast("Candidato nâo pode ser Aprovado.", {
        duration: 2000,
      });
      navigate("/candidates");
    }
    dismissToast(toastId);
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="sm">
      <ConfirmationDialog
              open={confirmationOpen}
              onClose={() => setConfirmationOpen(false)}
              onConfirm={() => {
                handleConfirm();
                handleClose();
              }}
              message={"Informações da turma de destino"}
      />
      <DialogTitle>Onde o candidato será aprovado?</DialogTitle>
      <DialogContent sx={{ width: 500 }}>
        <Autocomplete
          options={activeContractors}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => <TextField {...params} label="Contratante da turma" />}
          value={activeContractors.find(el => el.id === selectContractorId) ?? null}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(_, value) => {
            setSelectContractorId(value?.id ?? null);
            setSelectManagementClassId(null);
            setSelectStudentClassId(null);
          }}
          sx={{ mt: 3 }}
        />
        {selectContractorId && (
          <Autocomplete
            options={filterManagementClasses ?? []}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} label="Turma mãe" />}
            value={filterManagementClasses?.find(el => el.id === selectManagementClassId) ?? null}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(_, value) => {
              setSelectManagementClassId(value?.id ?? null);
              setSelectStudentClassId(null);
            }}
            sx={{ mt: 3 }}
          />
        )}
        {selectManagementClassId && (
          <Autocomplete
            options={filterStudentClasses ?? []}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params} label="Turma filha" />}
            value={filterStudentClasses?.find(el => el.studentClassReferenceId === selectStudentClassId) ?? null}
            isOptionEqualToValue={(option, value) => option.studentClassReferenceId === value.studentClassReferenceId}
            onChange={(_, value) => setSelectStudentClassId(value?.studentClassReferenceId ?? null)}
            sx={{ mt: 3 }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button
          onClick={handleConfirmDialog}
          variant="contained"
          color="primary"
          sx={{display: (selectContractorId && selectManagementClassId && selectStudentClassId) ? 'initial' : 'none'}}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const OCandidateDetails = () => {
  const { id } = useParams<string>();
  const [selectedTab, setSelectedTab] = useState(0);
  const [candidateDetail, setCandidateDetail] =
    useState<CandidateDetailInterface | null>();

  const [socioExam, setSocioExam] =
    useState<QuestionInterface[] | null>();    
  const [details, setDetails] = useState<any[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [socioQuestions, setSocioQuestions] = useState<Question[]>([]);
  const [candidateDetailLoaded, setCandidateDetailLoaded] = useState(false);

  const [activeClasses, setActiveClasses] = useState<any[]>([]);

  const [openClassesDialog, setOpenClassesDialog] = useState(false);

  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [action, setAction] = useState("");
  const [editStatus, setEditStatus] = useState(false);
  const [showConfirmationPopUp, setShowConfirmationPopUp] = useState(false);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [candidateConfirm, setCandidateConfirm] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const respDetails = await ExamService.getExamCandidateManagmentByProfileId(
        Number(id)
      );
      const respExam = await ExamService.getExamCandidateManagmentByProfileId(Number(id), "3")
      setCandidateDetailLoaded(true);
      if (respDetails === null)
        return showErrorToast(
          "Não foi possível realizar a busca dos registros!"
        );

      
      setSocioExam(respExam.data.questions)
      setCandidateDetail(respDetails.data);
    })();

  }, [id]);

  useEffect(() => {
    (async () => {
      if (candidateDetail != null) {
        const details = [
          {
            label: "Nome",
            value: `${candidateDetail.profile.firstName} ${candidateDetail.profile.lastName}`,
          },
          { label: "Apelido", value: candidateDetail.profile.nickname },
          {
            label: "Data de Nascimento",
            value: formatDate(
              candidateDetail.profile.profileDetail.birthDate.toString()
            ),
          },
          {
            label: "E-mail",
            value:
              candidateDetail.profile.emails.length > 0
                ? candidateDetail.profile.emails[0].emailAddress
                : "N/A",
          },
          {
            label: "Telefone",
            value:
              candidateDetail.profile.phones.length > 0
                ? `(${candidateDetail.profile.phones[0].areaCode}) ${candidateDetail.profile.phones[0].phoneNumber}`
                : "N/A",
          },
          {
            label: "Cidade/Estado",
            value:
              candidateDetail.profile.addresses.length > 0
                ? `${candidateDetail.profile.addresses[0].city}/${candidateDetail.profile.addresses[0].state}`
                : "N/A",
          },
        ];

        setDetails(details);
        setQuestions(transformQuestions(candidateDetail?.questions));
        setSocioQuestions(transformQuestions(socioExam!))
      }
    })();
  }, [candidateDetail]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleConfirm = async (value: any) => {
    var msg = "Repovando candidato...";
    if (action === "aprovar") 
      msg = "Apovando candidato...";
    const toastId = showLoadingToast(msg, {
      position: "top-center",
    });

    try {
      let data;

      if (action === "aprovar") {
        // @ts-ignore
        data = await CandidateService.approveCandidate(Number(id), value);
        showSuccessToast("Candidato Aprovado", {
          duration: 2000,
        });
      } else if (action === "bloquear") {
        data = await CandidateService.blockCandidate(Number(id));
      }

      navigate("/candidates");
    } catch (error) {
      showSuccessToast("Candidato Aprovado", {
        duration: 2000,
      });
      navigate("/candidates");
    }

    setConfirmationOpen(false);
    dismissToast(toastId);
  };

  const handleOpenClassesDialog = () => {
    setOpenClassesDialog(true);
  };

  const handleCloseClassesDialog = (value?: string) => {
    if (value) {
      handleConfirm(Number(value));
    }

    setOpenClassesDialog(false);
  };

  const handleOpenEditStatusModal = () => {
    setEditStatus(true);
  };

  const handleCloseEditStatusModal = () => {
    setEditStatus(false);
  };  

  return (
    <>
      {isLoading && <MLoading />}
      <Box
        sx={{
          position: "relative"
        }}
      >
        {
          candidateDetail &&
          <Dialog open={candidateConfirm}>
            <MCandidateClass
              profileId={candidateDetail.profile.id}
              studentId={candidateDetail.studentId}
              studentName={candidateDetail.profile.firstName}
              studentEmail={candidateDetail.profile.emails[0].emailAddress}
              setCandidateConfirm={setCandidateConfirm}
            />
          </Dialog>
        }
        <Dialog
        open={showConfirmationPopUp}
        onClose={() => setShowConfirmationPopUp(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <IconButton aria-label="warning" color="warning">
            <WarningIcon fontSize="large" />
          </IconButton>
          {'Atenção'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Você tem certeza que quer aprovar um aluno que ainda não realizou o vestibular?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmationPopUp(false)}>Sair</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setShowConfirmationPopUp(false);
              setAction("aprovar");
              handleOpenClassesDialog();
            }}
            autoFocus
          >
            Continuar
          </Button>
        </DialogActions>
      </Dialog>
        {candidateDetailLoaded ? (
          <Box sx={{ width: "100%", marginTop: "30px" }}>
            <Typography variant="h5" padding={"10px"}>
              Detalhes do Candidato
            </Typography>
            <CandidateDetailsWrapper elevation={3}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={2}
              >
                <Typography
                  variant="h5"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Avatar
                    sx={{ bgcolor: theme.palette.primary.main, fontSize: 16 }}
                  >
                    {getInitialsFromFullName(
                      candidateDetail?.profile.firstName +
                        " " +
                        candidateDetail?.profile.lastName
                    )}
                  </Avatar>
                  <span style={{ marginLeft: "0.5rem" }}>
                    {candidateDetail?.profile.firstName}{" "}
                    {candidateDetail?.profile.lastName}
                  </span>
                </Typography>

                <Box display="flex" alignItems="center">
                  <ClassesDialog
                    open={openClassesDialog}
                    onClose={handleCloseClassesDialog}
                    classes={activeClasses}
                    profileId={Number(id)}
                    withoutTest={(candidateDetail?.statusId ?? 0) >= 3 && (candidateDetail?.statusId ?? 0) < 5}
                    setIsLoading={setIsLoading}
                  />
                  <MEditCandidateStatus
                    candidateId={candidateDetail?.studentId! || 0}
                    currentCandidateStatusId={candidateDetail?.statusId! || 0}
                    isOpen={editStatus}
                    onClose={handleCloseEditStatusModal}
                  />
                  <Button
                    variant="contained"
                    sx={{ marginRight: "8px" }}
                    onClick={() => {
                      setAction("aprovar");

                      handleOpenEditStatusModal();
                    }}
                  >
                    EDITAR STATUS
                  </Button>                
                  <Button
                    variant="contained"
                    sx={{ marginRight: "10px" }}
                  >
                    ENTREVISTA
                  </Button>                
                  <Button
                    variant="contained"
                    disabled={(candidateDetail?.statusId ?? 0) < 3}
                    sx={{ marginRight: "10px" }}
                    onClick={() => {
                      if((candidateDetail?.statusId ?? 0) >= 3 && (candidateDetail?.statusId ?? 0) < 5) {
                        setShowConfirmationPopUp(true)
                      }
                      else {
                        setAction("aprovar");
                        handleOpenClassesDialog();
                      }
                    }}
                  >
                    {(candidateDetail?.statusId ?? 0) >= 3 && (candidateDetail?.statusId ?? 0) < 5 ? "APROVAR SEM VESTIBULAR [Descontinuado]" : "APROVAR [Descontinuado]"}
                  </Button>

                  <Button
                    variant="contained"
                    sx={{ marginRight: "10px" }}
                    onClick={() => setCandidateConfirm(true)}
                  >
                    Aprovar
                  </Button>

                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      setAction("bloquear");
                      setConfirmationOpen(true);
                    }}
                  >
                    BLOQUEAR
                  </Button>
                </Box>
                <ConfirmationDialog
                  open={confirmationOpen}
                  onClose={() => setConfirmationOpen(false)}
                  onConfirm={handleConfirm}
                  message={`Você tem certeza que deseja ${
                    action === "aprovar" ? "aprovar" : "bloquear"
                  }?`}
                />
              </Box>
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                aria-label="user page tabs"
                variant="fullWidth"
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab label="Informações" />
                <Tab label="Exame comportamental"/>
                {questions.length > 0 ? (
                  <Tab label="VESTIBULAR" />
                ) : (
                  <Tab label="VESTIBULAR [NÃO FINALIZADO]" disabled />
                )}
              </Tabs>
              <Box sx={{ padding: "10px" }}>
                {selectedTab === 0 && (
                  <InformationWrapper>
                    <OCandidateInformation details={details} />
                  </InformationWrapper>
                )}
                {selectedTab === 1 && (
                  <InformationWrapper>
                    <OCandidateExam questions={socioQuestions} type={3} />
                  </InformationWrapper>
                )}              
                {selectedTab === 2 && (
                  <InformationWrapper>
                    <OCandidateExam questions={questions} type={2}/>
                  </InformationWrapper>
                )}
              </Box>
            </CandidateDetailsWrapper>
          </Box>
        ) : (
          <MLoading />
        )}
      </Box>
    </>
  );
};

export default OCandidateDetails;
