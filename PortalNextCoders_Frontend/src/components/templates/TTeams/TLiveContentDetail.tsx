import {useNavigate, useParams} from "react-router-dom";
import React, {ChangeEvent, useEffect, useState} from "react";
import {showErrorToast, showSuccessToast} from "../../../utils/toast";
import {
    Box,
    Button,
    FormControl,
    Grid,
    InputLabel,
    TextField, Typography
} from "@mui/material";
import {PageHeader} from "../../pages/Candidate/styles";
import MLoading from "../../molecules/MLoading";
import studentService from "../../../services/student/student.service";
import DatePicker, {Value} from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import {format, parse} from "date-fns";

function TLiveContentDetail() {
    const {id} = useParams<string>();
    const inputFormat = 'dd/MM/yyyy HH:mm:ss';
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [content, setContents] = useState<any>([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
    const [eventDate, setEventDate] = useState<Value>(new Date());

    const getContents = async () => {
        setIsLoading(true);
        const data = await studentService.GetClassAllLive();
        const existingContent = data.filter((item: any) => item.contentId === Number(id));
        setContents(existingContent);
        setName(existingContent[0].name);
        setDescription(existingContent[0].description);
        setLink(existingContent[0].link);
        setEventDate(existingContent[0].eventDate);
        setIsLoading(false);
    };


    useEffect(() => {
        getContents();
    }, []);

    const updateContractor = async () => {
        setIsLoading(true);
        console.log(eventDate)
        const data = {
            contentId: content[0].contentId,
            name: name,
            description: description,
            type: content[0].type,
            link: link,
            isRequired: content[0].isRequired.toString(),
            studentClassId: content[0].studentClassId,
            eventDate: format(parse(eventDate!.toString(), inputFormat, new Date()), 'yyyy-MM-dd HH:mm:ss.SSSSSSS')
        };
        const status = await studentService.updateLiveEvent(data);
        if (status === 201) {
            setIsLoading(false);
            navigate('/live');
            return showSuccessToast('Aula ao vivo atualizada com sucesso');
        }
        setIsLoading(false);
        return showErrorToast('Erro ao atualizar aula ao vivo');
    };

    const goBack = () => {
        navigate(`/live`);
    };

    const handleContentName = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };
    const handleContentDescription = (event: ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    };

    const handleLink = (event: ChangeEvent<HTMLInputElement>) => {
        setLink(event.target.value);
    };

    return (
        <Box>
            <PageHeader>
                <h1>Gestão de aulas ao vivo</h1>
            </PageHeader>

            {isLoading ? (
                <MLoading/>
            ) : (
                <>
                    <Box component="form"
                         sx={{
                             '& > :not(style)': {m: 1},
                             display: 'flex',
                             flexDirection: 'column',
                         }}
                         noValidate
                         autoComplete="off">
                        <Grid container rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
                            <Grid item xs={3}>
                                <FormControl fullWidth>
                                    <TextField
                                        id="content-name-label"
                                        value={name}
                                        variant="outlined"
                                        onChange={handleContentName}
                                        inputProps={{maxLength: 50, autoComplete: "off"}}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={3}>
                                <FormControl fullWidth>
                                    <InputLabel id="content-description-label"/>
                                    <TextField
                                        value={description}
                                        variant="outlined"
                                        onChange={handleContentDescription}
                                        inputProps={{maxLength: 50, autoComplete: "off"}}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={3}>
                                <FormControl fullWidth>
                                    <InputLabel id="content-document-label"/>
                                    <TextField
                                        label="Link"
                                        value={link}
                                        variant="outlined"
                                        onChange={handleLink}
                                        inputProps={{maxLength: 50, autoComplete: "off"}}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={3}>
                                <Typography sx={{fontFamily: 'Inter', fontWeight: 500, marginBottom: 2}}>
                                    Data da aula ao vivo:
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
                                sx={{minWidth: 160, marginLeft: 2}}
                                onClick={updateContractor}
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
                </>
            )}
        </Box>
    );
}

export default TLiveContentDetail;