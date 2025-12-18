import {
    Autocomplete,
    Box,
    Typography,
    TextField,
    Button,
    Switch,
    Tooltip
} from "@mui/material";
import {
    IStudentClassCertificate,
    ICreateStudentClassScheduler,
    IUpdateStudentClassScheduler,
    IAgentClassCertificate,
    ICreateOrUpdateStudentClassCoverage,
    IManagementClass,
    ILocationState,
    IAgentClass,
    StudentClassCoverage,
    IUpdateAgentClass,
    ICreateAgentClass,
    AgentCoverageDto,
    AgentTypes
} from "../../../interfaces/teams/class.interfaces";
import { useEffect, useState, useReducer } from 'react';
import ManagementClassesService from "../../../services/Teams/classes/managementClasses.service";
import MLoading from "../../molecules/MLoading";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MultiDatePicker from "../../templates/TTeams/components/MultiDatePicker"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import { showErrorToast, showSuccessToast } from "../../../utils/toast";
import { useAuth } from "../../../context/AuthProvider/useAuth";
import { formatISO, parseISO } from "date-fns";
import useBackListener from "../../../hooks/useBackListener";
import courseService from "../../../services/api/classes/course.service";
import { Course } from "../../../interfaces/courses/responses/Course";
import { LocalizationProvider, MobileTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import agentClassesService from "../../../services/Teams/classes/agentClasses.service";
import genericService from "../../../services/Teams/classes/generic.service";
import axios from "axios";
import certificateService from "../../../services/Teams/certificate.service";
import classSchedulerService from "../../../services/Teams/classes/classScheduler.service";
import UploadButton from "../../templates/TTeams/components/UploadButton";
import ClassDocumentsService from "../../../services/api/classes/documents.service";

interface IAutoComplete<T> {
    value: T;
    label: string;
};

interface IStudentClassDataFields {
    Name: string | null;
    CourseId: number | null;
    Description: string | null;
    HandsOnTime: Date | null;
    MaintainerId: number | null;
    CertificateSponsor: string | null;
    CertificateIssue: Date | null;
    NationalFlag: boolean;
    StudentQuantity: number;
    StateCoverageList: string[];
    studentClassReferenceId: number;
    handsOnSchedulerId: number | null;
    ClassCertificate: IStudentClassCertificate | null;
};

const initialState: IStudentClassDataFields = {
    Name: null,
    CourseId: null,
    Description: null,
    HandsOnTime: null,
    MaintainerId: null,
    CertificateSponsor: null,
    CertificateIssue: null,
    NationalFlag: false,
    StudentQuantity: 0,
    StateCoverageList: [],
    studentClassReferenceId: 0,
    handsOnSchedulerId: null,
    ClassCertificate: null
};

type Action = { type: 'SET_FIELD'; field: keyof IStudentClassDataFields; value: any };

function reducer(state: IStudentClassDataFields, action: Action): IStudentClassDataFields {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value };
        default:
            throw new Error('Unknown action type');
    };
};

const CreateAndEditStudentClass = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { studentClassManagementId, studentClassId } = useParams();
    const { user } = useAuth();
    const path = location.pathname;
    const pageType = path.substring(path.lastIndexOf('/') + 1);
    const state = location.state as ILocationState;
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [courseTrails, setCourseTrails] = useState<IAutoComplete<number>[]>([]);
    const [maintainers, setMaintainers] = useState<IAutoComplete<number>[]>([]);
    const [contractorStates, setContractorStates] = useState<IAutoComplete<string>[]>([]);

    const [managementClass, setManagementClass] = useState<IManagementClass | undefined>(undefined);
    const [dataFields, setDataFields] = useReducer(reducer, initialState);

    const [classFiles, setClassFiles] = useState<{name: string, file: File, type: string | null, newName?: string, newFile?: File }[]>([]);
    const [studentClassReferenceId, setStudentClassReferenceId] = useState<number>();

    const getClassDocuments = async (studentClassReferenceId: number) => {
        const classDocuments = await ClassDocumentsService.GetDocumentsByStudentClassId(studentClassReferenceId);
        if (classDocuments === null) return;
        setClassFiles(classDocuments.documents.map(doc => ({
            type: null,
            name: doc.documentName,
            file: new File(
                [classDocuments.blobUrl + doc.documentFileName],
                doc.documentFileName, { type: 'application/pdf' }
            )
        })));
    };

    const navigateBack = () => {
        if (!state?.agentLocation?.agentClasses) return navigate(`/managementClass/${studentClassManagementId}`, { replace: true });
        navigate(state.navigateBack ?? `/managementClass/${studentClassManagementId}`, { replace: true, state });
    };

    useBackListener(() => navigateBack());

    const setField = (field: keyof IStudentClassDataFields, value: any) => {
        setDataFields({ type: 'SET_FIELD', field, value });
    };

    const getStates = async (): Promise<IAutoComplete<string>[]> => {
        const res = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/`)
        return res.data.sort((a: any, b: any) => a.nome.localeCompare(b.nome))
        .map((el: any) => {return {value: el.sigla, label: el.nome}});
    };

    const fetchDropdown = async () => {
        setIsLoading(true);
        const _courseTrails: Course[] = await courseService.GetAll();
        setCourseTrails(_courseTrails.map((courseTrail: Course) => {
            return {
                value: courseTrail.courseId,
                label: 
                    `${courseTrail.name}${courseTrail.description ? ' (' + courseTrail.description + ')' : ''} - ${courseTrail.moduleCount} aulas`
            }
        }));
        const _maintainers = await genericService.GetAgents();
        if (_maintainers) setMaintainers(_maintainers.data
            .filter(el => el.agentType )
            .map(el => { return { value: el.id, label: el.name } }));
        else showErrorToast("Erro ao recuperar mantenedores");
        const _states = await getStates();
        setContractorStates(_states);
        setIsLoading(false);
    };

    const setAndVerifyField = <K extends keyof IStudentClassDataFields>(fieldName: K, fieldValue: IStudentClassDataFields[K]) => {
        if (fieldValue == null) return;
        setField(fieldName, fieldValue);
    };

    const setAllDataFields = async () => {
        const { agentClasses } = state.agentLocation || {};
        const agentClass = !agentClasses || !agentClasses.length ?
            await agentClassesService.GetAgentClassById(Number(studentClassId)) :
            agentClasses.find((studentClass: IAgentClass) => studentClass.id === Number(studentClassId));
        if (!agentClass) return showErrorToast("Um erro ocorreu ao recuperar os dados da turma filha!");

        setStudentClassReferenceId(agentClass.studentClassReferenceId);
        await getClassDocuments(agentClass.studentClassReferenceId);

        const _handsOnScheduler = agentClass.studentClassSchedulers?.find(el => el.activityType?.id === 3);

        if (_handsOnScheduler) {
            setAndVerifyField('handsOnSchedulerId', _handsOnScheduler.id);
            setAndVerifyField('HandsOnTime', _handsOnScheduler?.scheduledAt ? parseISO(_handsOnScheduler.scheduledAt) : null);
        };

        setAndVerifyField('Name', agentClass.name);
        setAndVerifyField('CourseId', agentClass.courseId);
        setAndVerifyField('Description', agentClass.description);
        setAndVerifyField('MaintainerId', agentClass.maintainer.id);
        setAndVerifyField('CertificateSponsor', agentClass.studentClassCertificate?.sponsor);
        setAndVerifyField('CertificateIssue', parseISO(agentClass.studentClassCertificate?.issueAt));
        setAndVerifyField('ClassCertificate', agentClass.studentClassCertificate);
        setAndVerifyField('NationalFlag', agentClass.nationalFlag);
        setAndVerifyField('studentClassReferenceId', agentClass.studentClassReferenceId);
        setAndVerifyField('StudentQuantity', agentClass.studentQuantity);
        setAndVerifyField('StateCoverageList', agentClass.studentClassCoverages.map(
            (studentClassCoverage: StudentClassCoverage) => studentClassCoverage.state
        ));

        let _managementClass = state?.managementLocation?.managementClasses.find(el => el.id === Number(studentClassManagementId)) ?? null;
        if (!_managementClass) {
            _managementClass = await ManagementClassesService.GetManagementClassById(Number(studentClassManagementId));
            if(!_managementClass) return showErrorToast("Erro ao recuperar os Estados do contratante!");
        }
        if(!_managementClass.contractor.nationalFlag) setContractorStates(
            _managementClass.contractor.agentCoverages.map((agentCoverages: AgentCoverageDto) => contractorStates.find(el => el.value == agentCoverages.state) ?? {label: agentCoverages.state, value: agentCoverages.state})
        );
        setManagementClass(_managementClass);
    };

    useEffect(() => {
        fetchDropdown();
        if (pageType == 'edit') setAllDataFields();
    }, []);

    const validateFields = (): boolean => {
        if (!dataFields.Name) {
            showErrorToast("O nome da turma é obrigatório!");
            return false;
        };
        if (dataFields.CourseId == null) {
            showErrorToast("A trilha da turma é obrigatória!");
            return false;
        };
        if (!dataFields.Description) {
            showErrorToast("A descrição da turma é obrigatória!");
            return false;
        };
        if (!Number(dataFields.StudentQuantity)) {
            showErrorToast("A quantidade de estudantes é obrigatória!");
            return false;
        };
        if (!dataFields.HandsOnTime) {
            showErrorToast("O horário do Hands-On é obrigatório!");
            return false;
        };
        if (!dataFields.CertificateSponsor) {
            showErrorToast("O patrocinador do certificado é obrigatório!");
            return false;
        };
        if (!dataFields.CertificateIssue) {
            showErrorToast("A data de emissão do certificado é obrigatória!");
            return false;
        };
        if (dataFields.NationalFlag === false && dataFields.StateCoverageList.length === 0) {
            showErrorToast("Pelo menos um dos estados de cobertura deve ser selecionado!");
            return false;
        };
        return true;
    };

    const updateAgentClassCoverage = async (studentClassId: number) => {
        const _agentClassCoverage: ICreateOrUpdateStudentClassCoverage = {
            studentClassId: studentClassId,
            nationalFlag: dataFields.NationalFlag,
            coverages: dataFields.StateCoverageList.map(state => { return {state, city: 'All'} })
        };
        const coverageResult = await agentClassesService.DeleteOrUpdateAgentClassCoverage(_agentClassCoverage);
        if (!coverageResult) return showErrorToast("Erro ao salvar cobertura do agente");
    };

    const updateClassCertificate = async (studentClassId: number) => {
        if (!dataFields.ClassCertificate) {
            const _certificateData: IAgentClassCertificate = {
                studentClassId: studentClassId,
                sponsor: dataFields.CertificateSponsor!,
                issueAt: formatISO(dataFields.CertificateIssue!)
            };
            const certificateResult = certificateService.CreateCertificate(_certificateData);
            if (!certificateResult) showErrorToast("Erro ao salvar dados do certificado");
            return;
        };
        const _certificateData: IAgentClassCertificate = {
            studentClassId: studentClassId,
            sponsor: dataFields.CertificateSponsor!,
            issueAt: formatISO(dataFields.CertificateIssue!)
        };
        const certificateResult = await certificateService.UpdateCertificate(_certificateData);
        if (!certificateResult) showErrorToast("Erro ao salvar dados do certificado");
    };

    const updateHandsOnScheduler = async (studentClassId: number) => {
        if (dataFields.handsOnSchedulerId) {
            const _handsOnData: IUpdateStudentClassScheduler = {
                id: dataFields.handsOnSchedulerId,
                scheduledAt: formatISO(dataFields.HandsOnTime!)
            };
            const handsOnResult = classSchedulerService.UpdateSchedule(_handsOnData);
            if (!handsOnResult) showErrorToast("Erro ao salvar o horário do Hands-On da turma!");
            return;
        };
        const _handsOnData: ICreateStudentClassScheduler = {
            studentClassId: studentClassId,
            activityTypeId: 3, // hands on type id
            classRoomId: dataFields.studentClassReferenceId,
            scheduledAt: formatISO(dataFields.HandsOnTime!)
        };
        const handsOnResult = await classSchedulerService.CreateSchedule(_handsOnData);
        if (!handsOnResult) handleFetchError("Erro ao salvar o horário do Hands-On da turma!");
    };
    
    const createAgentClass = async () => {
        setIsLoading(true);
        if (!validateFields()) return setIsLoading(false);
        const _data: ICreateAgentClass = {
            studentClassManagementId: Number(studentClassManagementId),
            maintainerId: dataFields.MaintainerId ?? undefined,
            courseId: dataFields.CourseId!,
            name: dataFields.Name!,
            description: dataFields.Description!,
            nationalFlag: dataFields.NationalFlag,
            studentQuantity: dataFields.StudentQuantity,
            createdBy: user?.profileId ?? 0
        };
        const agentClassesDto = await agentClassesService.CreateAgentClasses(_data);
        
        if (!agentClassesDto) return handleFetchError(`Um erro ocorreu ao criar a turma filha "${dataFields.Name}"!`);
        
        await updateHandsOnScheduler(agentClassesDto.id);
        await updateClassCertificate(agentClassesDto.id);
        await updateAgentClassCoverage(agentClassesDto.id);
        await uploadDocuments(agentClassesDto.studentClassReferenceId);

        const _updatedAgentClass = await agentClassesService.GetAgentClassById(agentClassesDto.id);
        if (!_updatedAgentClass) return handleFetchError("Erro ao recuperar os novos dados dos campos da turma filha!");
        if (state?.agentLocation?.agentClasses) state.agentLocation.agentClasses.push(_updatedAgentClass);

        setIsLoading(false);
        showSuccessToast(`Turma filha "${dataFields.Name}" criada com sucesso!`);
        navigateBack();
    };

    const updateClass = async (isDeleted: boolean): Promise<IAgentClass | null> => {
        const _data: IUpdateAgentClass = {
            id: Number(studentClassId),
            maintainerId: dataFields.MaintainerId ?? undefined,
            courseId: dataFields.CourseId!,
            name: dataFields.Name!,
            description: dataFields.Description!,
            updatedBy: user?.profileId ?? 0,
            isDeleted: isDeleted,
            updatedCourse: false
        };
        return await agentClassesService.UpdateAgentClasses(_data);
    };

    const handleFetchError = (errorMessage: string): void => {
        setIsLoading(false);
        showErrorToast(errorMessage);
    };

    const updateAgentClass = async () => {
        setIsLoading(true);
        if (!validateFields()) return setIsLoading(false);

        await updateHandsOnScheduler(Number(studentClassId));
        await updateClassCertificate(Number(studentClassId));
        await updateAgentClassCoverage(Number(studentClassId));
        await uploadDocuments(null);

        const updateClassResult = await updateClass(false);
        if (!updateClassResult) return handleFetchError("Erro ao salvar os dados da turma filha!");

        if (state?.agentLocation?.agentClasses) state.agentLocation.agentClasses = state.agentLocation.agentClasses.map(el => {
            if(el.id === updateClassResult.id) return updateClassResult;
            return el;
        });

        setIsLoading(false);
        showSuccessToast(`Turma filha "${dataFields.Name}" atualizada com sucesso!`);
        navigateBack();
    };

    const deleteAgentClass = async () => {
        setIsLoading(true);
        if (!validateFields()) return setIsLoading(false);
        const updateResult = await updateClass(true);
        if(!updateResult) {
            showErrorToast("Erro ao atualizar dados");
            return setIsLoading(false);
        };
        const result = agentClassesService.DeleteAgentClasses(Number(studentClassId));
        if (!result) return showErrorToast("Erro ao salvar dados");
        if (state?.agentLocation?.agentClasses) state.agentLocation.agentClasses = state.agentLocation.agentClasses.filter(el => {
            el.id !== Number(studentClassId)
        });
        setIsLoading(false);
        navigateBack();
    };

    const uploadDocuments = async (newStudentClassReferenceId: number | null) => {
        setIsLoading(true);
        const promises = classFiles.map(async (file, fileIndex) => {
            switch (file.type) {
                case 'remove': {
                    const removeResponse = await ClassDocumentsService.RemoveClassDocument({
                        studentClassId: newStudentClassReferenceId ?? studentClassReferenceId!,
                        documentFileName: file.file.name.split('/').pop(),
                        documentName: file.name
                    });
                    if (!removeResponse) showErrorToast("Um erro ocorreu ao remover o documento da turma filha, recarregue a página e tente novamente!");
                    setClassFiles(_classFiles => 
                        _classFiles.filter((el, elIndex) => elIndex !== fileIndex)
                    );
                    break;
                }
                case 'new': {
                    const insertResponse = await ClassDocumentsService.InsertClassDocument({
                        studentClassId: newStudentClassReferenceId ?? studentClassReferenceId!,
                        documentFile: file.file,
                        documentName: file.name
                    });
                    if (!insertResponse) showErrorToast("Um erro ocorreu ao adicionar o documento da turma filha, recarregue a página e tente novamente!");
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
                        studentClassId: newStudentClassReferenceId ?? studentClassReferenceId!,
                        oldDocumentFileName: file.file.name,
                        documentFile: file.newFile,
                        documentName: file.newName!
                    });
                    if (!updateResponse) showErrorToast("Um erro ocorreu ao atualizar o documento da turma filha, recarregue a página e tente novamente!");
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
            showErrorToast('Erro ao atualizar documentos da turma filha!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isLoading ? <MLoading /> : null}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                    paddingRight: '150px'
                }}
            >
                <Typography
                    variant="h1"
                    fontFamily={'Inter'}
                    fontWeight={600}
                    fontSize={28}
                >
                    {pageType == 'edit' ? 'Edição' : 'Criação'} turma filha
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        flexWrap: 'wrap',
                        gap: '2%',
                    }}
                >
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Nome da turma"
                        sx={{
                            width: '49%',
                            marginTop: '20px'
                        }}
                        value={dataFields.Name ? dataFields.Name : ''}
                        onChange={(event) => setField('Name', event.target.value)}
                    />
                    <Autocomplete
                        options={courseTrails}
                        sx={{
                            width: '49%',
                            marginTop: '20px'
                        }}
                        renderInput={(params) => <TextField {...params} label="Trilha" />}
                        value={courseTrails.find(el => el.value === dataFields.CourseId) ?? null}
                        onChange={(_, value) => setField('CourseId', value?.value)}
                    />
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Descrição da turma"
                        sx={{
                            width: '49%',
                            marginTop: '20px'
                        }}
                        value={dataFields.Description ? dataFields.Description : ''}
                        onChange={(event) => setField('Description', event.target.value)}
                    />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <MobileTimePicker
                            sx={{ width: '49%', marginTop: '20px' }}
                            label="Horário do Hands-On"
                            value={dataFields.HandsOnTime}
                            onChange={(value) => setField('HandsOnTime', value)}
                        />
                    </LocalizationProvider>
                    <Autocomplete
                        options={maintainers}
                        sx={{ width: '49%', marginTop: '20px' }}
                        renderInput={(params) => <TextField {...params} label="Mantenedor" />}
                        isOptionEqualToValue={(option, value) => option.value === value.value}
                        value={maintainers.find(el => el.value === dataFields.MaintainerId) ?? null}
                        onChange={(_, value) => setField('MaintainerId', value?.value)}
                    />
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Quantidade de alunos"
                        sx={{ width: '49%', marginTop: '20px' }}
                        value={dataFields.StudentQuantity ? dataFields.StudentQuantity : ''}
                        onChange={(event) => setField('StudentQuantity', event.target.value.replace(/\D/g, ''))}
                    />
                </Box>

                <Box
                    sx={{
                        borderTop: '1px solid #D3D3D3',
                        marginTop: '10px',
                        paddingTop: '10px',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px'
                    }}
                >
                    <Typography
                        fontFamily={'Inter'}
                        fontWeight={'700'}
                        textAlign={'center'}
                    >
                        Configurações do certificado
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '15px'
                        }}
                    >
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Patrocinador da Turma"
                            sx={{ width: '49%' }}
                            value={dataFields.CertificateSponsor ? dataFields.CertificateSponsor : ''}
                            onChange={(event) => setField('CertificateSponsor', event.target.value)}
                        />
                        <MultiDatePicker
                            label="Data emissão"
                            sx={{ width: '49%' }}
                            value={dataFields.CertificateIssue}
                            onChange={(value) => setField('CertificateIssue', value)}
                        />
                    </Box>
                </Box>

                <Box
                    sx={{
                        borderTop: '1px solid #D3D3D3',
                        marginTop: '10px',
                        paddingTop: '10px',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px'
                    }}
                >
                    <Typography
                        fontFamily={'Inter'}
                        fontWeight={'700'}
                        textAlign={'center'}
                    >
                        Documentos
                    </Typography>
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            flexWrap: 'wrap'
                        }}
                    >
                        {
                            [...classFiles.filter(el => el.type !== 'remove'), {name: undefined, file: undefined}].map((file, index) => (
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
                                    showDelete={index !== classFiles.filter(el => el.type !== 'remove').length}
                                    onDelete={(name, file) => {
                                        if (classFiles[index].type === 'new')
                                            return setClassFiles((current) => current.filter(f => f.name !== name));
                                        setClassFiles((current) =>
                                            [
                                                ...current
                                                .filter(el => el.type !== 'remove')
                                                .map((f, i) => {
                                                    if (i === index) return { ...f, type: 'remove'};
                                                    return f;
                                                }),
                                                ...current.filter(el => el.type === 'remove')
                                            ]

                                        );
                                    }}
                                    defaultLabel={file.name}
                                    defaultFile={file.file}
                                    onFileChange={(newName, newFile) => {
                                        if(newFile === null) return;
                                        if (newName === file.name && newFile === file.file) return;
                                        if (file.name === undefined && file.file === undefined) return setClassFiles(current => [...current, {name: newName, file: newFile, type: 'new'}]);

                                        setClassFiles(current => current.map((f, i) => {
                                            if (i === index && newFile !== null) {
                                                return { ...f, newName: newName, newFile: newFile, type: 'update'};
                                            }
                                            return f;
                                        }))
                                    }}
                                />
                            ))
                        }
                    </Box>
                </Box>

                <Box
                    sx={{
                        borderTop: '1px solid #D3D3D3',
                        marginTop: '10px',
                        paddingTop: '10px',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '20px'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <Typography
                            fontFamily={'Inter'}
                            fontWeight={'700'}
                            textAlign={'center'}
                        >
                            Cobertura
                        </Typography>
                        <Typography
                            fontFamily={'Inter'}
                            fontWeight={'400'}
                            textAlign={'center'}
                        >
                            Cobrir o país inteiro?
                        </Typography>
                        <Switch
                            checked={dataFields.NationalFlag}
                            onChange={(value) => setField('NationalFlag', value.target.checked)}
                        />
                    </Box>
                    <Tooltip
                        title={dataFields.NationalFlag ? 'Não é possível selecionar Estados quando a turma abrange todo o país!' : '' }
                    >
                        <Autocomplete
                            multiple
                            disabled={dataFields.NationalFlag}
                            options={contractorStates}
                            onChange={(_: unknown, values: IAutoComplete<string>[]) => setField('StateCoverageList', values.map(el => el.value))}
                            value={dataFields.StateCoverageList.map((state: string) => contractorStates.find(el => el.value == state) ?? {label: state, value: state})}
                            isOptionEqualToValue={(option, value) => option.value == value.value}
                            renderInput={(params) => (
                                <TextField {...params} label="Estados" placeholder="Selecione os estados que a turma vai cobrir" />
                            )}
                            sx={{ width: '60%' }}
                        />
                    </Tooltip>
                </Box>

                <Box
                    sx={{
                        marginTop: '15px',
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
                        onClick={() => pageType == 'edit' ? updateAgentClass() : createAgentClass()}
                    >
                        Salvar
                    </Button>
                    {
                        pageType == 'edit' &&
                        <Button
                            variant="contained"
                            startIcon={<DeleteIcon />}
                            disabled={
                                !!managementClass?.startAt &&
                                !!managementClass?.endAt &&
                                new Date() > parseISO(managementClass?.startAt) &&
                                new Date() < parseISO(managementClass?.endAt)
                            }
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
                            onClick={() => deleteAgentClass()}
                        >
                            Excluir turma filha
                        </Button>
                    }
                </Box>
            </Box>
        </>
    );
};

export default CreateAndEditStudentClass;