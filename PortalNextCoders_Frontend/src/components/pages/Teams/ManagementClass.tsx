import {
    Autocomplete,
    Box,
    Typography,
    TextField,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from "@mui/material";
import {
    IManagementClass,
    ILocationState,
    ResponsePagination,
    AgentCoverageDto,
    IFilteredFields,
    IManagementClassFilter,
    IManagementLocationState,
    IAgentClass,
    IAgentLocationState,
    IAgentClassFilter
} from "../../../interfaces/teams/class.interfaces";
import Paper from "@mui/material/Paper";
import { useEffect, useState, useReducer } from 'react';
import ManagementClassesService from "../../../services/Teams/classes/managementClasses.service";
import MLoading from "../../molecules/MLoading";
import AddIcon from '@mui/icons-material/Add';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import { useLocation, useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import SavingsIcon from '@mui/icons-material/Savings';

const TABLE_HEAD = [
    {
        title: "Nome",
        field: "motherClassName",
    },
    {
        title: "Turma",
        field: "studentClassManagementId"
    },
    {
        title: "Agente",
        field: "agentName"
    },
    {
        title: "Estado",
        field: "state"
    },
    {
        title: "Município",
        field: "city"
    },
    {
        title: "Recompensa",
        field: "rewards"
    },
    {
        title: "",
        field: "edit"
    }
];

type Action = {
    property: keyof IManagementClassFilter;
    value: string | null;
};

const ManagementClass = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state === null ? {} : location.state as ILocationState;
    const [managementClasses, setManagementClasses] = useState<IManagementClass[]>([]);

    const reducerSelect = (currentSelect: IManagementClassFilter, action: Action): IManagementClassFilter => {
        const { property, value } = action;
        return {
            ...currentSelect,
            [property]: value
        };
    };

    const [selectFields, setSelectFields] = useReducer(reducerSelect,
        {
            selectedClassName: null,
            selectedContractor: null,
            selectedCity: null,
            selectedState: null
        } as IManagementClassFilter
    );

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const PAGE_SIZE = 10;
    const [pageNumber, setPageNumber] = useState<number>(1);

    const [filteredPage, setfilteredPage] = useState<IFilteredFields<IManagementClassFilter>>(
        { page: pageNumber, pageSize: PAGE_SIZE, filteredFields: null }
    );

    const toggleLoading = () => setIsLoading((_isLoading: boolean) => !_isLoading);

    const fetchManagementClasses = async (
        page: number, pageSize: number, classFilter: IManagementClassFilter | null
    ) => {
        const _managementClassesPagination: ResponsePagination<IManagementClass[]> | null = await ManagementClassesService
            .GetManagementClasses(page, pageSize, classFilter);
        if (!_managementClassesPagination) {
            setManagementClasses([]);
            toggleLoading();
            return;
        };
        setfilteredPage({ page: pageNumber, pageSize: PAGE_SIZE, filteredFields: classFilter });
        setManagementClasses(_managementClassesPagination.data);
        toggleLoading();
    };

    useEffect(() => {
        if (state && state.managementLocation?.managementClasses) {
            const { managementLocation } = state;
            const { selectFields } = managementLocation;
            setManagementClasses(state.managementLocation.managementClasses);
            // setSelectFields({ property: 'selectedClassName', value: selectFields.selectedClassName });
            // setSelectFields({ property: 'selectedContractor', value: selectFields.selectedContractor });
            // setSelectFields({ property: 'selectedCity', value: selectFields.selectedCity });
            // setSelectFields({ property: 'selectedState', value: selectFields.selectedState });
            toggleLoading();
        } else fetchManagementClasses(pageNumber, PAGE_SIZE, null);
    }, []);

    // const cleanFilter = () => {
    //     setSelectFields({ property: 'selectedClassName', value: null });
    //     setSelectFields({ property: 'selectedContractor', value: null });
    //     setSelectFields({ property: 'selectedCity', value: null });
    //     setSelectFields({ property: 'selectedState', value: null });
    // };

    // const filterManagementClasses = async () => {
    //     toggleLoading();
    //     fetchManagementClasses(pageNumber, PAGE_SIZE, selectFields);
    // };

    const navigateToCreateOrEditManagementClass = (path: string) => {
        const managementLocation = { managementClasses, selectFields, filteredPage } as IManagementLocationState;
        state.managementLocation = managementLocation;
        state.navigateBack = location.pathname;
        navigate(path, { state });
    };

    const navigateToAgentClass = (path: string, managementClassId: number) => {
        const managementLocation = { managementClasses, selectFields, filteredPage } as IManagementLocationState;

        const agentClasses: IAgentClass[] = managementClasses
            .filter((managementClass: IManagementClass) => managementClass.id === managementClassId)
            .flatMap((managementClass: IManagementClass) => managementClass.studentClasses);
        
        const agentSelectFields = {
            selectedAgentClassName: null,
            selectedAgentContractor: null,
            selectedAgentCity: null,
            selectedAgentState: null
        } as IAgentClassFilter;

        const agentFilteredPage = {
            page: 1,
            pageSize: 10,
            filteredFields: null
        } as IFilteredFields<IAgentClassFilter>;

        const agentLocation = {
            agentClasses,
            selectFields: agentSelectFields,
            filteredPage: agentFilteredPage
        } as IAgentLocationState;

        state.agentLocation = agentLocation;
        state.managementLocation = managementLocation;
        state.navigateBack = location.pathname;

        navigate(path, { state });
    };
    
    return (
        <>
            {isLoading ? <MLoading /> : null}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px'
                }}
            >
                <Typography
                    variant="h1"
                    fontFamily={'Inter'}
                    fontWeight={600}
                    fontSize={28}
                >
                    Turmas Mãe
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        gap: '10px'
                    }}
                >
                    <Autocomplete
                        options={
                            managementClasses!
                                .map((managementClass: IManagementClass) => managementClass.name)
                                .filter((managementClass: string, index: number, array: string[]) => array.indexOf(managementClass) === index)
                        }
                        disabled
                        sx={{ flexGrow: 2 }}
                        renderInput={(params) => <TextField {...params} label="Turma" />}
                        // value={selectFields.selectedClassName}
                        // onChange={
                        //     (
                        //         _: unknown, 
                        //         value: string | null
                        //     ) => setSelectFields({ property: 'selectedClassName', value })
                        // }
                        value={null}
                    />
                    <Autocomplete
                        options={
                            managementClasses!
                                .map((managementClass: IManagementClass) => managementClass.contractor.name)
                                .filter((managementClass: string, index: number, array: string[]) => array.indexOf(managementClass) === index)
                        }
                        disabled
                        sx={{ flexGrow: 1 }}
                        renderInput={(params) => <TextField {...params} label="Contratantes" />}
                        // value={selectFields.selectedContractor}
                        // onChange={
                        //     (
                        //         _: unknown, 
                        //         value: string | null
                        //     ) => setSelectFields({ property: 'selectedContractor', value })
                        // }
                        value={null}
                    />
                    <Autocomplete
                        options={
                            managementClasses!
                            .flatMap((managementClass: IManagementClass) => managementClass.contractor.agentCoverages)
                            .map((agentCoverage: AgentCoverageDto) => agentCoverage.city)
                            .filter((managementClass: string, index: number, array: string[]) => array.indexOf(managementClass) === index)
                        }
                        disabled
                        sx={{ flexGrow: 0.5 }}
                        renderInput={(params) => <TextField {...params} label="Cidade" />}
                        // value={selectFields.selectedCity}
                        // onChange={
                        //     (
                        //         _: unknown,
                        //         value: string | null
                        //     ) => setSelectFields({ property: 'selectedCity', value })
                        // }
                        value={null}
                    />
                    <Autocomplete
                        options={
                            managementClasses!
                                .flatMap((managementClass: IManagementClass) => managementClass.contractor.agentCoverages)
                                .map((agentCoverage: AgentCoverageDto) => agentCoverage.state)
                                .filter((managementClass: string, index: number, array: string[]) => array.indexOf(managementClass) === index)
                        }
                        disabled
                        sx={{ flexGrow: 0.5 }}
                        renderInput={(params) => <TextField {...params} label="Estado" />}
                        // value={selectFields.selectedState}
                        // onChange={
                        //     (
                        //         _: unknown, 
                        //         value: string | null
                        //     ) => setSelectFields({ property: 'selectedState', value })
                        // }
                        value={null}
                    />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        gap: '10px',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '5px',
                            color: 'white',
                            bgcolor: '#679D12',
                            padding: '15px 0',
                            borderRadius: '5px',
                            cursor: 'not-allowed',
                            userSelect: 'none',
                            width: '200px'
                        }}
                        // onClick={filterManagementClasses}
                    >
                        <SearchIcon />
                        <Typography>Filtrar</Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '5px',
                            color: 'white',
                            bgcolor: '#4263EB',
                            padding: '15px 0',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            userSelect: 'none',
                            width: '200px'
                        }}
                        onClick={() => navigateToCreateOrEditManagementClass('/managementClass/create')}
                    >
                        <AddIcon />
                        <Typography>Criar turma mãe</Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '5px',
                            color: 'white',
                            bgcolor: '#E38D23',
                            padding: '15px 0',
                            borderRadius: '5px',
                            cursor: 'not-allowed',
                            userSelect: 'none',
                            width: '200px'
                        }}
                        // onClick={cleanFilter}
                    >
                        <FilterAltOffIcon />
                        <Typography>Limpar</Typography>
                    </Box>
                </Box>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {TABLE_HEAD.map(item => (
                                    <TableCell key={item.field} sx={{ alignItems: "center", top: 64, bgcolor: "#4263EB", color: "white" }}>
                                        {item.title}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {managementClasses.map((managementClass: IManagementClass) => (
                                <TableRow 
                                    key={managementClass.id}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                        },
                                        userSelect: 'none',
                                        cursor: 'pointer'
                                    }}
                                    
                                >
                                    <TableCell 
                                        onClick={
                                            () => navigateToAgentClass(`/managementClass/${managementClass.id}`, managementClass.id)
                                        }
                                    >
                                        {managementClass.name}
                                    </TableCell>
                                    <TableCell 
                                        onClick={
                                            () => navigateToAgentClass(`/managementClass/${managementClass.id}`, managementClass.id)
                                        }
                                    >
                                        {managementClass.id}
                                    </TableCell>
                                    <TableCell 
                                        onClick={
                                            () => navigateToAgentClass(`/managementClass/${managementClass.id}`, managementClass.id)
                                        }
                                    >
                                        {managementClass.contractor.name}
                                    </TableCell>
                                    <TableCell 
                                        onClick={
                                            () => navigateToAgentClass(`/managementClass/${managementClass.id}`, managementClass.id)
                                        }
                                    >
                                        {
                                            managementClass.contractor.nationalFlag ? 'Nac.' :
                                            managementClass.contractor.agentCoverages
                                                .map((agentCoverage: AgentCoverageDto) => agentCoverage.state)
                                                .join(", ")
                                        }
                                    </TableCell>
                                    <TableCell 
                                        onClick={
                                            () => navigateToAgentClass(`/managementClass/${managementClass.id}`, managementClass.id)
                                        }
                                    >
                                        {
                                            managementClass.contractor.nationalFlag ? 'Nac.' :
                                            managementClass.contractor.agentCoverages
                                                .map((agentCoverage: AgentCoverageDto) => agentCoverage.city)
                                                .join(", ")
                                        }
                                    </TableCell>
                                    <TableCell>
                                        <Box
                                            onClick={
                                                () => navigateToCreateOrEditManagementClass(`/managementClass/${managementClass.id}/rewards`)
                                            }
                                        >
                                            <SavingsIcon/>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box
                                            onClick={
                                                () => navigateToCreateOrEditManagementClass(`/managementClass/${managementClass.id}/edit`)
                                            }
                                        >
                                            <EditIcon/>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    );
};

export default ManagementClass;