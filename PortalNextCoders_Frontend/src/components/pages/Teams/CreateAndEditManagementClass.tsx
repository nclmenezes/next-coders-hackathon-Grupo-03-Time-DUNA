import {
    Autocomplete,
    Box,
    Typography,
    TextField,
    Button,
    Tooltip
} from "@mui/material";
import {
    IManagementClass,
    ILocationState,
    IUpdateManagementClass,
    ICreateManagementClass,
    StudentClassManagementHolidayDto,
    AgentTypes,
    ResponsePagination
} from "../../../interfaces/teams/class.interfaces";
import { useEffect, useState, useReducer } from 'react';
import ManagementClassesService from "../../../services/Teams/classes/managementClasses.service";
import MLoading from "../../molecules/MLoading";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MultiDatePicker from "../../templates/TTeams/components/MultiDatePicker"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import genericService from "../../../services/Teams/classes/generic.service";
import { showErrorToast, showSuccessToast } from "../../../utils/toast";
import { useAuth } from "../../../context/AuthProvider/useAuth";
import { parseISO, formatISO, differenceInCalendarDays, eachDayOfInterval, isSaturday, isSunday } from "date-fns";
import useBackListener from "../../../hooks/useBackListener";
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';

interface IAutoComplete {
    value: number;
    label: string;
};

interface IManagementClassDataFields {
    ContractorId: number | null;
    CloseTypeId: 1 | 2 | 3 | null;
    Name: string | null;
    ClassPeriodQuantity: number | null;
    PeriodQuantity: number | null;
    StartAt: Date | null;
    EndAt: Date | null;
    Holidays: Date[];
    IsActive: boolean;
};

const initialState: IManagementClassDataFields = {
    ContractorId: null,
    CloseTypeId: null,
    Name: null,
    ClassPeriodQuantity: null,
    PeriodQuantity: null,
    StartAt: null,
    EndAt: null,
    Holidays: [],
    IsActive: false
};

type Action = { type: 'SET_FIELD'; field: keyof IManagementClassDataFields; value: any };

function reducer(state: IManagementClassDataFields, action: Action): IManagementClassDataFields {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value };
        default:
            throw new Error('Unknown action type');
    };
};

const WarningManagementChange = () => (
    <Typography
        component="span"
        sx={{ display: 'flex', alignItems: 'center', fontSize: '1.1em', color: '#cd8400' }}
    >
        <WarningIcon sx={{ fontSize: '1.5em', marginRight: '4px', verticalAlign: 'middle' }} />
        Se salva, essa mudança afetará todas as turmas-filho correspondentes, caso existam.
    </Typography>
);

const CreateAndEditManagementClass = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { studentClassManagementId } = useParams();
    const { user } = useAuth();
    const path = location.pathname;
    const pageType = path.substring(path.lastIndexOf('/') + 1);
    const state = location.state as ILocationState;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [closeTypes, setCloseTypes] = useState<IAutoComplete[]>([]);
    const [agents, setAgents] = useState<IAutoComplete[]>([]);
    const [initialValues, setInitialValues] = useState<{ PeriodQuantity: number, ClassPeriodQuantity: number }>({ PeriodQuantity: 0, ClassPeriodQuantity: 0 });
    const [dataFields, setDataFields] = useReducer(reducer, initialState);

    const setField = (field: keyof IManagementClassDataFields, value: any) => {
        setDataFields({ type: 'SET_FIELD', field, value });
    };

    const countWeekdaysExcludingHolidays = (startDate: Date, endDate: Date, holidays: Date[]): number => {
        if (!startDate || !endDate || startDate > endDate) return -1;

        const allDates = eachDayOfInterval({ start: startDate, end: endDate });
        const weekdays = allDates.filter(date => {
            const isHoliday = holidays.some(holiday => differenceInCalendarDays(date, holiday) === 0);
            return !isSaturday(date) && !isSunday(date) && !isHoliday;
        });
        return weekdays.length;
    };

    const fetchDropdown = async () => {
        const _closeTypes = await genericService.GetCloseTypes();
        if (_closeTypes) setCloseTypes(_closeTypes.map(el => { return { value: el.id, label: el.type } }));
        else showErrorToast("Erro ao recuperar tipos de fechamento");
        const _agents = await genericService.GetAgents();
        if (_agents) setAgents(_agents.data
            .filter(el => el.agentType && el.agentType.id === AgentTypes.Contractor)
            .map(el => { return { value: el.id, label: el.name } }));
        else showErrorToast("Erro ao recuperar agentes");
    };

    const setAllDataFields = (_managementClass: IManagementClass) => {
        setField('ClassPeriodQuantity', _managementClass.classPeriodQuantity);
        setField('CloseTypeId', _managementClass.closeType.id);
        setField('ContractorId', _managementClass.contractor.id);
        setField('EndAt', parseISO(_managementClass.endAt));
        setField('IsActive', _managementClass.isActive);
        setField(
            'Holidays',
            _managementClass.studentClassManagementHolidays
                .map((studentClassHoliday: StudentClassManagementHolidayDto) => parseISO(studentClassHoliday.holidayDate))
        );
        setField('Name', _managementClass.name);
        setField('PeriodQuantity', _managementClass.periodQuantity);
        setField('StartAt', parseISO(_managementClass.startAt));
        setInitialValues({ PeriodQuantity: _managementClass.periodQuantity, ClassPeriodQuantity: _managementClass.classPeriodQuantity });
    };

    const fetchFields = async () => {
        const fields = await ManagementClassesService.GetManagementClassById(Number(studentClassManagementId));
        if (!fields) return showErrorToast("Erro ao recuperar os dados da turma mãe!");
        setAllDataFields(fields);
    };

    const setInitialFields = async () => {
        if (!state?.managementLocation?.managementClasses || !state?.managementLocation?.managementClasses.length) return fetchFields();
        const { managementClasses } = state.managementLocation;
        const _managementClass = managementClasses
            .find((managementClass: IManagementClass) => managementClass.id === Number(studentClassManagementId));
        if (!_managementClass) return fetchFields();
        return setAllDataFields(_managementClass);
    };

    useEffect(() => {
        setIsLoading(true);
        fetchDropdown();
        if (pageType == 'edit') setInitialFields();
        setIsLoading(false);
    }, []);

    const validateFields = (): boolean => {
        if (!dataFields.ContractorId) {
            showErrorToast("O contratante da turma mãe é obrigatório!");
            return false;
        };
        if (!dataFields.CloseTypeId) {
            showErrorToast("O tipo de fechamento é obrigatório!");
            return false;
        };
        if (!dataFields.Name) {
            showErrorToast("O nome da turma mãe é obrigatório!");
            return false;
        };
        if (!dataFields.ClassPeriodQuantity) {
            showErrorToast("A quantidade de aulas é obrigatória!");
            return false;
        };
        if (!dataFields.PeriodQuantity) {
            showErrorToast("A quantidade de periodos é obrigatória!");
            return false;
        };
        if (!dataFields.StartAt) {
            showErrorToast("A data de início do curso é obrigatória!");
            return false;
        };
        if (!dataFields.EndAt) {
            showErrorToast("A data de fim do curso é obrigatória!");
            return false;
        };
        return true;
    };

    const navigateBack = () => {
        if (!state?.managementLocation?.managementClasses || !state?.managementLocation?.managementClasses.length) {
            return navigate("/managementClass", { replace: true });
        };
        navigate(state.navigateBack ?? '/managementClass', { replace: true, state });
    };

    useBackListener(() => {
        navigateBack();
    });

    const setManagementClass = (managementClass: IManagementClass) => {
        if (!state?.managementLocation?.managementClasses || !state?.managementLocation?.managementClasses.length) return;
        const _oldManagementClass = state.managementLocation.managementClasses
            .find((managementClass: IManagementClass) => managementClass.id === Number(studentClassManagementId));
        if (!_oldManagementClass) state.managementLocation.managementClasses = [...state.managementLocation.managementClasses, managementClass];
        state.managementLocation.managementClasses = state.managementLocation.managementClasses.map(cl => {
            if (cl.id === Number(studentClassManagementId)) return managementClass;
            return cl;
        })
    };

    const CreateManagementClass = async () => {
        setIsLoading(true);
        if (!validateFields()) return setIsLoading(false);
        const _data: ICreateManagementClass = {
            contractorId: dataFields.ContractorId!,
            closeTypeId: dataFields.CloseTypeId!,
            name: dataFields.Name!,
            classPeriodQuantity: Number(dataFields.ClassPeriodQuantity!),
            periodQuantity: Number(dataFields.PeriodQuantity!),
            startAt: formatISO(dataFields.StartAt!),
            endAt: formatISO(dataFields.EndAt!),
            holidays: dataFields.Holidays.map(d => formatISO(d)),
            createdBy: user?.profileId ?? 0
        };
        const result = await ManagementClassesService.CreateManagementClasses(_data);
        if (!result) {
            setIsLoading(false);
            return showErrorToast(`Erro ao criar a turma mãe ${dataFields.Name}!`);
        };
        setManagementClass(result);
        setIsLoading(false);
        showSuccessToast(`Turma ${dataFields.Name} criada com sucesso!`);
        navigateBack();
    };

    const update = async (isDeleted: boolean): Promise<IManagementClass | null> => {
        const _data: IUpdateManagementClass = {
            id: Number(studentClassManagementId),
            contractorId: dataFields.ContractorId!,
            closeTypeId: dataFields.CloseTypeId!,
            name: dataFields.Name!,
            classPeriodQuantity: Number(dataFields.ClassPeriodQuantity!),
            periodQuantity: Number(dataFields.PeriodQuantity!),
            startAt: formatISO(dataFields.StartAt!),
            endAt: formatISO(dataFields.EndAt!),
            isActive: new Date() > (dataFields.StartAt ?? 0) && new Date() < (dataFields.EndAt ?? 0),
            updatedBy: user?.profileId ?? 0,
            isDeleted: isDeleted,
            holidays: dataFields.Holidays.map(d => formatISO(d))
        };
        const result = await ManagementClassesService.UpdateManagementClasses(_data);
        return result;
    }

    const UpdateManagementClass = async () => {
        setIsLoading(true);
        if (!validateFields()) return setIsLoading(false);
        const result = await update(false);
        if (!result) {
            setIsLoading(false);
            return showErrorToast(`Erro ao tentar atualizar a turma mãe ${dataFields.Name}!`);
        }
        setManagementClass(result);
        setIsLoading(false);
        showSuccessToast(`Turma ${dataFields.Name} atualizada com sucesso!`);
        navigateBack();
    };

    const DeleteManagementClass = async () => {
        setIsLoading(true);
        if (!validateFields()) return setIsLoading(false);
        const updateResult = await update(true);
        if (!updateResult) {
            setIsLoading(false);
            return showErrorToast(`Erro ao tentar atualizar a turma mãe ${dataFields.Name}!`);
        };
        const classIdToDelete = Number(studentClassManagementId);
        const result = await ManagementClassesService.DeleteManagementClasses(classIdToDelete);
        if (!result) {
            setIsLoading(false);
            return showErrorToast(`Erro ao apagar a turma mãe ${dataFields.Name}!`);
        };
        const managementClasses = state?.managementLocation?.managementClasses;
        if (managementClasses) state!.managementLocation!.managementClasses = managementClasses.filter((managementClass: IManagementClass) => managementClass.id !== classIdToDelete);
        setIsLoading(false);
        showSuccessToast(`Turma ${dataFields.Name} apagada com sucesso!`);
        navigateBack();
    };

    return (
        <>
            {isLoading ? <MLoading /> : null}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                    paddingRight: '100px'
                }}
            >
                <Typography
                    variant="h1"
                    fontFamily={'Inter'}
                    fontWeight={600}
                    fontSize={28}
                >
                    {pageType == 'edit' ? 'Edição' : 'Criação'} turma mãe
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        flexWrap: 'wrap',
                        gap: '2%'
                    }}
                >
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Nome da turma mãe"
                        sx={{ width: '49%', marginTop: '20px' }}
                        value={dataFields.Name ? dataFields.Name : ''}
                        onChange={(event) => setField('Name', event.target.value)}
                    />
                    <MultiDatePicker
                        multiple
                        label="Selecione feriados se existirem"
                        value={dataFields.Holidays}
                        onChange={(dates) => setField('Holidays', dates)}
                        sx={{
                            width: '49%',
                            marginTop: '20px'
                        }}
                    />
                    <Tooltip
                        title={pageType == 'edit' ? 'Não é possível editar o contratante da turma mãe!' : '' }
                    >
                        <Autocomplete
                            disabled={pageType == 'edit'}
                            options={agents}
                            sx={{
                                width: '49%',
                                marginTop: '20px'
                            }}
                            renderInput={(params) => <TextField {...params} label="Contratante" />}
                            value={agents.find(el => el.value === dataFields.ContractorId) ?? null}
                            isOptionEqualToValue={(option, value) => option.value === value.value}
                            onChange={(_, value) => setField('ContractorId', value?.value)}
                        />
                    </Tooltip>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Quantidade de aulas"
                        sx={{
                            width: '49%',
                            marginTop: '20px',
                            '& .MuiFormHelperText-root': { color: 'red' }
                        }}
                        value={dataFields.ClassPeriodQuantity ? dataFields.ClassPeriodQuantity : ''}
                        onChange={(event) => setField('ClassPeriodQuantity', event.target.value.replace(/\D/g, ''))}
                    />
                    <Autocomplete
                        options={closeTypes}
                        sx={{
                            width: '49%',
                            marginTop: '20px'
                        }}
                        renderInput={(params) => <TextField {...params} label="Tipo de fechamento" />}
                        value={closeTypes.find(el => el.value === dataFields.CloseTypeId) ?? null}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        onChange={(_, value) => setField('CloseTypeId', value?.value)}
                    />
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Quantidade de períodos"
                        helperText={
                            dataFields.PeriodQuantity != initialValues.PeriodQuantity && pageType == 'edit' &&
                            WarningManagementChange()
                        }
                        sx={{
                            width: '49%',
                            marginTop: '20px',
                            '& .MuiFormHelperText-root': { color: 'red' }
                        }}
                        value={dataFields.PeriodQuantity ?? ''}
                        onChange={(event) => setField('PeriodQuantity', event.target.value.replace(/\D/g, ''))}
                    />
                    <MultiDatePicker
                        label="Data de início"
                        value={dataFields.StartAt}
                        onChange={(date) => setField('StartAt', date)}
                        sx={{
                            width: '23%',
                            marginTop: '20px'
                        }}
                    />
                    <MultiDatePicker
                        label="Data de fim"
                        value={dataFields.EndAt}
                        onChange={(date) => setField('EndAt', date)}
                        sx={{
                            width: '23%',
                            marginTop: '20px'
                        }}
                    />

                </Box>
                <Box
                    sx={{
                        marginTop: '30px',
                        display: 'flex',
                        gap: '20px'
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
                        onClick={() => navigateBack()}
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
                        onClick={() => pageType == 'edit' ? UpdateManagementClass() : CreateManagementClass()}
                    >
                        Salvar
                    </Button>

                    {
                        pageType == 'edit' &&
                        <Tooltip title="Por enquanto, essa opção está indisponível!">
                            <Box>
                                <Button
                                    variant="contained"
                                    startIcon={<DeleteIcon />}
                                    disabled={dataFields.IsActive}
                                    sx={{
                                        borderRadius: '10px',
                                        py: 2,
                                        px: 3,
                                        backgroundColor: '#c9322b',
                                        color: 'white',
                                        boxShadow: 'none',
                                        '&:hover': {
                                            backgroundColor: '#c9322b',
                                            boxShadow: 'none',
                                        },
                                        '&:active': {
                                            boxShadow: 'none',
                                        },
                                    }}
                                    onClick={() => DeleteManagementClass()}
                                >
                                    Excluir turma mãe
                                </Button>
                            </Box>
                        </Tooltip>
                    }
                </Box>
            </Box>
        </>
    );
};

export default CreateAndEditManagementClass;