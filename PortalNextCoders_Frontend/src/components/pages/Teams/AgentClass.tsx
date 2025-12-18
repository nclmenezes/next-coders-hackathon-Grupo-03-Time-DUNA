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
    IAgentClass,
    ILocationState,
    ResponsePagination,
    ActivityTypes,
    StudentClassAverage,
    IManagementClass,
    IAgentClassFilter,
    IAgentLocationState,
    IFilteredFields,
    IAgentClassDates
} from "../../../interfaces/teams/class.interfaces";
import Paper from "@mui/material/Paper";
import { useEffect, useState, useReducer } from 'react';
import AgentClassesService from "../../../services/Teams/classes/agentClasses.service";
import MLoading from "../../molecules/MLoading";
import AddIcon from '@mui/icons-material/Add';
import PaymentIcon from '@mui/icons-material/Payment';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { parseISO, format } from 'date-fns';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import useBackListener from "../../../hooks/useBackListener";
import { showErrorToast } from "../../../utils/toast";
import managementClassesService from "../../../services/Teams/classes/managementClasses.service";

const TABLE_HEAD = [
    {
        title: "Nome",
        field: "StudentClassName",
    },
    {
        title: "Turma",
        field: "StudentClassManagementId"
    },
    {
        title: "Contratante",
        field: "AgentName"
    },
    {
        title: "Estado",
        field: "ClassState"
    },
    {
        title: "Município",
        field: "ClassCity"
    },
    {
        title: "Alunos",
        field: "StudentQtd"
    },
    {
        title: "Início",
        field: "StartDate"
    },
    {
        title: "Fim",
        field: "EndDate"
    },
    {
        title: "Nota",
        field: "AverageGrade"
    },
    {
        title: "Presença",
        field: "Attendance"
    },
    {
        title: "Editar",
        field: "edit"
    },
];

type Action = {
    property: keyof IAgentClassFilter;
    value: string | null;
};

const AgentClass = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { studentClassManagementId } = useParams();
    const state = location.state as ILocationState;

    const PAGE_SIZE = 10;

    const [pageNumber, setPageNumber] = useState<number>(1);
    const [filteredPage, setfilteredPage] = useState<IFilteredFields<IAgentClassFilter>>(
        { page: pageNumber, pageSize: PAGE_SIZE, filteredFields: null }
    );
    const [agentClasses, setAgentClasses] = useState<IAgentClass[]>([]);
    const [managementClass, setManagementClass] = useState<IManagementClass | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const reducerSelect = (currentSelect: IAgentClassFilter, action: Action): IAgentClassFilter => {
        const { property, value } = action;
        return {
            ...currentSelect,
            [property]: value
        };
    };

    const [selectFields, setSelectFields] = useReducer(reducerSelect,
        {
            selectedAgentClassName: null,
            selectedAgentContractor: null,
            selectedAgentCity: null,
            selectedAgentState: null
        } as IAgentClassFilter
    );

    const navigateBack = () => {
        if (!state) return navigate("/managementClass", { replace: true });
        state.agentLocation = undefined;
        navigate("/managementClass", { replace: true, state });
    };

    const navigateToPagamentos = () => {
        navigateFoward(`/managementClass/${studentClassManagementId}/pagamentos`);
    };

    const navigateFoward = (path: string) => {
        if (!state) {
            navigate(path, { state: { navigateBack: location.pathname, agentLocation: { agentClasses, selectFields, filteredPage }} });
        }
        state.agentLocation = { agentClasses, selectFields, filteredPage } as IAgentLocationState;
        state.navigateBack = location.pathname;
        navigate(path, { state });
    };

    useBackListener(() => navigateBack());

    const toggleLoading = () => setIsLoading((_isLoading: boolean) => !_isLoading);

    const handleFetchError = (errorMessage: string): void => {
        setIsLoading(false);
        showErrorToast(errorMessage);
    };

    const fetchAgentClasses = async () => {
        const _managementClass = await managementClassesService.GetManagementClassById(Number(studentClassManagementId));
        if (!_managementClass) return handleFetchError("Erro ao recuperar os dados da turma mãe!");
 
        const _agentClasses = await AgentClassesService.GetAgentClasses(pageNumber, PAGE_SIZE, {studentClassManagementId: Number(studentClassManagementId)});
        if(!_agentClasses) return handleFetchError("Erro ao recuperar os dados da turma filha");

        // setfilteredPage({ page: pageNumber, pageSize: PAGE_SIZE, filteredFields: classFilter });
        setAgentClasses(_agentClasses.data.map((agentClass: IAgentClass): IAgentClassDates => {
            return {
                ...agentClass,
                startAt: _managementClass.startAt,
                endAt: _managementClass.endAt
            };
        }));

        setManagementClass(_managementClass);
        toggleLoading();
    };

    const getAgentClasses = () => {
        if (!state?.agentLocation?.agentClasses ||
            !state?.agentLocation?.agentClasses.length ||
            !state?.managementLocation?.managementClasses ||
            !state?.managementLocation?.managementClasses.length
        ) return fetchAgentClasses();
        const { agentLocation, managementLocation } = state;
        // const { selectedAgentCity, selectedAgentClassName, selectedAgentContractor, selectedAgentState } = agentLocation.selectFields;
        setAgentClasses(agentLocation.agentClasses);
        setManagementClass(
            managementLocation!.managementClasses
                .find((managementClass: IManagementClass) => managementClass.id === Number(studentClassManagementId)) ?? null
        );
        // setSelectFields({ property: 'selectedAgentClassName', value: selectedAgentCity });
        // setSelectFields({ property: 'selectedAgentCity', value: selectedAgentClassName });
        // setSelectFields({ property: 'selectedAgentState', value: selectedAgentContractor });
        // setSelectFields({ property: 'selectedAgentContractor', value: selectedAgentState });
        setIsLoading(false);
    }

    useEffect(() => {
        getAgentClasses();
    }, []);

    const filterAgentClasses = () => {
        toggleLoading();
        // fetchAgentClasses(pageNumber, PAGE_SIZE, selectFields);
    };

    // const cleanFilter = () => {
    //     setSelectFields({ property: 'selectedAgentClassName', value: null });
    //     setSelectFields({ property: 'selectedAgentContractor', value: null });
    //     setSelectFields({ property: 'selectedAgentCity', value: null });
    //     setSelectFields({ property: 'selectedAgentState', value: null });
    // };

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
                        Gestão de Turmas do contratante
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
                <Box
                    sx={{
                        display: 'flex',
                        gap: '10px'
                    }}
                >
                    <Autocomplete
                        options={
                            agentClasses!
                                .map((agentClass: IAgentClass) => agentClass.name)
                                .filter((studentClassName: string, index: number, array: string[]) => array.indexOf(studentClassName) === index)
                        }
                        disabled
                        sx={{ flexGrow: 2 }}
                        renderInput={(params) => <TextField {...params} label="Turma" />}
                        // value={selectFields.selectedAgentClassName}
                        // onChange={
                        //     (
                        //         _: unknown,
                        //         value: string | null
                        //     ) => setSelectFields({ property: 'selectedAgentClassName', value })
                        // }
                    />
                    <Autocomplete
                        // options={
                        //     agentClasses!
                        //         .map((agentClass: IAgentClass) => agentClass.maintainer.name)
                        //         .filter((agentName: string, index: number, array: string[]) => array.indexOf(agentName) === index)
                        // }
                        options={[]}
                        disabled
                        sx={{ flexGrow: 1 }}
                        renderInput={(params) => <TextField {...params} label="Contratantes" />}
                        // value={selectFields.selectedAgentContractor}
                        // onChange={
                        //     (
                        //         _: unknown,
                        //         value: string | null
                        //     ) => setSelectFields({ property: 'selectedAgentContractor', value })
                        // }
                    />
                    <Autocomplete
                        // options={
                        //     agentClasses!
                        //         .map((agentClass: IAgentClass) => agentClass.studentClassCoverages.map(el => el.city))
                        //         .filter((agentCity: string, index: number, array: string[]) => array.indexOf(agentCity) === index)
                        // }
                        options={[]}
                        disabled
                        sx={{ flexGrow: 0.5 }}
                        renderInput={(params) => <TextField {...params} label="Cidade" />}
                        // value={selectFields.selectedAgentCity}
                        // onChange={
                        //     (
                        //         _: unknown,
                        //         value: string | null
                        //     ) => setSelectFields({ property: 'selectedAgentCity', value })
                        // }
                    />
                    <Autocomplete
                        // options={
                        //     agentClasses!
                        //         .map((agentClass: IAgentClass) => agentClass.maintainer.agentCoverages[0].state)
                        //         .filter((agentState: string, index: number, array: string[]) => array.indexOf(agentState) === index)
                        // }
                        options={[]}
                        disabled
                        sx={{ flexGrow: 0.5 }}
                        renderInput={(params) => <TextField {...params} label="Estado" />}
                        // value={selectFields.selectedAgentState}
                        // onChange={
                        //     (
                        //         _: unknown,
                        //         value: string | null
                        //     ) => setSelectFields({ property: 'selectedAgentState', value })
                        // }
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
                    // onClick={filterAgentClasses}
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
                        onClick={() => navigateFoward(`/managementClass/${studentClassManagementId}/create`)}
                    >
                        <AddIcon />
                        <Typography>Criar turma</Typography>
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
                            width: '300px'
                        }}
                        onClick={() => navigateFoward(`/managementClass/${studentClassManagementId}/edit`)}
                    >
                        <EditIcon />
                        <Typography>Editar turma mãe</Typography>
                    </Box>
                        <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '5px',
                            color: 'white',
                            bgcolor: '#2E7D32', // Cor verde para pagamentos
                            padding: '15px 0',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            userSelect: 'none',
                            width: '300px'
                        }}
                        onClick={navigateToPagamentos}
                    >
                        <PaymentIcon />
                        <Typography>Gerenciar Pagamentos</Typography>
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
                            {agentClasses.map((agentClass: IAgentClass) => (
                                <TableRow
                                    key={agentClass.id}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.07)',
                                        },
                                        userSelect: 'none',
                                        cursor: 'pointer'
                                    }}

                                >
                                    <TableCell
                                        onClick={() => navigateFoward(`/managementClass/${studentClassManagementId}/${agentClass.studentClassReferenceId}`)}
                                    >
                                        {agentClass.name}
                                    </TableCell>
                                    <TableCell
                                        onClick={() => navigateFoward(`/managementClass/${studentClassManagementId}/${agentClass.studentClassReferenceId}`)}
                                    >
                                        {agentClass.id}
                                    </TableCell>
                                    <TableCell
                                        onClick={() => navigateFoward(`/managementClass/${studentClassManagementId}/${agentClass.studentClassReferenceId}`)}
                                    >
                                        {managementClass?.contractor.name}
                                    </TableCell>
                                    <TableCell
                                        onClick={() => navigateFoward(`/managementClass/${studentClassManagementId}/${agentClass.studentClassReferenceId}`)}
                                    >
                                        {agentClass.nationalFlag ? 'Nac.' : agentClass.studentClassCoverages.map(el => el.state).join(' | ') ?? '-'}
                                    </TableCell>
                                    <TableCell
                                        onClick={() => navigateFoward(`/managementClass/${studentClassManagementId}/${agentClass.studentClassReferenceId}`)}
                                    >
                                        {agentClass.nationalFlag ? 'Nac.' : agentClass.studentClassCoverages.map(el => el.city).join(' | ') ?? '-'}
                                    </TableCell>
                                    <TableCell
                                        onClick={() => navigateFoward(`/managementClass/${studentClassManagementId}/${agentClass.studentClassReferenceId}`)}
                                    >
                                        {agentClass.studentQuantity}
                                    </TableCell>
                                    <TableCell
                                        onClick={() => navigateFoward(`/managementClass/${studentClassManagementId}/${agentClass.studentClassReferenceId}`)}
                                    >
                                        {
                                            managementClass &&
                                            `${format(parseISO(managementClass.startAt), "dd/MM/yyyy")}`
                                        }
                                    </TableCell>
                                    <TableCell
                                        onClick={() => navigateFoward(`/managementClass/${studentClassManagementId}/${agentClass.studentClassReferenceId}`)}
                                    >
                                        {
                                            managementClass &&
                                            `${format(parseISO(managementClass.endAt), "dd/MM/yyyy")}`
                                        }
                                    </TableCell>
                                    <TableCell
                                        onClick={() => navigateFoward(`/managementClass/${studentClassManagementId}/${agentClass.studentClassReferenceId}`)}
                                    >
                                        {
                                            agentClass.studentClassAverages
                                                .find(
                                                    (StudentClassAverage: StudentClassAverage) => {
                                                        if (!StudentClassAverage.activityType) return false;
                                                        return StudentClassAverage.activityType.id === ActivityTypes.Grade;
                                                    }
                                                )?.average || ''
                                        }
                                    </TableCell>
                                    <TableCell
                                        onClick={() => navigateFoward(`/managementClass/${studentClassManagementId}/${agentClass.studentClassReferenceId}`)}
                                    >
                                        {
                                            agentClass.studentClassAverages
                                                .find(
                                                    (StudentClassAverage: StudentClassAverage) => {
                                                        if (!StudentClassAverage.activityType) return false;
                                                        return StudentClassAverage.activityType.id === ActivityTypes.Presence;
                                                    }
                                                )?.average || ''
                                        }
                                    </TableCell>
                                    <TableCell>
                                        <Box
                                            onClick={
                                                () => navigateFoward(`/managementClass/${studentClassManagementId}/${agentClass.id}/edit`)
                                            }
                                        >
                                            <EditIcon />
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

export default AgentClass;