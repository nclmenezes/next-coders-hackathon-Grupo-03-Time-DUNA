import {useAuth} from "../../../../context/AuthProvider/useAuth";
import React, {useEffect, useState} from "react";
import ButtonDesign from "../../../atoms/Button";
import Box from "@mui/material/Box";
import Input, {SelectInput} from "../../../atoms/Input";
import {Button, Chip, InputLabel, Typography} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import EditOffIcon from '@mui/icons-material/EditOff';
import {showErrorToast, showSuccessToast} from "../../../../utils/toast";
import StudentProfessionalProfileService, {
    ProfessionalProfileRequest
} from "../../../../services/api/student/studentProfessionalProfile.service";
import MLoading from "../../../molecules/MLoading";


const OEditProfessionalData = () => {
    const {user} = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [linkedin, setLinkedin] = useState('');
    const [certificateUrl, setCertificateUrl] = useState('');
    const [course, setCourse] = useState('');
    const [studentClass, setStudentClass] = useState('');
    const [availability, setAvailability] = useState(false);
    const [visibility, setVisibility] = useState(false);
    const [disabled, setDisabled] = useState(true);

    const optionsAvailability = [
        {label: 'Sim', id: '1', value: true},
        {label: 'Não', id: '2', value: false},
    ];

    useEffect(() => {
        const fetchData = async () => {
            const result = await StudentProfessionalProfileService.GetProfessionalProfile(user?.id ?? 0);
            setLinkedin(result.linkedin);
            setAvailability(result.availability);
            setCourse(result.course);
            setStudentClass(result.class);
            setCertificateUrl(result.certificateUrl);
            setVisibility(result.visibility);
        }
        fetchData();
    }, []);

    function disabledInputs() {
        setDisabled(false)

        if (!disabled) {
            setDisabled(true)
        }
    }

    async function SubmitButton(event: React.FormEvent) {
        event.preventDefault();
        try {
            setIsLoading(true);
            let data: ProfessionalProfileRequest = {
                studentId: user?.id ?? 0,
                linkedin: linkedin,
                availability: optionsAvailability.find(w => w.value === availability)?.value ?? false,
                photo: null,
                visibility: optionsAvailability.find(w => w.value === visibility)?.value ?? false
            };
            const result = await StudentProfessionalProfileService.UpsertProfessionalProfile(data);
            setIsLoading(false);
            if (result == null) {
                return showErrorToast('Não foi possível realizar o registro!');
            }
            showSuccessToast('Registro realizado com sucesso!');
            setDisabled(true);
        } catch (error: any) {
            setIsLoading(false);
            showErrorToast(error.message);
        }

    }

    return (
        <>
            {isLoading ? (
                <MLoading/>
            ) : (
                <Box
                    component="form"
                    sx={{
                        height: '100%',
                        width: '100%',
                        display: "flex",
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 6
                        }}>
                        <Box
                            sx={{
                                ml: 2,
                                mb: 2
                            }}>
                            <Typography
                                variant="h2"
                                sx={{
                                    fontFamily: 'Inter',
                                    fontWeight: 600,
                                    fontSize: 30
                                }}>
                                Perfil Profissional
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontFamily: 'Inter',
                                    fontWeight: 500,
                                    fontSize: 14
                                }}>
                                Informe os dados do seu perfil profissional
                            </Typography>
                        </Box>
                        <Button
                            onClick={disabledInputs}
                            disableRipple
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                fontSize: '12px',
                                fontFamily: 'Inter',
                                color: 'black',
                                hover: '#FFFFFF'
                            }}>
                            {
                                disabled ?
                                    <EditIcon color='success'/>
                                    :
                                    <EditOffIcon color='error'/>
                            }
                            {
                                disabled ?
                                    'Edite/Crie suas informações'
                                    :
                                    'Cancelar operação'
                            }
                        </Button>
                    </Box>
                    <Box
                        id='pai'
                        display='flex'>
                        <Box
                            sx={{
                                '& > :not(style)': {m: 1},
                                justifyContent: 'center',
                                alignItems: 'center',
                                mr: 30,
                                overflowY: 'scroll',
                                overflowX: 'hidden',
                                height: '57.1vh',
                                paddingRight: 10,
                                marginRight: '0px',
                                width: '75%'
                            }}>
                            {linkedin && course && studentClass !== '' &&
                                <Box sx={{
                                    justifyContent: 'center',
                                    display: 'inline-block',
                                    alignItems: 'center',
                                    height: '15.1vh',
                                    mr: 90,
                                    paddingRight: 10,
                                    paddingBottom: '7em',
                                    width: '100%'
                                }}>

                                    <InputLabel>Curso</InputLabel>
                                    <Chip label={course} sx={{mb: 2}}/>
                                    <InputLabel>Turma</InputLabel>
                                    <Chip label={studentClass}/>
                                </Box> }
                            <Input
                                placeholder="Linkedin"
                                text="Linkedin"
                                type="text"
                                value={linkedin}
                                change={(event) => setLinkedin(event.target.value)}
                                disabled={disabled}
                            />
                            <SelectInput
                                text="Disponível para vagas de emprego?"
                                options={optionsAvailability}
                                value={optionsAvailability.find(w => w.value === Boolean(availability))?.label ?? ""}
                                optionEqual={(option, value) => option.id === value.id}
                                change={(event, newValue) => {
                                    setAvailability(newValue.value);
                                }}
                            />
                            <SelectInput
                                text={`Autorizo compartilhar as informações do meu perfil profissional
                                       com empresas parceiras da Next Coders.`}
                                options={optionsAvailability}
                                value={optionsAvailability.find(w => w.value === Boolean(visibility))?.label ?? ""}
                                optionEqual={(option, value) => option.id === value.id}
                                change={(event, newValue) => {
                                    setVisibility(newValue.value);
                                }}/>

                            <Box sx={{display: 'block'}}>
                                <ButtonDesign
                                    isActive={disabled}
                                    click={SubmitButton}
                                    text='Salvar'/>
                            </Box>
                        </Box>
                    </Box>
                </Box>)}
        </>);
}

export default OEditProfessionalData;