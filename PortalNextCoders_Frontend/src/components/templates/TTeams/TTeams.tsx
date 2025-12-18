import { useEffect, useState} from "react";
import {useNavigate} from "react-router";
import SearchIcon from '@mui/icons-material/Search';
import CreateIcon from '@mui/icons-material/Create';
import MLoading from "../../molecules/MLoading";
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Grid,
} from "@mui/material";
import {SelectChangeEvent} from '@mui/material/Select';
import {MTableGrid} from "../../molecules/MGrid/MTableGrid";
import teamsService from "../../../services/Teams/teams.service";
import {PageControlBar, PageHeader} from "../../pages/Candidate/styles";

function TTeams() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [teams, setTeams] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    //filtros
    const [trail, setTrail] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [contractor, setContractor] = useState('');
    const [contractorId, setContractorId] = useState(0);
    const [cleanFilter, setCleanFilter] = useState(false);
    const defaultRowsPerPage = 10;

    const getTeams = async () => {
        setIsLoading(true);
        const profilesData = await teamsService.getTeamsWithFilters({
            page: page + 1,
            trail,
            state,
            city,
            contractor: contractorId
        });

        setTeams(profilesData.results);
        setTotalPages(profilesData.totalRecords)
        setIsLoading(false);
    };


    const listTrails = [...new Set(teams.map(item => item.name))];
    const listStates = [...new Set(teams.map(item => item.state))];
    const listCities = [...new Set(teams.map(item => item.city))];
    const listContractors = [...new Set(teams.map(item => item.contractorName))];

    useEffect(() => {
        getTeams();
    }, [page]);

    useEffect(() => {
        getTeams();
        setCleanFilter(false);
    }, [cleanFilter]);
    

    const TABLE_HEAD = [
        {
            title: "Nome",
            field: "name",
        },
        {
            title: "Turma",
            field: "team",
        },
        {
            title: "Contratante",
            field: "contractorName",
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
            title: "Alunos",
            field: "students",
        },
        {
            title: "Início",
            field: "start",
        },
        {
            title: "Fim",
            field: "end",
        },
        {
            title: "Nota",
            field: "grade",
        },
        {
            title: "Presença",
            field: "presence",
        },
    ];
    
    const tableRows = teams.map((team) => ({
        id: team.studentClassId,
        name: <div>{team.name}</div>,
        team: <div>{team.class}</div>,
        contractorName: <div>{team.contractorName}</div>,
        state: <div>{team.state}</div>,
        city: <div>{team.city}</div>,
        students: <div>{team.students}</div>,
        start: <div>{team.startAt}</div>,
        end: <div>{team.endAt}</div>,
        grade: (
            <div style={{fontWeight: "bold"}}>
                {team.grade !== null ? team.grade.toFixed(1) : "-"}
            </div>
        ),
        presence: <div>{team.attendance.toFixed(1)}%</div>,

    }));

    const handleCandidateClick = (teamId: number) => {
        navigate(`/teams/detail/${teamId}`);
    };

    const handlePaginationClick = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleFilterTrail = (event: SelectChangeEvent<string>) => {
        setTrail(event.target.value);
    };


    const handleFilterState = (event: SelectChangeEvent<string> | React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setState(value);
    };

    const handleFilterCity = (event: SelectChangeEvent<string> | React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setCity(value);
    }; 
    
    const handleFilterContractor = (event: SelectChangeEvent<string> | React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setContractor(value);
        setContractorId(teams.find(item => item.contractorName === value)?.contractorId);
    };

    const handleFilterButtonClick = () => {
        getTeams();
    };
    
    const handleCleanFilterButtonClick = () => {
        setTrail('');
        setState('');
        setCity('');
        setContractor('');
        setContractorId(0);
        setPage(0);
        setCleanFilter(true);
    }

    const createTeam = () => {
        navigate(`/teams/creation`);
    };

    return (
        <Box>
            <PageHeader>
                <h1>Turmas</h1>
            </PageHeader>

            <PageControlBar>
                <Grid container spacing={3}>
                    <Grid item xs={6}>

                        <FormControl fullWidth>
                            <InputLabel id="status-select-label">Turma</InputLabel>
                            <Select
                                labelId="status-select-label"
                                label="Turma"
                                value={trail}
                                onChange={handleFilterTrail}
                            >
                                <MenuItem value={""} disabled>
                                    {"Turmas"}
                                </MenuItem>
                                {listTrails.map((trail, index) => (
                                    <MenuItem key={index} value={trail}>
                                        {trail}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                    </Grid>
                    <Grid item xs={3}>

                        <FormControl fullWidth>
                            <InputLabel id="status-select-label">Estado</InputLabel>
                            <Select
                                labelId="status-select-label"
                                value={state}
                                label="estado"
                                onChange={handleFilterState}
                            >
                                <MenuItem value={""} disabled>
                                    {"Estados"}
                                </MenuItem>
                                {listStates.map((state, index) => (
                                    <MenuItem key={index} value={state}>
                                        {state}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                    </Grid>
                    <Grid item xs={3}>

                        <FormControl fullWidth>
                            <InputLabel id="status-select-label">Cidade</InputLabel>
                            <Select
                                labelId="status-select-label"
                                value={city}
                                label="Cidade"
                                onChange={handleFilterCity}
                            >
                                <MenuItem value={""} disabled>
                                    {"Cidades"}
                                </MenuItem>
                                {listCities.map((city, index) => (
                                    <MenuItem key={index} value={city}>
                                        {city}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                    </Grid>
                    <Grid item xs={3}>

                        <FormControl fullWidth>
                            <InputLabel id="status-select-label">Contratantes</InputLabel>
                            <Select
                                labelId="status-select-label"
                                value={contractor}
                                label="Contratante"
                                onChange={handleFilterContractor}
                            >
                                <MenuItem value={""} disabled>
                                    {"Contratantes"}
                                </MenuItem>
                                {listContractors.map((contractor, index) => (
                                    <MenuItem key={index} value={contractor}>
                                        {contractor}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                    </Grid>
                    <Grid item xs={3} margin={1} padding={3}>
                        <Button
                            variant="contained"
                            sx={{minWidth: 100, bgcolor: "#679d12", margin: 1 }}
                            onClick={handleFilterButtonClick}
                        >
                            <SearchIcon/>Filtrar
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ minWidth: 100, bgcolor: "#e38d23", margin: 1 }}
                            onClick={handleCleanFilterButtonClick}
                        >
                            Limpar
                        </Button>
                        <Button
                            variant="contained"
                            sx={{minWidth: 100, margin: 1}}
                            onClick={createTeam}
                        >
                            <CreateIcon/> Criar turmas
                        </Button>
                    </Grid>
                </Grid>
            </PageControlBar>

            {isLoading ? (
                <MLoading/>
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
                    rowsPerPage={defaultRowsPerPage}
                />
            )}
        </Box>
    );
}

export default TTeams