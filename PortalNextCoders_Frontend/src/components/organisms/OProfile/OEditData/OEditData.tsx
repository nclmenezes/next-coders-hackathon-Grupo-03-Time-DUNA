import {useAuth} from "../../../../context/AuthProvider/useAuth";
import React, {useEffect, useState} from "react";
import dayjs, {Dayjs} from "dayjs";
import {citys} from "../../../../interfaces/profile/profile";
import ButtonDesign from "../../../atoms/Button";
import Box from "@mui/material/Box";
import Input, {DatePicker, InputTelephone, SelectAddress} from "../../../atoms/Input";
import {Button, TextField, Typography} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import EditOffIcon from '@mui/icons-material/EditOff';
import axios from "axios";
import {showErrorToast} from "../../../../utils/toast";
import studentAccountService from "../../../../services/api/studentAccount/student.account.service";
import {useNavigate} from "react-router";
import StudentProfessionalProfileService, {
    ProfessionalProfileRequest
} from "../../../../services/api/student/studentProfessionalProfile.service";
import MLoading from "../../../molecules/MLoading";

const OEditData = () => {
    const {user} = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [telephone, setTelephone] = useState('')
    const [cep, setCep] = useState("");
    const [uf, setUf] = useState("");
    const [city, setCity] = useState("0");
    const [cities, setCities] = useState<citys[]>([]);
    const [district, setDistrict] = useState("");
    const [street, setStreet] = useState("");
    const [number, setNumber] = useState("");
    const [complement, setComplement] = useState("");
    const [disabled, setDisabled] = useState(true)
    const [birthDate, setBirthDate] = useState<Dayjs | null>(dayjs("00-00-00"));
    const [nickName, setNickName] = useState("");
    const [profileId, setProfileId] = useState(0);
    const [phoneAreaCode, setPhoneAreaCode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [formPhotoData, setFormPhotoData] = useState<File>();

    const navigate = useNavigate();
    const TelephoneChange = (telephone: string) => {
        setPhoneAreaCode(telephone.trim().substring(4, 6));
        setPhoneNumber(telephone.trim().substring(7, 17))
        setTelephone(telephone);
    };

    const masks = {
        cep(value: any) {
            return value
                .replace(/\D/g, '')
                .replace(/(\d{5})(\d)/, '$1-$2')
                .replace(/(-\d{3})\d+?$/, '$1');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const result = await studentAccountService.getStudentAccountByProfileId(user?.profileId ?? 0);
            const zipCode = result.addresses[0].zipCode ?? ''
            setName(result.firstName);
            setLastName(result.lastName);
            setCpf(result.profileDetail.nationalIdentityNumber);
            setEmail(result.emails[0].emailAddress);
            setTelephone(`+${result.phones[0].countryCode}${result.phones[0].areaCode}${result.phones[0].phoneNumber}`);
            setPhoneAreaCode(result.phones[0].areaCode.toString());
            setPhoneNumber(result.phones[0].phoneNumber.toString());
            setCep(zipCode ? masks.cep(cep) : '');
            setDistrict(result.addresses[0].neighborhood);
            setStreet(result.addresses[0].street);
            setNumber(result.addresses[0].number.toString());
            setComplement(result.addresses[0].complement);
            initialCEPLoad(result.addresses[0].zipCode);
            setBirthDate(dayjs(result.profileDetail.birthDate));
            setNickName(result.nickname);
            setProfileId(result.id);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const initialCEPLoad = (cep: string) => {
        const cepUser = cep.replace(/\D/g, '');
        axios.get(`https://viacep.com.br/ws/${cepUser}/json/`)
            .then(res => {
                setUf(res.data.uf);
                setCities([{id: 0, nome: res.data.localidade}]);
            });
    }
    function disabledInputs() {
        setDisabled(false)

        if (!disabled) {
            setDisabled(true)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormPhotoData(file);
        }
    };

    const checkCEP = (cep: string) => {
        const cepUser = cep.replace(/\D/g, '');
        axios.get(`https://viacep.com.br/ws/${cepUser}/json/`)
            .then(res => {
                if (res.status === 200) {
                    setDistrict(res.data.bairro);
                    setCity(res.data.localidade);
                    setUf(res.data.uf);
                    setStreet(res.data.logradouro)
                    setCities([{id: 0, nome: res.data.localidade}]);

                }
                if (res.status === 400 || res.data.erro) {
                    setDistrict('');
                    setCity('');
                    setUf('');
                    setStreet('');
                }
            });
    }
    
    const validateCEP = async () => {
        const cepUser = cep.replace(/\D/g, '');
        try {
            let res = await axios.get(`https://viacep.com.br/ws/${cepUser}/json/`);
            if (res.status === 200 && res.data.erro === undefined) {
                return true;
            }
            if (res.status === 400 || res.data.erro) {
                return false;
            }
        } catch (e) {
            return false;
        }
    }
    
    const format = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const cep = masks.cep(e.target?.value ?? '')
        setCep(cep)
        checkCEP(cep);
    }


    const isValidFields = () => {
        if (!telephone.trim()) return false;
        if (!cep.trim()) return false;
        if (!number.trim()) return false;
        return true;
    }

    async function SubmitButton(event: React.FormEvent) {
        event.preventDefault();
        try {
            if (!await validateCEP()) {
                return showErrorToast('CEP inválido');
            }

            if (!isValidFields()) {
                return showErrorToast('Todos os campos são obrigatórios!');
            }

            setIsLoading(true);

            let data: {} = {
                profileId: profileId,
                name: name,
                lastName: lastName,
                nickname: nickName ?? '',
                email: email,
                oldEmail: email,
                cep: Number(cep.replace('-', '')),
                uf: uf,
                city: city,
                district: district,
                street: street,
                number: Number(number),
                complement: complement,
                birthDate: `${birthDate?.format('YYYY-MM-DD')}`,
                phoneCountryCode: "55",
                phoneAreaCode: phoneAreaCode,
                phoneNumber: phoneNumber.replace(/\s/g, ''),
            };

            let dataProfilePicture: ProfessionalProfileRequest = {
                studentId: user?.id ?? 0,
                linkedin: null,
                availability: null,
                visibility: null,
                photo: formPhotoData ?? null,
            };

            const result = await studentAccountService.updateStudent(profileId, data);
            const resultProfile = await StudentProfessionalProfileService.UpsertProfessionalProfile(dataProfilePicture);
            setIsLoading(false);
            if (result == null || resultProfile == null) {
                return showErrorToast('Não foi possível realizar o registro!');
            }
            navigate("/");
        } catch (error: any) {
            setIsLoading(false);
            showErrorToast(error.message);
        }

    }

    return (
        <>
            {isLoading ? (<MLoading/>) : (
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
                                Informações Pessoais
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontFamily: 'Inter',
                                    fontWeight: 500,
                                    fontSize: 14
                                }}>
                                Informe os dados que queira atualizar
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
                                    'Edite suas informações'
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
                            <Input
                                placeholder="Nome Social/apelido"
                                text="Nome Social/apelido"
                                type="text"
                                value={nickName}
                                change={(event) => setNickName(event.target.value)}
                                disabled={disabled}
                            />
                            <InputTelephone
                                text='Telefone'
                                value={telephone}
                                change={TelephoneChange}
                                disabled={disabled}
                                placeholder='1234567-8910'
                            />
                            <Input
                                placeholder='CEP'
                                type='text'
                                value={cep}
                                change={format}
                                disabled={disabled}
                                text='Cep'/>

                            <SelectAddress
                                textUf='Estado'
                                textCity='Cidade'
                                valueUf={uf}
                                valueCity={city}
                                changeCity={(event) => setCity(event.target.value)}
                                citys={cities}
                                disabled={disabled}
                            />

                            <Input
                                placeholder='Bairro'
                                text='Bairro'
                                type='text'
                                value={district}
                                disabled={disabled}
                            />
                            <Input
                                placeholder='Rua'
                                text='Rua'
                                type='text'
                                value={street}
                                disabled={disabled}
                            />
                            <Box
                                id='NumeroECep'
                                sx={{
                                    display: 'flex'
                                }}>
                                <Box
                                    id='number'>
                                    <Typography
                                        variant='subtitle1'
                                        sx={{
                                            ml: 2
                                        }}>
                                        Número
                                    </Typography>
                                    <TextField
                                        disabled={disabled}
                                        placeholder='Número'
                                        type='text'
                                        value={number}
                                        onChange={(event) => setNumber(event.target.value)}
                                        sx={{
                                            mb: 3,
                                            width: '11.5ch',
                                            mr: 5,
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'black',
                                                borderRadius: 2
                                            }
                                        }}/>
                                </Box>
                                <Box
                                    id='complement'>
                                    <Typography
                                        variant='subtitle1'
                                        sx={{
                                            ml: 2
                                        }}>
                                        Complemento
                                    </Typography>
                                    <TextField
                                        type="text"
                                        placeholder='Complemento'
                                        disabled={disabled}
                                        value={complement}
                                        onChange={(event) => setComplement(event.target.value)}
                                        sx={{
                                            mb: 3,
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'black',
                                                borderRadius: 2,
                                                width: {
                                                    xs: '18.9ch',
                                                    md: '32.8ch'
                                                }
                                            }
                                        }}/>

                                </Box>
                            </Box>

                            <DatePicker
                                text="Data de nascimento"
                                value={birthDate}
                                change={setBirthDate}
                            />

                            <TextField
                                label="Foto do perfil"
                                type="file"
                                focused
                                onChange={handleFileChange}
                                sx={{marginBottom: 4}}
                            />

                            <ButtonDesign
                                isActive={disabled}
                                click={SubmitButton}
                                text='Salvar'/>
                        </Box>
                    </Box>
                </Box>
            )}
        </>
    )
}

export default OEditData;