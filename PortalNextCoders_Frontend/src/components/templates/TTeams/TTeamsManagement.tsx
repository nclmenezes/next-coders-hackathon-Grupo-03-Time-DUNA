import {
    Box,
    Button,
    Grid,
    InputLabel,
    Typography,
    TextField,
    FormControl,
    SelectChangeEvent,
    FormGroup,
    FormControlLabel,
    Switch,
    Select,
    OutlinedInput,
    MenuItem,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { showErrorToast } from "../../../utils/toast";
import studentService from "../../../services/student/student.service";
import { useParams } from "react-router-dom";
import MLoading from "../../molecules/MLoading";
import Moment from 'moment';
import contractorService from "../../../services/Teams/contractor.service";
import { format, formatISO, parseISO, isValid } from "date-fns";
import { zonedTimeToUtc } from 'date-fns-tz';
import { ICityResponse, IProvince } from "../../../interfaces/student/student.interfaces";
import axios from "axios";
import { PageHeader } from "../../pages/Candidate/styles";
import maintainersContractorService, { IContractorMaintainer } from "../../../services/api/maintainers/maintainersContractor.service";
import maintainersClassService, { RefreshMaintainersClassDto } from "../../../services/api/maintainers/maintainersClass.service";
import { Course } from "../../../interfaces/courses/responses/Course";
import studentClassService from "../../../services/api/student/studentClass.service";
import courseService from "../../../services/api/classes/course.service";
import ClassesDialog from "./components/ClassesDialog";
import TLocationSelector from "./TLocationSelector";
import { LocalizationProvider, MobileTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MultiDatePicker from "./components/MultiDatePicker";
import UploadButton from "./components/UploadButton";
import ClassDocumentsService from "../../../services/api/classes/documents.service";


function TTeamManagement() {
    const navigate = useNavigate();
    const { id } = useParams<string>();
    const [loading, setLoading] = useState(false);
    const [contractors, setContractors] = useState<any[]>([]);
    const [contractorId, setContractorId] = useState(0);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [finishedDate, setFinishedDate] = useState<Date>(new Date());
    const [holidays, setHolidays] = useState<Date[]>([new Date()]);
    const [className, setClassName] = useState("");
    const [classDescription, setClassDescription] = useState("");
    const [vacancies, setVacancies] = useState(0);
    const [maintainer, setMaintainer] = useState<IContractorMaintainer>();
    const [allMaintainers, setAllMaintainers] = useState<IContractorMaintainer[]>([]);
    const [course, setCourse] = useState<Course>();
    const [allCourses, setAllCourses] = useState<Course[]>([]);
    const [openClassesDialog, setOpenClassesDialog] = useState(false);
    const [considerContractingScope, setConsiderContractingScope] = useState(false);
    const [provinces, setProvinces] = useState<IProvince[]>([]);
    const [provincesSelect, setProvincesSelect] = useState<IProvince[]>([]);
    const [contractorLocations, setContractorLocations] = useState<ICityResponse[]>([]);
    const [classLocations, setClassLocations] = useState<ICityResponse[]>([]);

    const [handsOnTime, setHandsOnTime] = useState<Date | null>(new Date());
    const [classSponsor, setClassSponsor] = useState<string | null>('');
    const [emissionDate, setEmissionDate] = useState<Date | null>(new Date());
    const [classFiles, setClassFiles] = useState<{name: string, file: File, type: string | null, newName?: string, newFile?: File }[]>([]);

    const handleOpenClassesDialog = () => {
        setOpenClassesDialog(true);
    };

    const handleCloseClassesDialog = (value?: string) => {
        setOpenClassesDialog(false);
    };

    const getDocuments = async () => {
        ClassDocumentsService.GetDocumentsByStudentClassId(Number(id)).then((response) => {
            if (response === null) return;
            setClassFiles(response.documents.map((doc) => ({type: null, name: doc.documentName, file: new File([response.blobUrl + doc.documentFileName], doc.documentFileName, { type: 'application/pdf' })})));
        })
    }

    const uploadDocuments = async () => {
        setLoading(true);
        const promises = classFiles.map(async (file, fileIndex) => {
            switch (file.type) {
                case 'remove': {
                    const removeResponse = await ClassDocumentsService.RemoveClassDocument({
                        studentClassId: Number(id),
                        documentFileName: file.file.name.split('/').pop(),
                        documentName: file.name
                    });
                    if (!removeResponse) showErrorToast("Um erro ocorreu ao remover um documento na turma, recarregue a página e tente novamente!");
                    setClassFiles(_classFiles => 
                        _classFiles.filter((el, elIndex) => elIndex !== fileIndex)
                    );
                    break;
                }
                case 'new': {
                    const insertResponse = await ClassDocumentsService.InsertClassDocument({
                        studentClassId: Number(id),
                        documentFile: file.file,
                        documentName: file.name
                    });
                    if (!insertResponse) showErrorToast("Um erro ocorreu ao adicionar um documento na turma, recarregue a página e tente novamente!");
                    setClassFiles(_classFiles => 
                        _classFiles.map((el, elIndex) => {
                            if (elIndex === fileIndex) return {
                                ...el,
                                type: null
                            };
                            return el;
                        })
                    );
                    break;
                }
                case 'update': {
                    const updateResponse = await ClassDocumentsService.UpdateClassDocument({
                        studentClassId: Number(id),
                        oldDocumentFileName: file.file.name,
                        documentFile: file.newFile,
                        documentName: file.newName!
                    });
                    if (!updateResponse) showErrorToast("Um erro ocorreu ao atualizar o documento da turma, recarregue a página e tente novamente!");
                    setClassFiles(_classFiles => 
                        _classFiles.map((el, elIndex) => {
                            if (elIndex === fileIndex) return {
                                name: el.newName!,
                                file: el.newFile!,
                                type: null,
                                newName: undefined,
                                newFile: undefined
                            };
                            return el;
                        })
                    );
                    break;
                }
            }
        });
    
        try {
            await Promise.all(promises);
        } catch (error) {
            console.error('Error uploading documents:', error);
            showErrorToast('Erro ao atualizar documentos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const data = async () => {
            await getClassData(1);
        };

        data();
        getDocuments();
    }, []);

    useEffect(() => {
        const data = async () => {
            if (!considerContractingScope) {
                await getProvinces(contractorId);
            }
        };
        data();
    }, [considerContractingScope]);

    const getProvincesList = async (): Promise<any> => {
        const { data } = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/`);
        return data;
    };

    const getProvinces = async (contractorId: number) => {
        const provinceList = await getProvincesList();

        const classProvinces = await contractorService.getContractorClassLocation(contractorId, Number(id));
        const contractorProvinces = await contractorService.getContractorLocation(contractorId);

        if (contractorProvinces[0].nationalFlag || contractorProvinces[0].stateId === 'All') {
            const selectedProvinces: IProvince[] = provinceList.filter((province: IProvince) => {
                if (classProvinces.find((city: ICityResponse) => city.stateId === province.sigla)) {
                    return province;
                }
            });
            setProvinces(provinceList);
            setProvincesSelect(selectedProvinces);
        }
        else {
            const selectedContractorProvinces: IProvince[] = provinceList.filter((province: IProvince) => {
                if (contractorProvinces.find((city: ICityResponse) => city.stateId === province.sigla)) {
                    return province;
                }
            });

            const selectedProvinces: IProvince[] = selectedContractorProvinces.filter((province: IProvince) => {
                if (classProvinces.find((city: ICityResponse) => city.stateId === province.sigla)) {
                    return province;
                }
            });


            setProvinces(selectedContractorProvinces);
            setProvincesSelect(selectedProvinces);
        }


        setClassLocations(classProvinces);
        setContractorLocations(contractorProvinces);
    }

    const handleProvincesSelect = (event: SelectChangeEvent<string[]>) => {
        const selectedProvinceNames = event.target.value;
        const selectedProvinces = provinces.filter(province => selectedProvinceNames.includes(province.nome));
        setProvincesSelect(selectedProvinces);
    };

    const handleMaintainerChange = (event: SelectChangeEvent<string>) => {
        const selectedMaintainerId = parseInt(event.target.value);

        const selectedMaintainer = allMaintainers.find((maint) => maint.maintainerId === selectedMaintainerId);

        setMaintainer(selectedMaintainer);
    };

    const getClassData = async (state: number = 0) => {
        setLoading(true);
        try {
            const classData = await studentService.getClassById(Number(id));
            const contractorsData = await contractorService.getAllContractors();
            const classContractor = contractorsData.results.filter((item: any) => item.contractorId === classData.contractorId);
            const maintainerData = await maintainersContractorService.GetAllMaintainers(classData.contractorId, false);
            const courseData = await courseService.GetAll();

            setContractors(classContractor);
            setClassName(classData.name);
            setClassDescription(classData.description);
            setVacancies(classData.vacancies);
            setContractorId(classData.contractorId);
            setStartDate(isValid(parseISO(classData.startAt)) ? parseISO(classData.startAt) : new Date());
            setFinishedDate(isValid(parseISO(classData.endAt)) ? parseISO(classData.endAt) : new Date());
            setLoading(false);
            setHolidays(classData?.holidays.map((item: any) => zonedTimeToUtc(parseISO(item.holiday), 'America/Sao_Paulo')));
            setMaintainer(classData.maintainer);
            setAllMaintainers(maintainerData);
            setCourse(classData.course);
            setAllCourses(courseData);
            setClassSponsor(classData.certificateSponsor);
            setHandsOnTime(isValid(parseISO(classData.handsOnSchedule)) ? parseISO(classData.handsOnSchedule) : null);
            setEmissionDate(isValid(parseISO(classData.certificateIssueDate)) ? parseISO(classData.certificateIssueDate) : null);

            await getProvinces(classData.contractorId);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const handleClassName = (event: ChangeEvent<HTMLInputElement>) => {
        setClassName(event.target.value);
    };
    const handleVacancies = (event: ChangeEvent<HTMLInputElement>) => {
        setVacancies(Number(event.target.value));
    };
    const handleClassDescription = (event: ChangeEvent<HTMLInputElement>) => {
        setClassDescription(event.target.value);
    };
    const handleHolidaysChange = (newHolidays: Date[] | undefined) => {
        if (newHolidays) {
            setHolidays(newHolidays);
        }
    };

    const goBack = () => {
        navigate('/teams');
    }

    const calculateWorkingDays = (startDate: Date, endDate: Date, holidays: string[]): number => {
        let totalDays = 0;
        let currentDate = new Date(startDate);
        endDate.setHours(23, 59, 0, 0);

        while (currentDate <= endDate) {
            if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
                const isHoliday = holidays.some((holiday: any) => Moment(holiday).isSame(currentDate, 'day'));
                if (!isHoliday) {
                    totalDays++;
                }
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return totalDays;
    };

    const createTeamSchedule = async () => {
        setLoading(true);
        try {
            const transformHoliday = holidays.map(x => format(new Date(x.toString()), 'yyyy-MM-dd'));

            if (!handsOnTime) {
                setLoading(false);
                return showErrorToast(`Horário do hands on não definido`);
            }
            if (!emissionDate) {
                setLoading(false);
                return showErrorToast(`Data de emissão do certificado não definida`);
            }
            if (!classSponsor) {
                setLoading(false);
                return showErrorToast(`Patrocinador do certificado não definido`);
            }
            if (!course || !course.courseId) {
                setLoading(false);
                return showErrorToast('O curso não foi selecionado!');
            };

            const classData = {
                name: className,
                description: classDescription,
                courseId: course.courseId,
                startAt: formatISO(startDate),
                endAt: formatISO(finishedDate),
                handsOnSchedule: formatISO(handsOnTime),
                certificateIssueDate: formatISO(emissionDate),
                certificateSponsor: classSponsor,
                trailId: course!.courseId,
                status: 1,
                vacancies: vacancies,
            }

            const data = {
                contractorId: contractorId,
                trailId: course!.courseId,
                studentClassId: Number(id),
                startDate: formatISO(startDate),
                endDate: formatISO(finishedDate),
                holidays: holidays.map(x => format(x, 'yyyy-MM-dd'))
            };

            const calculatedWorkingDays = calculateWorkingDays(startDate, finishedDate, transformHoliday);
            if (calculatedWorkingDays !== course?.moduleCount!) {
                setLoading(false);
                return showErrorToast(`A quantidade de dias úteis: ${calculatedWorkingDays}, 
                  não corresponde a quantidade de aulas: ${course?.moduleCount}`);
            }

            const updateMaintainer: RefreshMaintainersClassDto = {
                maintainerId: maintainer ? maintainer.maintainerId : null,
                studentClassId: Number(id),
            }

            const locationData = {
                contractorId: contractorId,
                locations: classLocations
            };

            await studentService.createTeamSchedule(data);
            await contractorService.upsertClassLocation(locationData);
            await studentService.UpdateTeam(Number(id), classData);
            await maintainersClassService.UpdateClassLink(updateMaintainer);
            await studentClassService.UpdateLinkTrailToClass(Number(id), course?.courseId!);
            await uploadDocuments();

        } catch (error) {
            return showErrorToast('Erro ao atualizar turma');
        } finally {
            setLoading(false);
        }
    }

    const handleCourseChange = (event: SelectChangeEvent<string>) => {
        const courseId = parseInt(event.target.value);

        const selectedCourse = allCourses.find((course) => course.courseId === courseId);

        setCourse(selectedCourse);
    };

    const hanldeConsiderContractingScope = async (event: ChangeEvent<HTMLInputElement>) => {
        setConsiderContractingScope(event.target.checked);
        if (event.target.checked) {
            let currentLocations = await contractorService.getContractorLocation(contractorId);
            setClassLocations(currentLocations.map((city: any): ICityResponse => {
                return {
                    studentClassId: Number(id),
                    cityId: city.cityId,
                    stateId: city.stateId,
                    contractorId: Number(contractorId),
                    nationalFlag: city.nationalFlag
                }
            }
            ));
        }
        else {
            getProvinces(contractorId);
        }
    };

    const handleLocationsChange = (locations: ICityResponse[]) => {
        locations.forEach((location: ICityResponse) => {
            location.studentClassId = Number(id);
        });
        setClassLocations(locations);
    };

    return (
        <Box component="form"
            sx={{
                '& > :not(style)': { m: 1 },
                display: 'flex',
                flexDirection: 'column',
            }}>
            <PageHeader>
                <h1>Gerenciamento da Turma</h1>
            </PageHeader>
            {loading ? (<MLoading />) : (
                <Box>
                    <Box sx={{ margin: '1rem 0' }}>
                        <FormControl fullWidth>
                            <TextField
                                label="Nome da turma"
                                value={className}
                                variant="outlined"
                                onChange={handleClassName}
                                inputProps={{ maxLength: 50, autoComplete: 'off' }}
                            />
                        </FormControl>
                    </Box>
                    <Box sx={{ margin: '1rem 0' }}>
                        <FormControl fullWidth>
                            <TextField
                                label="Descrição da turma"
                                value={classDescription}
                                variant="outlined"
                                onChange={handleClassDescription}
                                inputProps={{ maxLength: 50, autoComplete: 'off' }}
                            />
                        </FormControl>
                    </Box>

                    <Box sx={{ margin: '1rem 0' }}>
                        <FormControl fullWidth>
                            <TextField
                                label="Vagas da turma"
                                value={vacancies}
                                variant="outlined"
                                onChange={handleVacancies}
                                inputProps={{ maxLength: 50, autoComplete: 'off' }}
                            />
                        </FormControl>
                    </Box>

                    <Box sx={{ margin: '1rem 0' }}>
                        <FormControl fullWidth>
                            <TextField
                                label="Contratante"
                                value={contractors[0]?.name}
                                disabled
                                variant="outlined"
                                inputProps={{ maxLength: 50, autoComplete: 'off' }}
                            />
                        </FormControl>
                    </Box>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={3}>
                            <FormControl fullWidth>
                                <InputLabel id="maintainer-label">Mantenedor</InputLabel>
                                <Select
                                    labelId="maintainer-label"
                                    id="maintainer-select"
                                    label="Mantenedor"
                                    value={maintainer ? maintainer.maintainerId.toString() : ''}
                                    onChange={handleMaintainerChange}
                                >
                                    {allMaintainers.map((maint) => (
                                        <MenuItem key={maint.maintainerId} value={maint.maintainerId.toString()}> {/* Converta o ID para string */}
                                            {maint.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={3}>
                            <FormControl fullWidth>
                                <InputLabel id="trail-label">Trilhas</InputLabel>
                                <Select
                                    labelId="trail-label"
                                    id="trail-select"
                                    label="Trilhas"
                                    value={course ? course.courseId.toString() : ''}
                                    onChange={handleCourseChange}
                                >
                                    {allCourses.map((course: Course) => (
                                        <MenuItem key={course.courseId} value={course.courseId}>
                                            {course.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <ClassesDialog
                            open={openClassesDialog}
                            onClose={handleCloseClassesDialog}
                            studentClassId={Number(id)}
                        />
                    </Grid>

                    <Box
                        sx={{
                            display: 'flex',
                            margin: '2vh 0 3vh 0',
                            gap: '1vw'
                        }}
                    >
                        <MultiDatePicker
                            label="Data de início da turma"
                            value={startDate}
                            onChange={setStartDate}
                        />
                        <Box
                            sx={{
                                width: '0.5px',
                                borderLeft: 'solid 1px #D3D3D3'
                            }}
                        />
                        <MultiDatePicker
                            label="Data de finalização da turma"
                            value={finishedDate}
                            onChange={setFinishedDate}
                        />
                        <Box
                            sx={{
                                width: '0.5px',
                                borderLeft: 'solid 1px #D3D3D3'
                            }}
                        />
                        <MultiDatePicker
                            multiple
                            label="Feriados (caso tenha)"
                            value={holidays}
                            onChange={handleHolidaysChange}
                        />
                        <Box
                            sx={{
                                width: '0.5px',
                                borderLeft: 'solid 1px #D3D3D3'
                            }}
                        />
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <MobileTimePicker
                                sx={{
                                    width: '100%'
                                }}
                                label="Horário do HandsOn"
                                value={handsOnTime}
                                onChange={(newValue) => {
                                    setHandsOnTime(newValue);
                                }}
                            />
                        </LocalizationProvider>

                    </Box>

                    <Box
                        sx={{
                            height: '0.5px',
                            borderBottom: 'solid 1px #D3D3D3',
                            marginBottom: '1rem'
                        }}
                    />
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '1rem',
                            marginBottom: '1rem'

                        }}
                    >
                        <Typography>Configurações do certificado</Typography>
                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-around'
                            }}
                        >
                            <TextField
                                sx={{
                                    width: '40%'
                                }}
                                label="Patrocinador da turma"
                                variant="outlined"
                                inputProps={{ maxLength: 50, autoComplete: 'off' }}
                                value={classSponsor}
                                onChange={(event) => setClassSponsor(event.target.value)}
                            />
                            <MultiDatePicker
                                label="Data de emissão"
                                sx={{
                                    width: '40%'
                                }}
                                value={emissionDate}
                                onChange={setEmissionDate}
                            />

                        </Box>

                    </Box>
                    <Box
                        sx={{
                            height: '0.5px',
                            borderBottom: 'solid 1px #D3D3D3',
                            marginBottom: '1rem'
                        }}
                    />

                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '1rem',
                            marginBottom: '1rem'

                        }}
                    >
                        <Typography>Documentos</Typography>
                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                flexWrap: 'wrap'
                            }}
                        >
                            {[...classFiles.filter((el) => el.type !== 'remove'), {name: undefined, file: undefined}].map((file, index) => (
                                <UploadButton
                                    key={`${file.file?.name || 'default'}-${classFiles.length}`} 
                                    sx={{
                                        width: {
                                            xs: '100%',
                                            sm: '100%',
                                            md: '50%',
                                            lg: '30%'
                                        },
                                        marginBottom: '2%'
                                    }}
                                    showDelete={index !== classFiles.filter((el) => el.type !== 'remove').length}
                                    onDelete={(name, file) => {
                                        if (classFiles[index].type === 'new')
                                            return setClassFiles((current) => current.filter((f) => f.name !== name));
                                        setClassFiles((current) =>
                                            [
                                                ...current
                                                .filter((el) => el.type !== 'remove')
                                                .map((f, i) => {
                                                    if (i === index) return { ...f, type: 'remove'};
                                                    return f;
                                                }),
                                                ...current.filter((el) => el.type === 'remove')
                                            ]

                                        );
                                    }}
                                    defaultLabel={file.name}
                                    defaultFile={file.file}
                                    onFileChange={(newName, newFile) => {
                                        if(newFile === null) return;
                                        if (newName === file.name && newFile === file.file) return;
                                        if (file.name === undefined && file.file === undefined) return setClassFiles((current) => [...current, {name: newName, file: newFile, type: 'new'}]);

                                        setClassFiles((current) => current.map((f, i) => {
                                            if (i === index && newFile !== null) {
                                                return { ...f, newName: newName, newFile: newFile, type: 'update'};
                                            }
                                            return f;
                                        }))
                                    }}
                                />
                            ))}
                            
                        </Box>


                    </Box>
                    <Box
                        sx={{
                            height: '0.5px',
                            borderBottom: 'solid 1px #D3D3D3',
                            marginBottom: '1rem'
                        }}
                    />

                    <FormGroup>
                        <FormControlLabel label="Cobrir de acordo com o contratante?"
                            labelPlacement="top"
                            control={<Switch
                                checked={considerContractingScope}
                                onChange={hanldeConsiderContractingScope}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />} />
                    </FormGroup>

                    {!considerContractingScope ? (
                        <>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="contractor-province-label">Estados</InputLabel>
                                    <Select
                                        labelId="contractor-province-select-label"
                                        multiple
                                        value={provincesSelect.map(province => province.nome)}
                                        label="Contratante"
                                        onChange={handleProvincesSelect}
                                        disabled={considerContractingScope}
                                        input={<OutlinedInput label="Estado" />}
                                    >
                                        {provinces.map((item: any) => (
                                            <MenuItem key={item.id} value={item.nome}>
                                                {item.nome}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Grid container spacing={2}>
                                    {provincesSelect.map((province: IProvince) => (
                                        <Grid item xs={12} sm={6}>
                                            <TLocationSelector
                                                contractor={Number(contractorId)}
                                                province={province}
                                                existingLocations={classLocations.filter(location => location.stateId === province.sigla)}
                                                onCitiesResponse={handleLocationsChange}
                                                locations={classLocations}
                                                contractorLocations={contractorLocations.filter(location => location.stateId === province.sigla)}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        </>
                    ) : true}
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                        <Button
                            variant="contained"
                            sx={{ minWidth: 2, marginTop: '2rem' }}
                            onClick={goBack}>
                            Voltar
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ minWidth: 2, margin: '2rem 1rem 0 1rem' }}
                            onClick={createTeamSchedule}>
                            Salvar
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            sx={{ marginRight: "10px", marginTop: '2rem' }}
                            onClick={() => {
                                handleOpenClassesDialog();
                            }}>
                            Excluir turma
                        </Button>
                    </Box>
                </Box>)
            }
        </Box>
    )
}

export default TTeamManagement