import HandsOnService from "../../../services/HandsOn/handsOn.service";
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import {
    Box, Button, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow,
    Checkbox, FormControlLabel
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import MLoading from "../../molecules/MLoading";

import { IStudent, IHandsModule, IModules, ISelectLists } from "../../../interfaces/teams/handsOn.interfaces";

const TTeamHandsOn = () => {
    const { classId } = useParams<string>();
    const location = useLocation();
    const state = location.state as IHandsModule;
    const navigate = useNavigate();

    const [students, setStudents] = useState<IStudent[]>(state.students);
    const [modules, setModules] = useState<IModules[]>([]);
    const [filteredModules, setFilteredModules] = useState<IModules[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasCurrentWeek, setHasCurrentWeek] = useState<boolean>(false);
    const [weekDays, setWeekDays] = useState<Date[]>([]);
    const [isChecked, setIsChecked] = useState(false);

    const [listClasses, setListClasses] = useState<ISelectLists[]>([]);
    const [listModules, setListModules] = useState<ISelectLists[]>([]);
    const [listDates, setListDates] = useState<ISelectLists[]>([]);
    const [selectedClass, setSelectedClass] = useState<ISelectLists[]>([]);
    const [selectedModule, setSelectedModule] = useState<ISelectLists[]>([]);
    const [selectedDate, setSelectedDate] = useState<ISelectLists[]>([]);
    const [selectedWeek, setSelectedWeek] = useState<ISelectLists[]>([]);

    const getTrails = async () => {
        setIsLoading(true);
        try {
            const handsOnListByClassId = await HandsOnService.getHandsOn(Number(classId));

            if (!handsOnListByClassId) throw new Error("hands on class list");

            const handsOnBySelectedTrail = handsOnListByClassId?.[0]?.contentHandsOnTrails.find(contentTrail => contentTrail.trailId === state.trailId);
            if (!handsOnBySelectedTrail) return setIsLoading(false);

            let indexCounter = 0;

            const _modules: IModules[] = state.modules
                .map(module => {
                    const { moduleId, name, orderNumber } = module;
                    const handsOnModule = handsOnBySelectedTrail.contentHandsOnModules.find(module => module.moduleId === moduleId);

                    if (!handsOnModule) return null;
                    return {
                        moduleId,
                        orderNumber,
                        name: name,
                        moduleName: name,
                        handsOnLink: handsOnModule.link,
                        handsDate: new Date(handsOnModule.maxDate),
                        dateId: ++indexCounter,
                        register: handsOnModule.register,
                        contentId: handsOnModule.contentId,
                        handsOnTypeId: handsOnModule.handsOnTypeId
                    };
                })
                .filter(module => module !== null) as IModules[];

            setModules(_modules);
            setFilteredModules(_modules);

            setListClasses([...new Map(_modules.map(el => [el.orderNumber, { value: el.orderNumber.toString(), id: el.orderNumber, setPointer: setSelectedClass }])).values()]);
            setListModules([...new Map(_modules.map(el => [el.moduleId, { value: el.moduleName, id: el.moduleId, setPointer: setSelectedModule }])).values()]);
            setListDates([...new Map(_modules.map(el => [el.dateId, { value: el.handsDate.toLocaleDateString("pt-BR"), id: el.dateId, setPointer: setSelectedDate }])).values()]);
            
            const _weekDays = getWeekDays();

            setHasCurrentWeek(_modules.filter(el => el.handsDate >= _weekDays[0] && el.handsDate <= _weekDays[1]).length > 0);

            setIsLoading(false);
        }
        catch (error) {
            setIsLoading(false);
            console.error("Failed to fetch:", error);
        };
    };

    useEffect(() => {
        setWeekDays(getWeekDays());
        getTrails();
    }, []);

    const filterData = (newValue: ISelectLists[], reason: string, details: { option: ISelectLists } | undefined, setPointer: React.Dispatch<React.SetStateAction<ISelectLists[]>>) => {
        if (reason === "clear" || !details)
            return setPointer([]);

        if (reason === "selectOption")
            return setPointer((current: ISelectLists[]) => [...current, ...newValue]);

        if (reason === "removeOption")
            return setPointer((current: ISelectLists[]) => {
                return current.filter(el => el.id !== details.option.id)
            });
    };

    useEffect(() => {
        let _filteredModules = modules;

        if (selectedClass.length > 0) _filteredModules = _filteredModules.filter(item => selectedClass.find(selected => selected.id === item.orderNumber))
        if (selectedModule.length > 0) _filteredModules = _filteredModules.filter(item => selectedModule.find(selected => selected.id === item.moduleId))
        if (selectedDate.length > 0) _filteredModules = _filteredModules.filter(item => selectedDate.find(selected => selected.id === item.dateId));
        if (selectedWeek.length > 0) _filteredModules = _filteredModules.filter(item => selectedWeek.find(selected => selected.id === item.dateId));

        setFilteredModules(_filteredModules);
    }, [selectedClass, selectedModule, selectedDate, selectedWeek]);

    const getWeekDays = () => {
        const dateNow = new Date();
        dateNow.setHours(0, 0, 0, 0);
        dateNow.setDate(dateNow.getDate() - 5);
        const startWeek = new Date(dateNow);
        dateNow.setDate(dateNow.getDate() + 6);
        const endWeek = new Date(dateNow);
        return [startWeek, endWeek];
    };

    const selectWeekDays = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(event.target.checked);
        if(!event.target.checked) return setSelectedWeek([]);
        
        const filteredDates = [...new Map(modules
            .filter(el => el.handsDate >= weekDays[0] && el.handsDate <= weekDays[1])
            .map(el => [el.dateId, { value: el.handsDate.toLocaleDateString("pt-BR"), id: el.dateId, setPointer: setSelectedDate }]))
            .values()];
        return setSelectedWeek(filteredDates);
    };

    const compareDate = (maxClass: Date) => {
        maxClass.setHours(0, 0, 0, 0);
        const today = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
        today.setHours(0, 0, 0, 0);
        if (today >= maxClass) return 1;
        return 0;
    };
    
    const TABLE_HEAD = [
        { title: "Aula", field: "aulaNumber" },
        { title: "Tema", field: "moduleName" },
        { title: "Data", field: "handsDate" },
        { title: "Etapa", field: "handsOnTypeId" }
    ];

    const HAND_STEPS = [
        { stepId: null, stepName: "Aguardando link do Hands-On ao vivo" },
        { stepId: 1, stepName: "Aguardando link do Hands-On gravado" },
        { stepId: 2, stepName: "Hands-On finalizado e salvo!" },
    ];

    return (
        <>
            <Button
                variant="contained"
                onClick={() => navigate(
                    state.navigateBack == undefined ?
                    `/teams/handsOn/${Number(classId)}/trails` : state.navigateBack,
                    {
                        state: {
                            ...state,
                            trails: state.classTrails
                        }
                    })
                }
                startIcon={<ArrowBackIcon />}
                sx={{ marginBottom: 3 }}
            >
                Voltar para módulos
            </Button>
            <Box
                sx={{
                    marginBottom: '2vh',
                    marginRight: '20px'
                }}
            >
                <h1 style={{ fontSize: '26px' }}>Hands-On por Aula</h1>
                <h4 style={{ color: 'grey', fontWeight: '400' }} >Turma: {state?.className}</h4>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                <Autocomplete
                    multiple
                    limitTags={2}
                    id="classes-autocomplete"
                    options={listClasses}
                    getOptionLabel={(option) => option.value}
                    onChange={(_: unknown, newValue: ISelectLists[], reason: string, details: { option: ISelectLists } | undefined) => filterData(
                        newValue, reason, details, setSelectedClass
                    )}
                    renderInput={(params) => (
                        <TextField {...params} label="Aulas" placeholder="Selecione as aulas do Hands-On" />
                    )}
                    sx={{ flexGrow: '1' }}
                />
                <Autocomplete
                    multiple
                    limitTags={2}
                    id="modules-autocomplete"
                    options={listModules}
                    getOptionLabel={(option) => option.value}
                    onChange={(_: unknown, newValue: ISelectLists[], reason: string, details: { option: ISelectLists } | undefined) => filterData(
                        newValue, reason, details, setSelectedModule
                    )}
                    renderInput={(params) => (
                        <TextField {...params} label="Temas" placeholder="Selecione os temas do Hands-On" />
                    )}
                    sx={{ flexGrow: '2' }}
                />
                <Autocomplete
                    multiple
                    limitTags={2}
                    id="dates-autocomplete"
                    options={listDates}
                    getOptionLabel={(option) => option.value}
                    onChange={(_: unknown, newValue: ISelectLists[], reason: string, details: { option: ISelectLists } | undefined) => filterData(
                        newValue, reason, details, setSelectedDate
                    )}
                    renderInput={(params) => (
                        <TextField {...params} label="Datas" placeholder="Selecione as datas do Hands-On" />
                    )}
                    sx={{ flexGrow: '1' }}
                />
            </Box>



            {isLoading ? (
                <MLoading />
            ) : (
                <>

                    <Box sx={{
                        border: '1px solid black',
                        borderRadius: 2,
                        p: 2,
                        display: 'flex',
                        position: 'relative',
                        alignItems: 'center',
                        justifyContent: 'center',
                        my: 2
                    }}>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ color: '#4263EB', fontFamily: 'Inter', fontWeight: 'bold' }}>Módulo: {state.trailName}</Box>
                        </Box>
                        <FormControlLabel 
                            control={<Checkbox 
                                onChange={selectWeekDays} 
                                checked={isChecked}
                                disabled={!hasCurrentWeek}
                                />} 
                            label="Apenas aulas da semana atual" 
                            sx={{
                                marginLeft: '30px',
                                userSelect: 'none'
                            }}
                        />
                    </Box>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {TABLE_HEAD.map((item: any) => (
                                        <TableCell
                                            key={item.field}
                                            sx={{ top: 64, bgcolor: "#4263EB", color: "white" }}>
                                            {item.title}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredModules && (filteredModules.map((itemRow: any) => (
                                    <TableRow
                                        key={itemRow.contentId}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.07)',
                                            },
                                            cursor: compareDate(itemRow.handsDate) && itemRow.register ? 'pointer' : 'not-allowed',
                                            userSelect: compareDate(itemRow.handsDate) && itemRow.register ? 'all' : 'none'
                                        }}
                                        onClick={
                                            () => {
                                                if (!compareDate(itemRow.handsDate) || !itemRow.register) return;
                                                navigate(
                                                    `/teams/handsOn/presence/${itemRow.contentId}`,
                                                    {
                                                        state: {
                                                            ...state,
                                                            classId: Number(classId),
                                                            students,
                                                            moduleId: itemRow.orderNumber,
                                                            moduleName: itemRow.moduleName,
                                                            modules: modules,
                                                            date: itemRow.handsDate
                                                        }
                                                    })
                                            }
                                        }
                                    >
                                        <TableCell>{itemRow.orderNumber}</TableCell>
                                        <TableCell>{itemRow.moduleName}</TableCell>
                                        <TableCell> {itemRow.handsDate.toLocaleDateString('pt-BR')} </TableCell>
                                        <TableCell>{
                                            HAND_STEPS.find(step => step.stepId === itemRow.handsOnTypeId)?.stepName || 'Estado não encontrado'
                                        }</TableCell>
                                    </TableRow>
                                )))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}
        </>
    )
};

export default TTeamHandsOn;