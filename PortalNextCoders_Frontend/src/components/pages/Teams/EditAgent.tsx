import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useState, useReducer, Fragment } from "react";
import { showErrorToast, showSuccessToast } from "../../../utils/toast";
import {
    Box, Button, Typography, Autocomplete, Card, Switch, TextField
} from "@mui/material";
import MLoading from "../../molecules/MLoading";
import axios from "axios";
import agentsService from "../../../services/Teams/agents.service";
import { CreateOrUpdateAgentCoverageDto, UpdateAgentDto, AgentDto, AgentTypes, CreateAgentDto } from "../../../interfaces/teams/class.interfaces";
import { useAuth } from "../../../context/AuthProvider/useAuth";
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';

interface IAgentFields {
    name: string | null;
    lead: string | null;
    documentNumber: string | null;
    mail: string | null;
    nationalFlag: boolean;
    coverage: {
        state: string;
        city: string[];
    }[];
};

const initialState: IAgentFields = {
    name: null,
    lead: null,
    documentNumber: null,
    mail: null,
    nationalFlag: false,
    coverage: []
};

interface IAutoComplete<T> {
    value: T;
    label: string;
};


type Action = { type: 'SET_FIELD'; field: keyof IAgentFields; value: any };

function reducer(state: IAgentFields, action: Action): IAgentFields {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value };
        default:
            throw new Error('Unknown action type');
    }
}



function CitySelector({ state, onChange, value, disabled }: { state: string, onChange: (arg0: any, arg1: string[]) => void, value: string[], disabled: boolean }) {
    const [cityList, setCityList] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const getCities = async (state: string): Promise<string[]> => {
        const { data } = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`);
        return data.map((el: any) => el.nome)
    };

    useEffect(() => {
        if (state) {
            setIsLoading(true);
            getCities(state).then(cities => {
                setCityList(cities);
                setIsLoading(false);
            });
        }
    }, [state]);

    return (
        <>
            {isLoading && <MLoading />}
            <Autocomplete
                disabled={disabled}
                multiple
                options={cityList}
                sx={{
                    width: '80%',
                    marginY: '15px'
                }}
                value={value}
                onChange={onChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Cidades"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <Fragment>
                                    {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </Fragment>
                            ),
                        }}
                    />
                )}
            />
        </>
    )
}


function EditAgent() {
    const location = useLocation();
    const { user } = useAuth();
    const path = location.pathname;
    const pageType = path.substring(path.lastIndexOf('/') + 1);
    const navigate = useNavigate();
    const state = location.state as { agent: AgentDto };
    const [isLoading, setIsLoading] = useState(false);
    const [dataFields, setDataFields] = useReducer(reducer, initialState);
    const [stateList, setStateList] = useState<IAutoComplete<string>[]>([]);

    const setField = (field: keyof IAgentFields, value: any) => {
        setDataFields({ type: 'SET_FIELD', field, value });
    };


    const getStates = async (): Promise<any> => {
        const { data } = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/`);

        const sortedData = data.sort((a: any, b: any) => a.nome.localeCompare(b.nome));
        setStateList(sortedData.map((el: any) => { return { label: el.nome, value: el.sigla } }))
    };



    const fetchData = async () => {
        const cov = state.agent.agentCoverages;
        const ag = state.agent;

        const transformedCoverage = cov.reduce((acc, { state, city }) => {
            const existingCoverage = acc.find(c => c.state === state);
            if (existingCoverage) {
                existingCoverage.city.push(city);
            } else {
                acc.push({ state, city: [city] });
            }
            return acc;
        }, [] as { state: string; city: string[] }[]);

        setField('name', ag.name);
        setField('lead', ag.lead);
        setField('documentNumber', ag.documentNumber);
        setField('mail', ag.mail);
        setField('nationalFlag', ag.nationalFlag);
        setField('coverage', transformedCoverage);
    };


    useEffect(() => {
        setIsLoading(true);
        getStates();
        if(pageType == 'edit') fetchData();
        setIsLoading(false);
    }, []);


    const validateFields = (): boolean => {
        if (!dataFields.name) {
            showErrorToast('Nome é obrigatório');
            return false;
        }
        if (!dataFields.lead) {
            showErrorToast('Responsável é obrigatório');
            return false;
        }
        if (!dataFields.documentNumber) {
            showErrorToast('Número do documento é obrigatório');
            return false;
        }
        if (!dataFields.mail) {
            showErrorToast('Email é obrigatório');
            return false;
        }
        if (!dataFields.nationalFlag) {
            if (!dataFields.coverage || dataFields.coverage.length === 0) {
                showErrorToast('Cobertura é obrigatória');
                return false;
            }
            for (const coverage of dataFields.coverage) {
                if (!coverage.state) {
                    showErrorToast('Estado da cobertura é obrigatório');
                    return false;
                }
                if (!coverage.city || coverage.city.length === 0) {
                    showErrorToast('Cidade da cobertura é obrigatória');
                    return false;
                }
            }
        }
        return true;
    };


    const createContractor = async () => {
        setIsLoading(true);
        if (!validateFields()) return setIsLoading(false);
        const _data: CreateAgentDto = {
            agentTypeId: AgentTypes.Contractor,
            name: dataFields.name!,
            lead: dataFields.lead!,
            documentNumber: dataFields.documentNumber!,
            mail: dataFields.mail!,
            createdBy: Number(user?.profileId) ?? 0
        }

        const _coverage: CreateOrUpdateAgentCoverageDto = {
            agentId: 0,
            nationalFlag: dataFields.nationalFlag,
            coverages: dataFields.coverage.flatMap(({ state, city }) =>
                city.map(cityName => ({ state, city: cityName })))
        }

        try {
            const result = await agentsService.CreateAgents(_data);
            if (result) {
                _coverage.agentId = result.id;
                const coverageResult = await agentsService.UpdateAgentCoverage(_coverage);
                if (coverageResult) {
                    setIsLoading(false);
                    navigate('/agents');
                    return showSuccessToast('Contratante criado com sucesso');
                }
                setIsLoading(false);
                return showErrorToast('Erro ao criar Contratante');
            }
            setIsLoading(false)
            return showErrorToast('Erro ao criar Contratante');
        } catch (error: any) {
            showErrorToast(error.response.data.errors.messages[0]);
            setIsLoading(false);
        }
    };

    const updateContractor = async () => {
        setIsLoading(true);
        if (!validateFields()) return setIsLoading(false);

        const _data: UpdateAgentDto = {
            id: state.agent.id,
            name: dataFields.name!,
            lead: dataFields.lead!,
            documentNumber: dataFields.documentNumber!,
            mail: dataFields.mail!,
            updatedBy: Number(user?.profileId) ?? 0
        }
        const _coverage: CreateOrUpdateAgentCoverageDto = {
            agentId: state.agent.id,
            nationalFlag: dataFields.nationalFlag,
            coverages: dataFields.coverage.flatMap(({ state, city }) =>
                city.map(cityName => ({ state, city: cityName })))
        }
        const result = await agentsService.UpdateAgents(_data);
        if (result) {
            const coverageResult = await agentsService.UpdateAgentCoverage(_coverage);
            if (coverageResult) {
                setIsLoading(false);
                navigate('/agents');
                return showSuccessToast('Contratante atualizado com sucesso');
            }
            setIsLoading(false);
            return showErrorToast('Erro ao atualizar Contratante');
        }
        setIsLoading(false);
        return showErrorToast('Erro ao atualizar Contratante');
    };


    return (
        <>
            {isLoading && <MLoading />}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}
            >
                <h1>Gestão de Contratantes</h1>
                <Box
                    sx={{
                        marginTop: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '60%'
                        }}
                    >
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Nome"
                            sx={{
                                width: '100%',
                                marginTop: '20px'
                            }}
                            value={dataFields.name ? dataFields.name : ''}
                            onChange={(event) => setField('name', event.target.value)}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Responsável"
                            sx={{
                                width: '100%',
                                marginTop: '20px'
                            }}
                            value={dataFields.lead ? dataFields.lead : ''}
                            onChange={(event) => setField('lead', event.target.value)}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Email"
                            sx={{
                                width: '100%',
                                marginTop: '20px'
                            }}
                            value={dataFields.mail ? dataFields.mail : ''}
                            onChange={(event) => setField('mail', event.target.value)}
                        />

                        <TextField
                            fullWidth
                            variant="outlined"
                            label="CNPJ"
                            sx={{
                                width: '100%',
                                marginTop: '20px'
                            }}
                            value={dataFields.documentNumber ? dataFields.documentNumber : ''}
                            onChange={(event) => setField('documentNumber', event.target.value)}
                        />
                        <Box
                            sx={{
                                marginTop: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}
                        >
                            <Typography
                                fontFamily={'Inter'}
                                fontWeight={'400'}
                                textAlign={'center'}
                            >
                                Cobrir o país inteiro?
                            </Typography>
                            <Switch
                                checked={dataFields.nationalFlag}
                                onChange={(value) => {
                                    setField('nationalFlag', value.target.checked);
                                    if (value.target.checked) setField('coverage', []);
                                }}
                            />
                        </Box>
                        <Autocomplete
                            multiple
                            disabled={dataFields.nationalFlag}
                            options={stateList}
                            sx={{
                                width: '100%',
                                marginTop: '20px'
                            }}
                            renderInput={(params) => <TextField {...params} label="Estados" />}
                            value={stateList.filter(el => dataFields.coverage.some(coverage => coverage.state === el.value))}
                            isOptionEqualToValue={(option, value) => option.value === value.value}
                            onChange={(_, value) => {
                                const newCoverage = value.map((v: IAutoComplete<string>) => {
                                    const existingCoverage = dataFields.coverage.find(coverage => coverage.state === v.value);
                                    return existingCoverage ? existingCoverage : { state: v.value, city: [] };
                                });
                                setField('coverage', newCoverage);
                            }}
                        />
                        <Box
                            sx={{
                                width: '95%',
                                marginTop: 3,
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                gap: '10%'
                            }}
                        >
                            {dataFields.coverage.map(coverage => (
                                <Card
                                    key={coverage.state}
                                    sx={{
                                        width: '45%',
                                        bgcolor: '#f5f5f5',
                                        marginBottom: 3,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        paddingY: 1
                                    }}
                                >
                                    <Typography
                                        fontFamily={'Inter'}
                                        fontWeight={'500'}
                                        textAlign={'center'}
                                        fontSize={'1.5rem'}
                                    >
                                        {stateList.find(el => el.value === coverage.state)?.label}
                                    </Typography>
                                    <Box
                                        sx={{
                                            marginTop: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Typography
                                            fontFamily={'Inter'}
                                            fontWeight={'400'}
                                            textAlign={'center'}
                                        >
                                            Cobrir o estado inteiro?
                                        </Typography>
                                        <Switch
                                            checked={coverage.city[0] === 'All'}
                                            onChange={(value) => value.target.checked ? setField('coverage', dataFields.coverage.map(v => {
                                                if (v.state === coverage.state) return { state: coverage.state, city: ['All'] };
                                                return v;
                                            })) : setField('coverage', dataFields.coverage.map(v => {
                                                if (v.state === coverage.state) return { state: coverage.state, city: [] };
                                                return v;
                                            }))}
                                        />
                                    </Box>

                                    <CitySelector
                                        state={coverage.state}
                                        onChange={(_, values) => {
                                            const newCoverage = dataFields.coverage.map(v => {
                                                if (v.state === coverage.state) return { state: coverage.state, city: values };
                                                return v;
                                            });
                                            setField('coverage', newCoverage);
                                        }}
                                        value={coverage.city}
                                        disabled={coverage.city ? coverage.city[0] === 'All' : false}
                                    />
                                </Card>
                            ))}
                        </Box>
                        <Box
                            sx={{
                                marginTop: '30px',
                                display: 'flex',
                                gap: '200px'
                            }}
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<ArrowBackIcon />}
                                sx={{
                                    borderRadius: '10px',
                                    py: 2,
                                    px: 3,
                                    backgroundColor: '#4663ef',
                                    color: 'white',
                                    boxShadow: 'none',
                                    '&:hover': {
                                        backgroundColor: '#4663ef',
                                        boxShadow: 'none',
                                    },
                                    '&:active': {
                                        boxShadow: 'none',
                                    },
                                }}
                                onClick={() => navigate('/agents')}
                            >
                                Voltar
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<CheckIcon />}
                                sx={{
                                    borderRadius: '10px',
                                    py: 2,
                                    px: 3,
                                    backgroundColor: '#679d13',
                                    color: 'white',
                                    boxShadow: 'none',
                                    '&:hover': {
                                        backgroundColor: '#679d13',
                                        boxShadow: 'none',
                                    },
                                    '&:active': {
                                        boxShadow: 'none',
                                    },
                                }}
                                onClick={() => pageType == 'edit' ? updateContractor() : createContractor()}
                            >
                                Salvar
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default EditAgent;
