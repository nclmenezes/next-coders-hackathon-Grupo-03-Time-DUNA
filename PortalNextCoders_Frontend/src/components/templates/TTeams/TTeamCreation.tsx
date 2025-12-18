import { useNavigate } from "react-router";
import { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  DialogActions,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import studentService, { StudentClassCreateRequest } from "../../../services/student/student.service";
import { showErrorToast, showSuccessToast } from "../../../utils/toast";
import MLoading from "../../molecules/MLoading";
import contractorService from "../../../services/Teams/contractor.service";
import Moment from 'moment';
import axios from "axios";
import { ICityResponse, IProvince } from "../../../interfaces/student/student.interfaces";
import { Course } from "../../../interfaces/courses/responses/Course";
import courseService from "../../../services/api/classes/course.service";
import { format, formatISO } from "date-fns";
import TLocationSelector from "./TLocationSelector";
import { LocalizationProvider, MobileTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MultiDatePicker from "./components/MultiDatePicker";

export default function TTeamCreation() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [contractor, setContractor] = useState("");
  const [className, setClassName] = useState("");
  const [classDescription, setClassDescription] = useState("");
  const [vacancies, setVacancies] = useState(0);
  const [contractors, setContractors] = useState<any[]>([]);
  const [contractorId, setContractorId] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState<Course>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [holidays, setHolidays] = useState<Date[]>([]);
  const [startDate, setStartDate] = useState<Date>();
  const [finishedDate, setFinishedDate] = useState<Date>();
  const [handsOnTime, setHandsOnTime] = useState<Date | null>(new Date());
  const [classSponsor, setClassSponsor] = useState<string | null>('');
  const [emissionDate, setEmissionDate] = useState<Date | null>(new Date());

  const [considerContractingScope, setConsiderContractingScope] = useState(false);
  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [provincesSelect, setProvincesSelect] = useState<IProvince[]>([]);
  const [contractorLocations, setContractorLocations] = useState<ICityResponse[]>([]);
  const [classLocations, setClassLocations] = useState<ICityResponse[]>([]);  

  const getAtributes = async () => {
    setLoading(true);
    try{
        const contractorsData = await contractorService.getAllContractors();
        setContractors(contractorsData.results);
        const courseData = await courseService.GetAll();
        setCourses(courseData);
    }catch(error){
      console.error('Error:', error);
    }finally{
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

  const handleFilterContractor = (event: SelectChangeEvent) => {
    const selectedValue = event.target.value as string;
    const selectedItem = contractors.find((item) => item.name === selectedValue);

    if (selectedItem) {
      setContractor(selectedValue);
      setContractorId(selectedItem.contractorId)
    }
  };

  const getProvincesList = async (): Promise<any> => {
    const { data } = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/`);
    return data;
  };  

  const getProvinces = async (contractorId: number) => {
    const provinceList = await getProvincesList();

    const contractorProvinces = await contractorService.getContractorLocation(contractorId);

    if(contractorProvinces[0].nationalFlag || contractorProvinces[0].stateId === 'All'){
      setProvinces(provinceList);
    }
    else{
        const selectedContractorProvinces: IProvince[] = provinceList.filter((province: IProvince) => {
            if (contractorProvinces.find((city: ICityResponse) => city.stateId === province.sigla)) {
            return province;
            }
        });           
        setProvinces(selectedContractorProvinces);
    }


    setContractorLocations(contractorProvinces); 
}  

  useEffect(() => {
    const data = async () => {
      await getAtributes();
    };

    data();
  }, []);

  useEffect(() => {
    const data = async () => {
      await getProvinces(contractorId);
    };

    data();
  }, [contractor]);

  const createTeam = async () => {
    setLoading(true);
    try{
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
      if (!startDate) {
        setLoading(false);
        return showErrorToast(`Sem data de início`);
      }
      if (!finishedDate) {
        setLoading(false);
        return showErrorToast(`Sem data de finalização`);
      }
      let transformHoliday:string[] = [];
      if(holidays.length > 0)
        transformHoliday = holidays.map(x => format(x, 'yyyy-MM-dd'));
      const payload: StudentClassCreateRequest = {
        name: className,
        description: classDescription,
        contractorId: contractorId,
        contractorCoverageId: 1,
        status: 1,
        vacancies: vacancies,
        trailId: selectedCourse!.courseId,
        startAt: formatISO(startDate),
        endAt: formatISO(finishedDate),
        handsOnSchedule: formatISO(handsOnTime),
        certificateIssueDate: formatISO(emissionDate),
        certificateSponsor: classSponsor,
        courseId: selectedCourse?.courseId!,
        holidays: transformHoliday
      };
      const calculatedWorkingDays = calculateWorkingDays(startDate, finishedDate, transformHoliday);
  
      if (calculatedWorkingDays !== selectedCourse?.moduleCount!) {
        setLoading(false);
        return showErrorToast(`A quantidade de dias úteis: ${calculatedWorkingDays}, 
            não corresponde a quantidade de aulas: ${selectedCourse?.moduleCount}`);
      }
  
      const { status, data } = await studentService.CreateTeam(payload);

      classLocations.forEach((location) => {  
        location.studentClassId = data.studentClassId;
      })
      const locationData = {
        contractorId: contractorId,
        locations: classLocations
      };
  
      const statusLocation = await contractorService.upsertClassLocation(locationData);
  
      if (status === 200 && statusLocation === 200) {
        setLoading(false);
        navigate('/teams');
        return showSuccessToast('Turma criada com sucesso');
      }
    }
    catch(error: any){
      console.error('Error:', error);
      return showErrorToast(`Erro ao criar turma: ${error.response.data.message}`);      
    }
    finally{
        setLoading(false);
    }
  };

  function getCourseName(courseId: number) {
    const course = courses.find((t) => t.courseId === courseId);
    return course ? course.name : '';
  }
  
  function handleCourseChange(event: any) {
    const { target } = event;
    const courseId = target.value;
    const select = courses.find((t) => t.courseId === courseId);
    setSelectedCourse(select);
  }

  const handleHolidaysChange = (newHolidays: Date[] | undefined) => {
    if (newHolidays) {
        setHolidays(newHolidays);
    }
  };

  const calculateWorkingDays = (startDate: Date, endDate: Date, holidays: string[]): number => {
    let totalDays = 0;
    let currentDate = new Date(startDate);
  
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
  

  const goBack = () => {
    navigate('/teams');
  };

  const hanldeConsiderContractingScope = async (event: ChangeEvent<HTMLInputElement>) => {
    setConsiderContractingScope(event.target.checked);
    if(event.target.checked === true){
     let currentLocations = await contractorService.getContractorLocation(contractorId);
     setClassLocations(currentLocations.map((city: any): ICityResponse => {
                return {
                    cityId: city.cityId,
                    stateId: city.stateId,
                    contractorId: Number(contractorId),
                    nationalFlag: city.nationalFlag
                }
            }
        ));
    }
    else{
        getProvinces(contractorId);
    }
  };  

  const handleLocationsChange = (locations: ICityResponse[]) => {
    setClassLocations(locations);
  }

  const handleProvincesSelect = (event: SelectChangeEvent<string[]>) => {
    const selectedProvinceNames = event.target.value;
    const selectedProvinces = provinces.filter(province => selectedProvinceNames.includes(province.nome));
    setProvincesSelect(selectedProvinces);
  };      

  return (
    <Box>
        <h1 style={{marginBottom: '2rem'}}>Criação de turma</h1>
      {loading ? <MLoading /> : (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <FormControl fullWidth>
                    <InputLabel id="class-name-label" />
                    <TextField
                        label="Nome da turma"
                        value={className}
                        variant="outlined"
                        onChange={handleClassName}
                        sx={{ marginBottom: '1rem' }}
                        inputProps={{ maxLength: 50, autoComplete: "off" }}
                    />
                    </FormControl>
                    <FormControl fullWidth>
                    <InputLabel id="class-name-label" />
                    <TextField
                        label="Descrição da turma"
                        value={classDescription}
                        variant="outlined"
                        onChange={handleClassDescription}
                        sx={{ marginBottom: '1rem' }}
                        inputProps={{ maxLength: 50, autoComplete: "off" }}
                    />
                    </FormControl>
                    <FormControl fullWidth>
                    <InputLabel id="class-name-label" />
                    <TextField
                        label="Vagas da turma"
                        value={vacancies}
                        variant="outlined"
                        onChange={handleVacancies}
                        sx={{ marginBottom: '1rem' }}                        
                        inputProps={{ maxLength: 50, autoComplete: "off" }}
                    />
                    </FormControl>
                    <FormControl fullWidth>
                    <InputLabel id="contractor-select-label">Contratante</InputLabel>
                        <Select
                            labelId="contractor-select-label"
                            value={contractor}
                            label="Contratante"
                            sx={{ 
                              marginBottom: '1rem', 
                              height: '56px', 
                            }}                        
                            onChange={handleFilterContractor}
                        >
                            {contractors.map((item) => (
                            <MenuItem key={item.id} value={item.name}>
                                {item.name}
                            </MenuItem>
                            ))}
                        </Select>
                    </FormControl>                  
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <InputLabel id="contractor-select-label">Trilhas</InputLabel>
                        <Select
                            labelId="contractor-select-label"
                            label="Trilhas"
                            value={selectedCourse?.courseId}
                            onChange={handleCourseChange}
                            sx={{ 
                              marginBottom: '1rem', 
                              height: '56px',
                            }}
                            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                            renderValue={(selected: number) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                <Chip key={selected} label={getCourseName(selected)} />
                            </Box>
                            )}
                        >
                            {courses.map((item: Course) => (
                            <MenuItem key={item.courseId} value={item.courseId}>
                                {getCourseName(item.courseId)} <br/> 
                                Quantidade de Aulas: {item.moduleCount}
                            </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    

                    <FormControl fullWidth sx={{ marginBottom: '1rem' }} >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          gap: '2%',
                          width: '100%'
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
                      </Box>
                  </FormControl>
                  <FormControl fullWidth sx={{ marginBottom: '1rem' }} >
                    <MultiDatePicker
                      multiple
                      label="Selecione feriados se existirem"
                      value={holidays}
                      onChange={handleHolidaysChange}
                    />
                  </FormControl>
                  <FormControl fullWidth>
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
                  </FormControl>
                </Grid>                
            </Grid>
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

            {contractor === "" ? true : (
            
            <>
              <FormGroup>
              <FormControlLabel label="Cobrir de acordo com o contratante?"
                      labelPlacement="top"
                      control={<Switch
                          checked={considerContractingScope}
                          onChange={hanldeConsiderContractingScope}
                          inputProps={{'aria-label': 'controlled'}}
                      />}/>
              </FormGroup>              

            {!considerContractingScope? (
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
                                    contractor={0}
                                    province={province} 
                                    existingLocations={[]}
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
        </>

        )}


        <DialogActions style={{ marginTop: '2rem' }}>
            <Button onClick={goBack} color="primary">
                Voltar
            </Button>
            <Button
                onClick={createTeam}
                color="primary"
                variant="contained"
                type="button"
            >
                Salvar
            </Button>
        </DialogActions>
        </Box>
      )}
    </Box>
  );
}