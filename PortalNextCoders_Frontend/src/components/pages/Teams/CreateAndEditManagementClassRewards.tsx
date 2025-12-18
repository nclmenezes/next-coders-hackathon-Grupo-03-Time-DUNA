import {
    Box, Typography, Button, Autocomplete, TextField, TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from "@mui/material";
import useBackListener from "../../../hooks/useBackListener";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useReducer } from 'react';
import { showErrorToast, showSuccessToast } from "../../../utils/toast";
import { useAuth } from "../../../context/AuthProvider/useAuth";
import { ILocationState } from "../../../interfaces/teams/class.interfaces";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import FinanceRewardService from "../../../services/Teams/classes/financeReward.service";
import {
    IClassFinanceReward,
    IFinanceType,
    IUpdateFinanceReward,
    IFinanceRewardWeight,
    ICreateFinanceReward,
    IFinanceRewardConfiguration
} from "../../../interfaces/teams/financeReward.interfaces";
import MLoading from '../../molecules/MLoading';
import WarningIcon from '@mui/icons-material/Warning';
import DeleteIcon from '@mui/icons-material/Delete';

const TABLE_HEAD = [
    {
        title: "Atividade",
        field: "activityName",
    },
    {
        title: "Peso (%)",
        field: "activityValue"
    }
];

interface IAutoComplete<T> {
    value: T;
    label: string;
};

interface IRewardsFields {
    financeRewardId: number;
    financeCalculationTypeId: number;
    bonusValue: number;
};

interface IActivityValues {
    activityId: number;
    activityName: string;
    value: number;
};

const rewardFieldsInitialState: IRewardsFields = {
    financeRewardId: 0,
    financeCalculationTypeId: 0,
    bonusValue: 0
};

type Action = { type: 'SET_FIELD'; field: keyof IRewardsFields; value: any };

function fieldsReducer(state: IRewardsFields, action: Action): IRewardsFields {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value };
        default:
            throw new Error('Unknown action type');
    }
};

const CreateAndEditManagementClassRewards = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { studentClassManagementId } = useParams();
    const { user } = useAuth();
    const state = location.state as ILocationState;
    const [rewardFields, setRewardFields] = useReducer(fieldsReducer, rewardFieldsInitialState);
    const [classFinanceReward, setClassFinanceReward] = useState<IClassFinanceReward | null>(null);
    const [activityTable, setActivityTable] = useState<IActivityValues[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [financeRewardTypes, setFinanceRewardTypes] = useState<IAutoComplete<number>[]>([]);
    const [financeRewardCalculationTypes, setFinanceRewardCalculationTypes] = useState<IAutoComplete<number>[]>([]);

    const [percentWarning, setPercentWarning] = useState<boolean>(false);

    const setField = (field: keyof IRewardsFields, value: any) => {
        setRewardFields({ type: 'SET_FIELD', field, value });
    };

    const fetchClassFinanceReward = async () => {
        const _classFinanceReward: IClassFinanceReward | null = await FinanceRewardService.GetManagementClassReward(Number(studentClassManagementId));
        if (!_classFinanceReward) return await fetchActivityTypes([]);
        setClassFinanceReward(_classFinanceReward);
        await fetchActivityTypes(_classFinanceReward.financeRewardConfigurations);
        setField("financeRewardId", _classFinanceReward.financeRewardType.id);
        setField("financeCalculationTypeId", _classFinanceReward.financeRewardCalculationType.id);
        setField("bonusValue", _classFinanceReward.bonusValue);
    };

    const fetchDropdownData = async () => {
        const rewardTypes: IFinanceType[] = await FinanceRewardService.GetFinanceRewardTypes();
        const calculationTypes: IFinanceType[] = await FinanceRewardService.GetFinanceRewardCalculationTypes();
        if (rewardTypes.length !== 0) setFinanceRewardTypes(rewardTypes.map(el => { return { label: el.type, value: el.id } }));
        if (calculationTypes.length !== 0) setFinanceRewardCalculationTypes(calculationTypes.map(el => { return { label: el.type, value: el.id } }));
    };

    const fetchActivityTypes = async (financeRewardConfigurations: IFinanceRewardConfiguration[]) => {
        const activityTypes = await FinanceRewardService.GetActivityTypes();
        if (activityTypes.length === 0) return;
        setActivityTable(
            activityTypes.map((activityType: IFinanceType) => {
                let activityValue = 0;
                if (financeRewardConfigurations.length !== 0) {
                    const activityConfiguration = financeRewardConfigurations
                        .find((_financeConfiguration: IFinanceRewardConfiguration) => _financeConfiguration.activityType.id === activityType.id);
                    activityValue = activityConfiguration?.percentage ?? 0;
                };
                return {
                    activityId: activityType.id,
                    activityName: activityType.type,
                    value: activityValue
                } as IActivityValues
            })
        );
    };

    const fetchData = async () => {
        setIsLoading(true);
        await fetchDropdownData();
        await fetchClassFinanceReward();
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => setPercentWarning(activityValueSum), [activityTable]);

    const navigateBack = () => {
        if (!state?.managementLocation?.managementClasses || !state?.managementLocation?.managementClasses.length) {
            return navigate("/managementClass", { replace: true });
        };
        navigate(state.navigateBack ?? '/managementClass', { replace: true, state });
    };

    useBackListener(() => navigateBack());

    const activityValueSum = () => activityTable.some(el => /\.$/.test(String(el.value))) || Math.abs(activityTable.map(el => el.value).reduce((a, b) => a + b, 0) - 100) > 0.5;

    const validateFields = (): boolean => {    
        if (rewardFields.bonusValue === 0) {
            showErrorToast("Valor do bônus é obrigatório e não pode ser zero");
            return false;
        };
        if (rewardFields.financeRewardId == null) {
            showErrorToast("Tipo de financiamento é obrigatório");
            return false;
        };
        if (!rewardFields.financeCalculationTypeId == null) {
            showErrorToast("Tipo de cálculo financiamento é obrigatório");
            return false;
        };
        
        if (activityValueSum()) {
            showErrorToast("A soma dos pesos das atividades deve ser exatamente 100%");
            return false;
        };

        return true;
    };

    const definePercentage = (event: any, value: number): number => {
        let numb = event.target.value.replace(/[^\d.,]/g, '').replace(',', '.');
        if (numb > 100) numb = value;
        if (numb < 0) numb = 0;
        return /\.$/.test(numb) ? numb : Number(numb);
    };

    const updateFinanceReward = async () => {
        if (!validateFields() || !classFinanceReward) return;
        
        const _financeRewardConfiguration:  IFinanceRewardWeight[] = activityTable
            .map((activity: IActivityValues) => {
                return {
                    activityTypeId: activity.activityId,
                    percentage: activity.value
                }
            });

        const UpdateFinanceRewardDto: IUpdateFinanceReward = {
            id: classFinanceReward.id,
            financeRewardTypeId: rewardFields.financeRewardId,
            financeRewardCalculationTypeId: rewardFields.financeCalculationTypeId,
            bonusValue: rewardFields.bonusValue,
            updatedBy: user ? user.profileId ?? null : null,
            financeRewardConfiguration: _financeRewardConfiguration
        };

        setIsLoading(true);
        const financeRewardResponse = await FinanceRewardService.UpdateFinanceReward(UpdateFinanceRewardDto);
        setIsLoading(false);

        if (!financeRewardResponse) return showErrorToast("Não foi possível atualizar a recompensa da classe!")
        showSuccessToast("Recompensa da classe atualizada!")
        navigateBack();
    };

    const createFinanceReward = async () => {
        if (!validateFields()) return;
        
        const _financeRewardConfiguration:  IFinanceRewardWeight[] = activityTable
            .map((activity: IActivityValues) => {
                return {
                    activityTypeId: activity.activityId,
                    percentage: activity.value
                }
            });

        const CreateFinanceReward: ICreateFinanceReward = {
            studentClassManagementId: Number(studentClassManagementId),
            financeRewardTypeId: rewardFields.financeRewardId,
            financeRewardCalculationTypeId: rewardFields.financeCalculationTypeId,
            bonusValue: rewardFields.bonusValue,
            createdBy: user ? user.profileId ?? null : null,
            financeRewardConfiguration: _financeRewardConfiguration
        };

        setIsLoading(true);
        const financeRewardResponse = await FinanceRewardService.CreateFinanceReward(CreateFinanceReward);
        setIsLoading(false);

        if (!financeRewardResponse) return showErrorToast("Não foi possível criar a recompensa da classe!")
        showSuccessToast("Recompensa da classe criada!")
        navigateBack();
    };

    const deleteFinanceReward = async () => {
        if (!classFinanceReward) return;
        setIsLoading(true);
        const financeRewardResponse = await FinanceRewardService.DeleteFinanceReward(classFinanceReward.id);
        setIsLoading(false);
        if (!financeRewardResponse) return showErrorToast("Não foi possível deletar a recompensa da classe!");
        showSuccessToast("Recompensa da classe deletada!")
        navigateBack();
    };

    return (
        <>
            {isLoading && <MLoading />}
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
                    Recompensa
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '4%'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '48%'
                        }}
                    >
                        <Autocomplete
                            options={financeRewardTypes}
                            sx={{
                                width: '100%',
                                marginTop: '20px'
                            }}
                            renderInput={(params) => <TextField {...params} label="Tipo de financiamento" />}
                            value={financeRewardTypes.find(el => el.value == rewardFields.financeRewardId) ?? null}
                            onChange={(_, value) => setField('financeRewardId', value?.value)}
                            isOptionEqualToValue={(option, value) => option.value === value.value}
                        />
                        <Autocomplete
                            options={financeRewardCalculationTypes}
                            sx={{
                                width: '100%',
                                marginTop: '20px'
                            }}
                            renderInput={(params) => <TextField {...params} label="Tipo de cálculo do financiamento" />}
                            value={financeRewardCalculationTypes.find(el => el.value == rewardFields.financeCalculationTypeId) ?? null}
                            onChange={(_, value) => setField('financeCalculationTypeId', value?.value)}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Valor do bônus"
                            sx={{
                                width: '100%',
                                marginTop: '20px'
                            }}
                            value={rewardFields.bonusValue ?? ''}
                            onChange={(event) => setField('bonusValue', Number(event.target.value.replace(/\D/g, '')))}
                        />
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '48%',
                            gap: '10px'
                        }}
                    >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {TABLE_HEAD.map(item => (
                                        <TableCell align="center" key={item.field} sx={{ alignItems: "center", top: 64, bgcolor: "#4263EB", color: "white" }}>
                                            {item.title}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    activityTable.map((activityValue: IActivityValues) => (
                                        <TableRow key={activityValue.activityId}>
                                            <TableCell align="center">{activityValue.activityName}</TableCell>
                                            <TableCell align="center">
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    sx={{
                                                        width: '100px',
                                                        '& .MuiInputBase-input': {
                                                            textAlign: 'center'
                                                        }
                                                    }}
                                                    value={activityValue.value ?? ''}
                                                    onChange={(event) => {
                                                        setActivityTable(
                                                            activityTable.map((activity: IActivityValues) => {
                                                                if (activity.activityId === activityValue.activityId)
                                                                    activity.value = definePercentage(event, activityValue.value);
                                                                return activity;
                                                            })
                                                        )
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                        {
                            percentWarning &&
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: '10px',
                                    justifyContent: 'center',
                                    alignItens: 'center',
                                    userSelect: 'none',
                                    fontSize: '1.1em'
                                }}
                            >
                                <WarningIcon sx={{ fontSize: '100%' }} />
                                <Typography
                                    variant="h1"
                                    fontFamily={'Inter'}
                                    fontWeight={400}
                                    fontSize={'95%'}
                                >
                                    A soma dos pesos das atividades deve ser exatamente 100%
                                </Typography>
                            </Box>
                        }
                    </Box>
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
                        onClick={() => classFinanceReward ? updateFinanceReward() : createFinanceReward()}
                    >
                        {classFinanceReward ? "Salvar" : "Criar"}
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<DeleteIcon />}
                        disabled={!classFinanceReward}
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
                        onClick={() => deleteFinanceReward()}
                    >
                        Excluir
                    </Button>
                </Box>
            </Box>
        </>
    )
}


export default CreateAndEditManagementClassRewards;