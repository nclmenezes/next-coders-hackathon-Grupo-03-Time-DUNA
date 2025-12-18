import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import {
  Avatar,
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  useTheme,
  Grid,
} from "@mui/material";

import candidateService from "../../../services/candidate.service";
import { getInitialsFromFullName } from "../../../utils/get-initials-from-full-name";
import { MTableGrid } from "../../molecules/MGrid/MTableGrid";

import { ActiveFilters, PageControlBar, PageHeader } from "./styles";
import MLoading from "../../molecules/MLoading";
import {format} from 'date-fns';
import { showNotFoundErrorToast } from "../../../utils/toast";
import SearchIcon from "@mui/icons-material/Search";

function CandidateList() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState<any[]>([]);
  const [profileStatus, setProfileStatus] = useState<any[]>([]);
  const [studentStatus, setStudentStatus] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [finishedDate, setFinishedDate] = useState("");
  const [name, setName] = useState("");
  const [situation, setSituation] = useState<string>("");
  const [contractorId, setContractorId] = useState(0);
  const [status, setStatus] = useState<string>("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [defaultRowsPerPage] = useState(10);
  const [rowsPerPage, setRowsPerPage] = useState(0);
  const [candidateNotFound, setCandidateNotFound] = useState(false);

  const getCandidates = async () => {
    setIsLoading(true);
    const profilesData = await candidateService.getProfilesWithFinishedExams({
      page: page + 1,
      pageSize: rowsPerPage,
      name: name,
      profileStatus: situation,
      candidateStatus: status,
      contractorId: contractorId,
      city: city,
      finishDate: finishedDate,
      state: province,
    });

    const studentStatusData = await candidateService.getStudentStatus();
    const profileStatusData = await candidateService.getProfileStatus();

    setIsLoading(false);
    setCandidateNotFound(profilesData.userNotFound);
    setCandidates(profilesData.results);
    setTotalPages(profilesData.totalRecords);

    setStudentStatus(studentStatusData);
    setProfileStatus(profileStatusData);
  };

  useEffect(() => {
    getCandidates();
  }, [page, rowsPerPage]);

  useEffect(() => {
    setRowsPerPage(defaultRowsPerPage);
  }, [defaultRowsPerPage]);

  useEffect(() => {
    if (candidateNotFound) {
      showNotFoundErrorToast(`Candidato com o filtro informado não encontrado!`, {
        duration: 5000,
      });
     setCandidateNotFound(false);
    }
  }, [candidateNotFound]);

  const TABLE_HEAD = [
    {
      title: "Nome",
      field: "name",
      minWidth: 200,
    },
    {
      title: "Email",
      field: "email",
    },
    {
      title: "Telefone",
      field: "phone",
      minWidth: 145,
    },
    {
      title: "CPF",
      field: "nationalIdentityNumber",
      minWidth: 150,
    },
    {
      title: "Cidade",
      field: "city",
    },
    {
      title: "Estado",
      field: "state",
    },
    {
      title: "Exame finalizado",
      field: "finishedExamAt",
    },
    {
      title: "Status",
      field: "status",
    },
    {
      title: "Nota",
      field: "grade",
    },
    {
      title: "Situação",
      field: "situation",
    },
    {
      title: "",
      field: "details",
    },
  ];

  const tableRows = candidates.map((candidate) => ({
    id: candidate.id,
    name: <div>{candidate.fullName}</div>,
    avatar: (
      <Avatar sx={{ bgcolor: theme.palette.primary.main, fontSize: 16 }}>
        {getInitialsFromFullName(candidate.fullName)}
      </Avatar>
    ),
    email: <div>{candidate.mail}</div>,
    phone: <div>{candidate.telephoneNumber}</div>,
    situation: (
      <Chip
        label={candidate.candidateSituation === "Ativo" ? "Ativo" : "Inativo"}
        color={candidate.candidateSituation === "Ativo" ? "primary" : "default"}
        sx={{ minWidth: 60 }}
      />
    ),
    grade: (
      <div style={{ textAlign: "center", fontWeight: "bold" }}>
        {candidate.grade ? Number(candidate.grade).toFixed(1) : "-"}
      </div>
    ),
    status: <div>{candidate.candidateStatus}</div>, finishedExamAt: <div>{candidate.finishedExamAt ? format(new Date(candidate.finishedExamAt), 'dd/MM/yyyy HH:mm:ss') : ""}</div>,
    state: <div>{candidate.state}</div>,
    city: <div>{candidate.city}</div>,
    nationalIdentityNumber: <div>{candidate.nationalIdentityNumber}</div>,
  }));

  const handleFilterName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleFilterSituation = (event: SelectChangeEvent) => {
    setSituation(event.target.value);
  };

  const handleFilterStatus = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };

  const handleCityName = (event: ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };  
  
  const handleStateName = (event: ChangeEvent<HTMLInputElement>) => {
    setProvince(event.target.value);
  };

  const handleCandidateClick = (candidateId: number) => {
    navigate(`/candidates/detail/${candidateId}`);
  };

  const handlePaginationClick = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleFilterButtonClick = () => {
    getCandidates();
  };
  
  const handleCleanFilterButtonClick = () => {
    setName("");
    setSituation("");
    setStatus("");
    setCity("");
    setProvince("");
    setFinishedDate("");
  };

  return (
    <Box>
      <PageHeader>
        <h1>Candidatos</h1>
        <ActiveFilters>
          {situation !== "" && (
            <Chip label="Situação" color="primary" onDelete={() => setSituation("")} />
          )}
          {status !== "" && (
            <Chip label="Status" color="primary" onDelete={() => setStatus("")} />
          )}
        </ActiveFilters>
      </PageHeader>

      <PageControlBar>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <TextField
                label="Nome do Candidato"
                value={name}
                variant="outlined"
                onChange={handleFilterName}
                inputProps={{ maxLength: 50, autoComplete: "off" }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel id="status-select-label">Status</InputLabel>
              <Select
                labelId="status-select-label"
                value={status}
                label="Status"
                onChange={handleFilterStatus}
              >
                {studentStatus.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel id="situation-select-label">Situação</InputLabel>
              <Select
                labelId="situation-select-label"
                value={situation}
                label="Situação"
                onChange={handleFilterSituation}
              >
                {profileStatus.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <TextField
                label="Cidade"
                value={city}
                variant="outlined"
                onChange={handleCityName}
                inputProps={{ maxLength: 50, autoComplete: "off" }}
              />
            </FormControl>
          </Grid> 
          <Grid item xs={3}>
            <FormControl fullWidth>
              <TextField
                label="Sigla do Estado"
                value={province}
                variant="outlined"
                onChange={handleStateName}
                inputProps={{ maxLength: 50, autoComplete: "off" }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <FormControl fullWidth>
              <TextField
                label="Data de Finalização"
                type="text"
                variant="outlined"
                inputProps={{
                  maxLength: 10,
                  pattern: "\\d{2}/\\d{2}/\\d{4}",
                  autoComplete: "off",
                }}
                value={finishedDate}
                onChange={(event) => {
                  const inputDate = event.target.value;
                  const formattedDate = inputDate
                    .replace(/\D/g, "")
                    .replace(/(\d{2})(\d)/, "$1/$2")
                    .replace(/(\d{2})(\d)/, "$1/$2");

                  setFinishedDate(formattedDate);
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={1}>
            <FormControl fullWidth>
              <InputLabel id="rows-per-page-label">
                Registros
              </InputLabel>
              <Select
                labelId="rows-per-page-label"
                value={rowsPerPage}
                defaultValue={10}
                label="Registros"
                onChange={(event) => {
                  const value = parseInt(event.target.value as string);
                  setRowsPerPage(value);
                }}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={1}>
            <Button
              variant="contained"
              sx={{ minWidth: 100, bgcolor: "#679d12", top: '10px', left: '15px' }}
              onClick={handleFilterButtonClick}
            >
              <SearchIcon/>Filtrar
            </Button>
          </Grid>
          
          <Grid item xs={2}>
            <Button
              variant="contained"
              sx={{  bgcolor: "#e38d23", minWidth: 100, top: '10px', left: '15px' }}
              onClick={handleCleanFilterButtonClick}
            >
                Limpar
            </Button>
          </Grid>
        </Grid>
      </PageControlBar>

      {isLoading ? (
        <MLoading />
      ) : (
        <MTableGrid
          tableHead={TABLE_HEAD}
          tableRows={tableRows}
          // rowCallback={handleCandidateClick}
          handleCandidateClick={handleCandidateClick}
          paginationConfig={{
            page,
            totalPages,
          }}
          paginationCallback={handlePaginationClick}
          rowsPerPage={rowsPerPage}
        />
      )}
    </Box>
  );
}

export default CandidateList;
