import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import MLoading from "../../molecules/MLoading";
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Grid,
    Typography,
    Divider,
} from "@mui/material";
import { SelectChangeEvent } from '@mui/material/Select';
import { MTableGrid } from "../../molecules/MGrid/MTableGrid";
import teamsService from "../../../services/Teams/teams.service";
import { PageControlBar, PageHeader } from "../../pages/Candidate/styles";
import {useAuth} from "../../../context/AuthProvider/useAuth";
import MCardOverview from "../../molecules/MBonus/MCardOverview";
import RenderTeams from "../../molecules/MTeams/MRenderTeams";
import RenderGeralTeams from "../../molecules/MTeams/MRenderGeralTeams";

function TContractorTeam() {
    const navigate = useNavigate();
    const {user} = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [teams, setTeams] = useState<any[]>([]);
    const [auxTeams, setAuxTeams] = useState<any[]>([]);
    const [tableRows, setTableRows] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [listTeams, setListTeams] = useState<any[]>([]);
    const [listStates, setListStates] = useState<any[]>([]);
    const [listCities, setListCities] = useState<any[]>([]);

    const [trail, setTrail] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");

    //filtros
    const changeTableRows = (table: any[])=>{
        const tableData = table.map((team) => ({
            id: team.studentClassId,
            name: <div>{team.name}</div>,
            team: <div>{team.class}</div>,
            state: <div>{team.state}</div>,
            city: <div>{team.city}</div>,
            students: <div>{team.students}</div>,
            start: <div>{team.startAt}</div>,
            end: <div>{team.endAt}</div>,
            grade: (
                <div style={{ fontWeight: "bold" }}>
                    {team.grade !== null ? team.grade.toFixed(1) : "-"}
                </div>
            ),
            presence: <div>{team.attendance.toFixed(1)}%</div>,
    
        }));

        setTableRows(tableData);
    }

    const getTeams = async () => {
        setIsLoading(true);
        const profilesData = await teamsService.getTeamsWithFilters({
            page: page + 1,
            trailTeam: '',
            stateTeam: '',
            cityTeam: '',
            contractorId: user?.contractorId
        });
        
        setTeams(profilesData.results);
        setAuxTeams(profilesData.results);
        changeTableRows(profilesData.results);
        setTotalPages(profilesData.totalPages)

        setListTeams([...new Set(profilesData.results.map((item: { name: any; }) => item.name))]);
        setListStates([...new Set(profilesData.results.map((item: { state: any; }) => item.state))]);
        setListCities([...new Set(profilesData.results.map((item: { city: any; }) => item.city))]);
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
            title: "Turma",
            field: "team",
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


    const handleCandidateClick = (teamId: number) => {
        navigate(`/teams/detail/${teamId}`);
    };

    const handlePaginationClick = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleFilterTrail = (event: SelectChangeEvent<string>) => {

        const tableFiltered = teams.filter((team) => {
            if(event.target.value === ""){
                return true;
            }
            return team.name === event.target.value;
        })
        setTrail(event.target.value);
        setAuxTeams(tableFiltered);
        changeTableRows(tableFiltered);
    };


    const handleFilterState = (event: SelectChangeEvent<string> | React.ChangeEvent<HTMLSelectElement>) => {
        const tableFiltered = teams.filter((team) => {
            if(event.target.value === ""){
                return true;
            }
            return team.state === event.target.value;
        })
        setState(event.target.value);
        setAuxTeams(tableFiltered);
        changeTableRows(tableFiltered);
    };

    const handleFilterCity = (event: SelectChangeEvent<string> | React.ChangeEvent<HTMLSelectElement>) => {
        const tableFiltered = teams.filter((team) => {
            if(event.target.value === ""){
                return true;
            }
            return team.city === event.target.value;
        })
        setCity(event.target.value);
        setAuxTeams(tableFiltered);
        changeTableRows(tableFiltered);
    };


    return (
        <Box>
            <PageHeader>
                <h1>Turmas</h1>
            </PageHeader>


            <Grid container spacing={2} sx={{ marginBottom: '1rem' }}>
                <Grid item xs={2.5} container justifyContent="center">
                    <RenderGeralTeams teams={auxTeams}/>
                </Grid>
                <Grid item xs={9.5} container justifyContent="center">
                    <RenderTeams teams={auxTeams}/>
                </Grid>
            </Grid> 
            
            <PageControlBar>
                <Grid container spacing={3}>
                    <Grid item xs={6}>

                        <FormControl fullWidth>
                            <InputLabel id="status-select-label">Turmas</InputLabel>
                            <Select
                                labelId="status-select-label"
                                label="Turmas"
                                value={trail}
                                onChange={handleFilterTrail}
                            >
                                <MenuItem value={""}>
                                    {"Todos"}
                                </MenuItem>
                                {listTeams.map((teams, index) => (
                                    <MenuItem key={index} value={teams}>
                                        {teams}
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
                                <MenuItem value={""}>
                                    {"Todos"}
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
                                <MenuItem value={""}>
                                    {"Todos"}
                                </MenuItem>
                                {listCities.map((city, index) => (
                                    <MenuItem key={index} value={city}>
                                        {city}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                    </Grid>
                </Grid>
            </PageControlBar>

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

export default TContractorTeam