import { useState, useEffect } from 'react';
import { Autocomplete, TextField, Box, Stack, Divider, Button, Tooltip } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MLoading from "../../../components/molecules/MLoading/index";
import StudentService from '../../../services/student/student.service';
import TrailService from '../../../services/api/classes/trail.service';
import HandsOnService from '../../../services/HandsOn/handsOn.service';
import ReplayIcon from '@mui/icons-material/Replay';
import { ActiveStudentClassDto } from "../../../interfaces/teams/class.interfaces";
import { showErrorToast } from '../../../utils/toast';

type SetterFunction<T> = React.Dispatch<React.SetStateAction<T | null>>;

interface IClasses {
    id: number;
    name: string;
    trailId: number;
};

interface ITrails {
    id: number;
    name: string;
};

interface IModules {
    id: number;
    name: string;
    date: Date;
};

interface IContentHandsOn {
    contentId: number,
    link: string | null,
    handsOnTypeId: number | null,
    maxDate: Date,
    register: boolean
};

interface IClassData {
    trailId: number,
    moduleId: number,
    content: IContentHandsOn,
    trailName: string,
    moduleName: string
};

const THandsOnCreaction = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [classData, setClassData] = useState<IClassData[] | undefined>(undefined);

    const [classes, setClasses] = useState<IClasses[]>([]);
    const [trails, setTrails] = useState<ITrails[]>([]);
    const [modules, setModules] = useState<IModules[]>([]);

    const [selectedClass, setSelectedClass] = useState<IClasses | null>(null);
    const [selectedTrail, setSelectedTrail] = useState<ITrails | null>(null);
    const [selectedModule, setSelectedModule] = useState<IModules | null>(null);

    const [selectedHandsOn, setSelectedHandsOn] = useState<IClassData | null>(null);

    const [liveClassUrl, setLiveClassUrl] = useState<{original: string, current: string}>({original: '', current: ''});
    const [recordedClassUrl, setRecordedClassUrl] = useState<{original: string, current: string}>({original: '', current: ''});

    const [dateCompared, setDateCompared] = useState<0 | 1 | -1>(0);
    const [handsType, setHandsType] = useState<number | null | undefined>(undefined);
    const [handsIsCreated, setHandsIsCreated] = useState<boolean | undefined>(undefined);

    const activeClasses = async () => {
        setIsLoading(true);
        try {
            const activeClasses = await StudentService.GetActiveClasses();
            setIsLoading(false);
            if (!activeClasses) return showErrorToast("Um erro ocorreu ao tentar buscar as classes ativas!");
            setClasses(
                activeClasses.map((el: ActiveStudentClassDto) => { return { id: el.id, name: el.name, trailId: el.trailId } })
            );
        } catch(error) {
            setIsLoading(false);
            console.error("Failed to fetch active classes:", error);
        }
    };

    const getClassData = async (studentClassId: number) => {
        setIsLoading(true);
        try {
            const handsOnClass = await HandsOnService.getHandsOn(studentClassId);
            const classData = await StudentService.GetTeamByStudentClassId(studentClassId);
            if (!handsOnClass) throw new Error("hands on class list");
            if (!classData) throw new Error("student class data");
            const trailsClass = await TrailService.GetAllByCourse(classData.trailId);
            if (!trailsClass) throw new Error("modules class list");
            const data = trailsClass
                .filter(trail => trail.isActive)
                .reduce((acumulator: any, trail) => {
                    const { name, trailId, modules } = trail;
                    const handsOnTrail = handsOnClass?.[0]?.contentHandsOnTrails.find(trail => trail.trailId === trailId);
                    if (!handsOnTrail) return acumulator;
                    const handsModules = modules
                        .map(module => {
                            const handsOnModule = handsOnTrail.contentHandsOnModules.find(hand => hand.moduleId === module.moduleId);
                            if (!handsOnModule) return null;
                            const { contentId, link, handsOnTypeId, maxDate, register } = handsOnModule;
                            return {
                                trailId, trailName: name,
                                moduleId: module.moduleId,
                                moduleName: module.name,
                                content: { contentId, link, handsOnTypeId, maxDate: new Date(maxDate), register }
                            };
                        })
                        .filter(module => module);
                    return [...acumulator, ...handsModules];
                }, []);
            setClassData(data);
            setIsLoading(false);
        } catch(error) {
            setIsLoading(false);
            console.error("Failed to fetch:", error);
        };
    };

    const setSelected = <T extends ITrails | IClasses | IModules>(
        value: T | null,
        reason: string,
        setter: SetterFunction<T>
    ) => {
        if (!value) return setter(null);
        if (reason === "selectOption") return setter(value);
    }

    const compareDate = (maxClass: Date) => {
        maxClass.setHours(0, 0, 0, 0);
        const today = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
        today.setHours(0, 0, 0, 0);
        if (today.getTime() === maxClass.getTime()) return 0;
        if (today > maxClass) return 1;
        else return -1;
    };
    

    useEffect(() => {
        activeClasses();
    }, []);

    useEffect(() => {
        if (!classData) return;
        setTrails(
            [... new Map(classData.map(el => [el.trailId,
            { id: el.trailId, name: el.trailName }
            ])).values()]
        );
    }, [classData])

    useEffect(() => {
        setSelectedHandsOn(null);
        setSelectedTrail(null);
        if (!selectedClass) return;
        getClassData(selectedClass.id);
    }, [selectedClass]);

    useEffect(() => {
        setSelectedHandsOn(null);
        if (!classData) return;
        if (!selectedTrail) return;
        const modulesData = classData.filter(el => el.trailId === selectedTrail.id);
        setModules(
            [... new Map(modulesData.map(el => [el.moduleId,
            { id: el.moduleId, name: el.moduleName, date: el.content.maxDate }
            ])).values()]
        );
    }, [selectedTrail])

    useEffect(() => {
        setSelectedHandsOn(null);
        if (!classData || !modules) return;
        if (!selectedModule) return;

        let _classData = classData;
        _classData = _classData.filter(el => el.moduleId === selectedModule.id);

        setSelectedHandsOn(_classData[0]);
        setLiveClassUrl({original: _classData[0].content.link || '', current: _classData[0].content.link || ''})
        setRecordedClassUrl({original: _classData[0].content.link || '', current: _classData[0].content.link || ''})
    }, [selectedModule])

    useEffect(() => {
        if (!selectedHandsOn) {
            setSelectedModule(null);
            setRecordedClassUrl({original: '', current: ''});
            return setLiveClassUrl({original: '', current: ''});
        };

        const { handsOnTypeId, link, maxDate } = selectedHandsOn.content;

        setDateCompared(compareDate(maxDate));

 
        if(handsOnTypeId !== 2) setRecordedClassUrl({original: '', current:''})
        else setLiveClassUrl({original: '', current:''})

        setHandsType(handsOnTypeId);

        setHandsIsCreated(selectedHandsOn.content.register);
    }, [selectedHandsOn]);

    const handsOnUpdater = async () => {
        if (!selectedHandsOn || !classData || !selectedModule) return;

        setIsLoading(true);

        const changedLive = liveClassUrl.current !== liveClassUrl.original;
        const changedRecorded = recordedClassUrl.current !== recordedClassUrl.original
 
        let classUrl;

        let typeId;

        if(handsType === null && changedRecorded && recordedClassUrl.current !== '') {
            classUrl = recordedClassUrl.current;
            typeId = 2;
        }
        else if(handsType === null && changedLive && liveClassUrl.current !== '') {
            classUrl = liveClassUrl.current;
            typeId = 1;
        }
        else if(handsType === 1 && changedRecorded && recordedClassUrl.current !== '') {
            classUrl = recordedClassUrl.current;
            typeId = 2;
        }
        else if(handsType === 1 && liveClassUrl.current !== '' && changedLive) {
            classUrl = liveClassUrl.current;
            typeId = 1;
        }
        else if(handsType === 1 && liveClassUrl.current === '') {
            classUrl = '';
            typeId = null;
        }
        else if(handsType === 2 && recordedClassUrl.current === '') {
            classUrl = '';
            typeId = null;
        }
        else if(handsType === 2 && recordedClassUrl.current !== '' && changedRecorded) {
            classUrl = recordedClassUrl.current;
            typeId = 2;
        }
        else return console.error('Failed to find the hands on type');

        const newModuleContent = {
            contentId: selectedHandsOn.content.contentId as number,
            handsOnTypeId: typeId as 1 | 2 | null,
            link: classUrl,
            maxDate: selectedModule.date,
            register: true
        };

        const body = {
            studentClassId: selectedClass!.id,
            contentId: selectedHandsOn.content.contentId as number,
            link: classUrl || '',
            handsOnTypeId: typeId as 1 | 2 | null
        };
        try {
            if (handsIsCreated) await HandsOnService.updateHandsOnClass(body)
            else await HandsOnService.addHandsOnClass(body);
        } catch(error) {
            console.error("Failed to post the hands on:", error);
        };
            
        setSelectedHandsOn(current => {
            if (!current) return current;
            return {
                ...current,
                content: newModuleContent
            };
        });

        if(typeId === 1) {
            setLiveClassUrl({original: newModuleContent.link || '', current: newModuleContent.link || ''});
            setRecordedClassUrl({original:  '', current: ''});
        }
        else if(typeId === 2) {
            setLiveClassUrl({original: '', current: ''});
            setRecordedClassUrl({original: newModuleContent.link || '', current: newModuleContent.link || ''});
        }
        else {
            setLiveClassUrl({original: '', current: ''});
            setRecordedClassUrl({original:  '', current: ''});
        };
            

        setClassData(current => current?.map(el => {
            if (el.content.contentId !== selectedHandsOn.content.contentId) return el;
            return {
                ...el,
                content: newModuleContent
            }
        }));

        setIsLoading(false);
    }

    return (
        <>
            <div style={{ height: '80vh' }}>
                <Stack
                    direction="row"
                    divider={<Divider orientation="vertical" flexItem />}
                    spacing={2}
                    sx={{ height: '100%', alignItems: 'stretch' }}
                >
                    <Box sx={{ width: '30%', display: 'flex', flexDirection: 'column', gap: '3vh' }}>
                        <h2
                            style={{
                                fontWeight: '400',
                                textDecoration: 'underline grey',
                                fontSize: '20px',
                                textAlign: 'center'
                            }}
                        >
                            Selecione o Hands-On
                        </h2>
                        <Autocomplete
                            limitTags={2}
                            id="classes-autocomplete"
                            options={classes}
                            getOptionLabel={(option) => option.name}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            onChange={(_: unknown, value: IClasses | null, reason: string) => setSelected(value, reason, setSelectedClass)}
                            renderInput={(params) => (
                                <TextField {...params} label="Turma" placeholder="Selecione a turma" />
                            )}
                            noOptionsText={'Não existem classes ativas no momento'}
                            value={selectedClass}
                            sx={{ width: '100%' }}
                        />
                        {
                            (selectedClass !== null && trails.length !== 0) &&
                            <Autocomplete
                                limitTags={2}
                                id="classes-autocomplete"
                                options={trails}
                                getOptionLabel={(option) => option.name}
                                onChange={(_: unknown, value: ITrails | null, reason: string) => setSelected(value, reason, setSelectedTrail)}
                                renderInput={(params) => (
                                    <TextField {...params} label="Módulo" placeholder="Selecione o módulo" />
                                )}
                                value={selectedTrail}
                                sx={{ width: '100%' }}
                            />
                        }
                        {
                            (selectedClass !== null && selectedTrail !== null) &&
                            (
                                <>
                                    <Box sx={{ borderTop: 'solid rgba(0, 0, 0, 0.12) 1px' }} />
                                    <Autocomplete
                                        limitTags={2}
                                        id="classes-autocomplete"
                                        options={modules}
                                        getOptionLabel={(option) => option.date.toLocaleDateString("pt-BR") + ' - ' + option.name}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        onChange={(_: unknown, value: IModules | null, reason: string) => setSelected(value, reason, setSelectedModule)}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Aula" placeholder="Selecione a aula" />
                                        )}
                                        value={selectedModule}
                                        sx={{ width: '100%' }}
                                    />
                                </>
                            )
                        }
                    </Box>
                    {isLoading ? (
                        <MLoading />
                    ) : (
                            <Box sx={{ width: '70%' }}>
                                {
                                    selectedHandsOn &&
                                    <>
                                        <h2
                                            style={{
                                                fontWeight: '400',
                                                textDecoration: 'underline grey',
                                                fontSize: '20px',
                                                textAlign: 'center',
                                                marginBottom: '3vh'
                                            }}
                                        >
                                            Informações do Hands-On
                                        </h2>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '6vh',
                                                width: '100%',
                                                alignItems: 'center'
                                            }}
                                        >
                                            {
                                                handsType !== 2 &&
                                                <Tooltip 
                                                    title={
                                                        dateCompared === 1 ? 
                                                        "Este campo está desabilitado porque a aula já passou." : ""
                                                    }
                                                    placement="bottom"
                                                >
                                                    <div
                                                        style={{width: '70%'}} 
                                                    >
                                                    <TextField
                                                        // key={liveClassUrl.current || 'default-key'}
                                                        disabled={!(dateCompared === -1 || dateCompared === 0)}
                                                        id="outlined-basic"
                                                        label="Link para a aula ao vivo"
                                                        variant="outlined"
                                                        value={liveClassUrl.current}
                                                        onChange={(event) => setLiveClassUrl(curr => {return {...curr, current: event.target.value}})}
                                                        sx={{width: '100%'}}
                                                    />
                                                    </div>
                                                </Tooltip>
                                            }
                                            <Tooltip 
                                                title={
                                                    dateCompared === -1 ? 
                                                    `A aula está agendada para o dia ${selectedHandsOn.content.maxDate.toLocaleDateString("pt-BR")}.` : ""
                                                }
                                                placement="bottom"
                                            >
                                                <Box style={{ width: '70%' }} >
                                                    <TextField
                                                        disabled={!(dateCompared === 1 || dateCompared === 0)}
                                                        id="outlined-basic"
                                                        label="Link para a aula gravada"
                                                        variant="outlined"
                                                        sx={{ width: '100%' }}
                                                        value={recordedClassUrl.current}
                                                        onChange={(event) => setRecordedClassUrl(curr => {return {...curr, current: event.target.value}})}
                                                    />
                                                </Box>
                                            </Tooltip>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    gap: '10%', 
                                                    width: '70%'
                                                }}
                                            >
                                                {
                                                    ((liveClassUrl.current !== liveClassUrl.original) || (recordedClassUrl.current !== recordedClassUrl.original)) &&
                                                    <>
                                                        <Button
                                                            startIcon={<ReplayIcon />}
                                                            variant="contained" 
                                                            onClick={() => {
                                                                setLiveClassUrl(curr => {return {...curr, current: liveClassUrl.original}});
                                                                setRecordedClassUrl(curr => {return {...curr, current: recordedClassUrl.original}});
                                                            }}
                                                            sx={{ 
                                                                minWidth: 100, 
                                                                marginLeft: 1, 
                                                                width: '100%',
                                                                backgroundColor: handsIsCreated ? "#0A5995" : "#6EB700",
                                                                '&:hover': {
                                                                    backgroundColor: handsIsCreated ? 
                                                                    "#1a5a99" : "#5ea600"
                                                                }
                                                            }}
                                                        >
                                                            Reverter
                                                        </Button>
                                                        <Button
                                                            startIcon={
                                                                handsIsCreated ?
                                                                <SaveIcon /> : <AddCircleOutlineIcon />
                                                            }
                                                            variant="contained" 
                                                            onClick={handsOnUpdater}
                                                            sx={{ 
                                                                minWidth: 100, 
                                                                marginLeft: 1, 
                                                                width: '100%',
                                                                backgroundColor: handsIsCreated ?
                                                                "#0A5995" : "#6EB700",
                                                                '&:hover': {
                                                                    backgroundColor: handsIsCreated ?
                                                                    "#1a5a99" : "#5ea600"
                                                                },
                                                            }}
                                                        >
                                                            {
                                                                handsIsCreated ?
                                                                "Salvar aula Hands-On" : "Criar aula Hands-On"
                                                            }
                                                        </Button>
                                                    </>
                                                }
                                            </Box>
                                        </Box>
                                    </>
                                }
                            </Box>
                        )
                    }
                </Stack>
            </div>

        </>
    );
};

export default THandsOnCreaction;