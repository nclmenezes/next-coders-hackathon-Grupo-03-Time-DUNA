import {useNavigate} from "react-router-dom";
import React, {ChangeEvent, useEffect, useState} from "react";
import contractorService from "../../../services/Teams/contractor.service";
import {showErrorToast, showSuccessToast} from "../../../utils/toast";
import {
    Box,
    Button,
    Chip,
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
    TextField
} from "@mui/material";
import {PageHeader} from "../../pages/Candidate/styles";
import MLoading from "../../molecules/MLoading";
import axios from "axios";
import {ICity, ICityResponse, IProvince} from "../../../interfaces/student/student.interfaces";
import LocationSelector from "./TLocationSelector";

function TContractorCreation() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [lead, setLead] = useState("");
    const [documentNumber, setDocumentNumber] = useState("");
    const [mail, setMail] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [provincesSelect, setProvincesSelect] = useState<IProvince[]>([]);
    const [provinces, setProvinces] = useState<IProvince[]>([]);
    const [nationalFlag, setNationalFlag] = useState(false);
    const [locations, setLocations] = useState<ICityResponse[]>([]);

    const getProvinces = async () => {
        await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/`).then(res => {
            const sortedData = res.data.sort((a: IProvince, b: IProvince) => a.nome.localeCompare(b.nome));
            setProvinces(sortedData);
        })
    };

    const create = async () => {
        setIsLoading(true);
        const data = {
            name: name,
            lead: lead,
            documentNumber: documentNumber,
            mail: mail,
            isActive: isActive,
            userAuthId: "",
            locationCoverage: locations,
        };

        try {
            const status = await contractorService.createContractor(data);
            if (status === 200) {
                setIsLoading(false);
                navigate('/contractors');
                return showSuccessToast('Contratante criado com sucesso');
            }
            setIsLoading(false)
            return showErrorToast('Erro ao criar Contratante');
        } catch (error: any) {
            showErrorToast(error.response.data.errors.messages[0]);
            setIsLoading(false);
        }
    };

    const goBack = () => {
        navigate(`/contractors`);
    };

    useEffect(() => {
        const data = async () => {
            await getProvinces();
        };

        data();
    }, []);

    const handleContractorName = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };
    const handleContractorLead = (event: ChangeEvent<HTMLInputElement>) => {
        setLead(event.target.value);
    };

    const handleContractorDocumentNumber = (event: ChangeEvent<HTMLInputElement>) => {
        setDocumentNumber(event.target.value);
    };

    const handleContractorMail = (event: ChangeEvent<HTMLInputElement>) => {
        setMail(event.target.value);
    };
    const handleContractorIsActive = (event: ChangeEvent<HTMLInputElement>) => {
        setIsActive(event.target.checked);
    };

    const handleNationalFlag = (event: ChangeEvent<HTMLInputElement>) => {
        setNationalFlag(event.target.checked);
        setLocations([{
            contractorId: 0,
            cityId: 'All',
            stateId: 'All',
            nationalFlag: true,
        }]);
    };

    const handleProvincesSelect = (event: SelectChangeEvent<string[]>) => {
        const selectedProvinceNames = event.target.value;
        const selectedProvinces = provinces.filter(province => selectedProvinceNames.includes(province.nome));
        setProvincesSelect(selectedProvinces);
    }; 

    const handleLocationsChange = (locations: ICityResponse[]) => {
        setLocations(locations);
    }


    // @ts-ignore
    // @ts-ignore
    return (
        <Box>
            <PageHeader>
                <h1>Criação de Contratantes</h1>
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
                            maxWidth: '600px',
                            margin: '0 auto',
                        }}
                        noValidate
                        autoComplete="off">
                        <Grid container direction="column" rowSpacing={1} columnSpacing={{xs: 1, sm: 2, md: 3}}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <TextField
                                        required
                                        id="contractor-name-label"
                                        label={"Nome"}
                                        value={name}
                                        variant="outlined"
                                        onChange={handleContractorName}
                                        inputProps={{maxLength: 50, autoComplete: "off"}}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="contracotr-lead-label"/>
                                    <TextField
                                        required
                                        label="Responsável"
                                        value={lead}
                                        variant="outlined"
                                        onChange={handleContractorLead}
                                        inputProps={{maxLength: 50, autoComplete: "off"}}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="contracotr-lead-label"/>
                                    <TextField
                                        required
                                        label="email"
                                        value={mail}
                                        variant="outlined"
                                        onChange={handleContractorMail}
                                        inputProps={{maxLength: 50, autoComplete: "off"}}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="contractor-document-label"/>
                                    <TextField
                                        required
                                        label="Cnpj"
                                        value={documentNumber}
                                        variant="outlined"
                                        onChange={handleContractorDocumentNumber}
                                        inputProps={{maxLength: 50, autoComplete: "off"}}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormGroup>
                                    <FormControlLabel label="Contratante Ativo"
                                                      labelPlacement="top"
                                                      control={<Switch
                                                          checked={isActive}
                                                          onChange={handleContractorIsActive}
                                                          inputProps={{'aria-label': 'controlled'}}
                                                      />}/>
                                </FormGroup>
                            </Grid>
                            <Grid item xs={12}>
                                <FormGroup>
                                    <FormControlLabel label="Cobrir o pais inteiro?"
                                                      labelPlacement="top"
                                                      control={<Switch
                                                          checked={nationalFlag}
                                                          onChange={handleNationalFlag}
                                                          inputProps={{'aria-label': 'controlled'}}
                                                      />}/>
                                </FormGroup>
                            </Grid>    

                            {!nationalFlag? (
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
                                                disabled={nationalFlag}
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
                                                    <LocationSelector 
                                                        contractor={0}
                                                        province={province} 
                                                        existingLocations={[]}
                                                        onCitiesResponse={handleLocationsChange} 
                                                        locations={locations} 
                                                    />
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Grid>                                
                                </>
                            ) : true}                        
                        </Grid>
                        <Grid container justifyContent="space-between" sx={{ marginTop: 2 }}>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    sx={{ minWidth: 160, marginLeft: '3rem', marginTop: '2rem' }}
                                    onClick={goBack}
                                >
                                    Voltar
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    sx={{ minWidth: 160, marginTop: '2rem' }}
                                    onClick={create}
                                >
                                    Salvar
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </>
            )}
        </Box>
    );
}

export default TContractorCreation;