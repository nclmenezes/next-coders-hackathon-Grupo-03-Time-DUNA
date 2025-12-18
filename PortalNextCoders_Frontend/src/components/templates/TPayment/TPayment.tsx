import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import MLoading from "../../molecules/MLoading";
import {
  Box
} from "@mui/material";
import { MTableGrid } from "../../molecules/MGrid/MTableGrid";
import teamsService from "../../../services/Teams/teams.service";
import { PageHeader } from "../../pages/Candidate/styles";

function TPayment() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [teams, setTeams] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  //filtros
  const [trail, setTrail] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  const getTeams = async () => {
    setIsLoading(true);
     const profilesData = await teamsService.getTeamsWithFilters({
      page: page + 1,
      trailTeam: trail,
      stateTeam: state,
      cityTeam: city
    });

    setTeams(profilesData.results);
    setTotalPages(profilesData.totalRecords);
    setIsLoading(false);
  };

  useEffect(() => {
    getTeams();
  }, [page]);

  
  const TABLE_HEAD = [
  {
    title: "Nome",
    field: "name",
  },
  {
    title: "Estado",
    field: "state",
  },  
  {
    title: "Município",
    field: "city",
  },
  {
    title: "Início",
    field: "start",
  },
  {
    title: "Fim",
    field: "end",
  }
];


const tableRows = teams.map((team) => ({
  id: team.studentClassId,
  name: <div>{team.name}</div>,
  state: <div>{team.state}</div>,
  city: <div>{team.city}</div>,
  start: <div>{team.startAt}</div>,
  end: <div>{team.endAt}</div>,
}));

const handleCandidateClick = (teamId: number) => {
  navigate(`/payments/detail/${teamId}`);
};

const handlePaginationClick = (_: unknown, newPage: number) => {
  setPage(newPage);
};

  return (
    <Box>
      <PageHeader>
        <h1>Pagamentos por turma</h1>
      </PageHeader>

      {isLoading ? (
        <MLoading />
      ) : (
        <MTableGrid
          tableHead={TABLE_HEAD}
          tableRows={tableRows}
          rowCallback={handleCandidateClick}
          paginationConfig={{
            page,
            totalPages,
          }}
          paginationCallback={handlePaginationClick}
        />
      )}
    </Box>
  );
}

export default TPayment