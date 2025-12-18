import {useNavigate} from "react-router";
import {ChangeEvent, useEffect, useState} from "react";
import DatePicker, {Value} from "react-multi-date-picker";
import {
    Box, Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography
} from "@mui/material";
import studentService from "../../../services/student/student.service";
import {showErrorToast, showSuccessToast} from "../../../utils/toast";
import MLoading from "../../molecules/MLoading";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import {format, parse} from "date-fns";

function TLiveContentCreation() {
    const navigate = useNavigate();
    const inputFormat = 'dd/MM/yyyy HH:mm:ss';
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
    const [activeClasses, setActiveClasses] = useState<any[]>([]);
    const [activeClass, setActiveClass] = useState("");
    const [eventDate, setEventDate] = useState<Value>(new Date());
    const getActiveClasses = async () => {
        const response = await studentService.getActiveClassesGeneral();
        setActiveClasses(response);
    }

    const handleClassName = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };
    const handleClassDescription = (event: ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    };

    const handleLink = (event: ChangeEvent<HTMLInputElement>) => {
        setLink(event.target.value);
    };
    const handleFilterClasses = (event: SelectChangeEvent) => {
        const selectedValue = event.target.value as string;
        setActiveClass(selectedValue);
    };

    useEffect(() => {
        const data = async () => {
            await getActiveClasses();
        };

        data();
    }, []);

    const createLiveClass = async () => {
        setLoading(true);
        const data = {
            name: name,
            description: description,
            type: 5,
            link: link,
            isRequired: "false",
            studentClassId: activeClass,
            eventDate: format(parse(eventDate!.toString(), inputFormat, new Date()), 'yyyy-MM-dd HH:mm:ss.SSSSSSS')
        };
       
        const status = await studentService.createLiveEvent(data);

        if (status === 201) {
            setLoading(false);
            navigate('/live');
            return showSuccessToast('Aula ao vivo criada com sucesso');
        }
        setLoading(false);
        return showErrorToast('Erro ao criar aula ao vivo');
    }

    const goBack = () => {
        navigate('/');
    }


    return (
        <Box>
            {loading ? <MLoading/> : (
                <Box component="form"
                     sx={{
                         '& > :not(style)': {m: 1},
                         display: 'flex',
                         flexDirection: 'column',
                     }}>
                    <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
                        <Grid item xs={3}>
                            <FormControl fullWidth>
                                <InputLabel id="liveclass-name-label"/>
                                <TextField
                                    label="Nome do conteúdo ao vivo"
                                    value={name}
                                    variant="outlined"
                                    onChange={handleClassName}
                                    inputProps={{maxLength: 50, autoComplete: "off"}}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl fullWidth>
                                <InputLabel id="liveclass-description-label"/>
                                <TextField
                                    label="Descrição da aula ao vivo"
                                    value={description}
                                    variant="outlined"
                                    onChange={handleClassDescription}
                                    inputProps={{maxLength: 50, autoComplete: "off"}}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl fullWidth>
                                <InputLabel id="liveclass-link-label"/>
                                <TextField
                                    label="Link da aula ao vivo"
                                    value={link}
                                    variant="outlined"
                                    onChange={handleLink}
                                    inputProps={{maxLength: 50, autoComplete: "off"}}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth sx={{mt: 3}}>
                                <InputLabel id="class-select-label">Turma</InputLabel>
                                <Select
                                    labelId="class-select-label"
                                    label="Turma"
                                    key={activeClass}
                                    value={activeClass}
                                    onChange={handleFilterClasses}
                                >
                                    <MenuItem value="0">- SELECIONE -</MenuItem>
                                    {activeClasses.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography sx={{fontFamily: 'Inter', fontWeight: 500, marginBottom: 2}}>
                                Data de início da aula ao vivo:
                            </Typography>
                            <DatePicker
                                format="DD/MM/YYYY HH:mm:ss"
                                value={eventDate}
                                onChange={setEventDate}
                                plugins={[
                                    <TimePicker position="bottom"/>
                                ]}
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            
                            onClick={createLiveClass}
                        >
                            Salvar
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            sx={{minWidth: 2, marginLeft: 2}}
                            onClick={goBack}
                        >
                            Voltar
                        </Button>
                    </Grid>
                </Box>
            )}
        </Box>
    )
}

export default TLiveContentCreation;