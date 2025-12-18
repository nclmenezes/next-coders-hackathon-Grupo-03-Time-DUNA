import { useNavigate, useParams } from "react-router-dom";
import React, { ChangeEvent, useEffect, useState } from "react";
import { showErrorToast, showSuccessToast } from "../../../utils/toast";
import { toast } from "react-hot-toast";
import {
  Box, Button, Chip, FormControl, FormControlLabel,
  FormGroup, Grid, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, Switch, TextField
} from "@mui/material";
import { PageHeader } from "../../pages/Candidate/styles";
import MLoading from "../../molecules/MLoading";
import contractorService from "../../../services/Teams/contractor.service";
import { ICity, ICityResponse, IProvince } from "../../../interfaces/student/student.interfaces";
import axios from "axios";
import { IContractorMaintainer } from "../../../services/api/maintainers/maintainersContractor.service";
import { MMaintainers } from "../../molecules/MMaintainers/MMaintainers";
import TLocationSelector from "./TLocationSelector";

function TContractorDetail() {
  const { contractorId } = useParams<string>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [contractorDetail, setContractorDetail] = useState<any>([]);
  const [name, setName] = useState("");
  const [lead, setLead] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [mail, setMail] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [provincesSelect, setProvincesSelect] = useState<IProvince[]>([]);
  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [maintainers, setMaintainers] = useState<IContractorMaintainer[]>([]);
  const [showMaintainers, setShowMaintainers] = useState(false);
  const [nationalFlag, setNationalFlag] = useState(false);
  const [locations, setLocations] = useState<ICityResponse[]>([]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const resp = await contractorService.getContractorId(Number(contractorId));
      await getProvinces();

      if (resp == null) {
        return showErrorToast("Não foi possível realizar a busca dos registros!");
      }

      setContractorDetail(resp);
      setName(resp.name);
      setLead(resp.lead);
      setDocumentNumber(resp.documentNumber);
      setMail(resp.mail);
      setIsActive(resp.isActive);
      setMaintainers(resp.maintainers);

    } catch (error: any) {
      toast.error(error.message)
      setIsLoading(false);
    }
    setIsLoading(false);

  };

  useEffect(() => {
    setIsLoading(true);

    fetchData();
  }, [contractorId]);

  const getProvinces = async () => {
    const res = await contractorService.getContractorLocation(Number(contractorId));
    const provinceList = await getProvincesList();
    setProvinces(provinceList);
    const selectedProvinces: IProvince[] = provinceList.filter((province: IProvince) => {
      if (res.find((city: ICityResponse) => city.stateId === province.sigla)) {
        return province;
      }
    });

    setLocations(res);
    setProvincesSelect(selectedProvinces);
  };

  const updateContractor = async () => {
    setIsLoading(true);
    const data = {
      name: name,
      lead: lead,
      documentNumber: documentNumber,
      mail: mail,
      isActive: isActive,
      userAuthId: contractorDetail.userAuthId,
      locationCoverage: locations
    };
    const status = await contractorService.updateContractor(Number(contractorId), data);
    if (status === 200) {
      setIsLoading(false);
      navigate('/contractors');
      return showSuccessToast('Contratante atualizado com sucesso');
    }
    setIsLoading(false);
    return showErrorToast('Erro ao atualizar Contratante');
  };

  const getProvincesList = async (): Promise<any> => {
    const { data } = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/`);

    const sortedData = data.sort((a: IProvince, b: IProvince) => a.nome.localeCompare(b.nome));
    return sortedData;
  };

  const goBack = () => {
    navigate(`/contractors`);
  };

  const handleContractorName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleContractorLead = (event: ChangeEvent<HTMLInputElement>) => {
    setLead(event.target.value);
  };

  const handleContractorDocumentNumber = (event: ChangeEvent<HTMLInputElement>) => {
    setDocumentNumber(event.target.value);
  };
  const handleContractorIsActive = (event: ChangeEvent<HTMLInputElement>) => {
    setIsActive(event.target.checked);
  };

  const handleContractorMail = (event: ChangeEvent<HTMLInputElement>) => {
    setMail(event.target.value);
  };

  const handleProvincesSelect = (event: SelectChangeEvent<string[]>) => {
    const selectedProvinceNames = event.target.value;
    const selectedProvinces = provinces.filter(province => selectedProvinceNames.includes(province.nome));
    setProvincesSelect(selectedProvinces);
  };

  const handleLocationsChange = (locations: ICityResponse[]) => {
    setLocations(locations);
  }  

  const handleNationalFlag = (event: ChangeEvent<HTMLInputElement>) => {
    setNationalFlag(event.target.checked);
    if(event.target.checked === true){
      setLocations([{
          contractorId: Number(contractorId),
          cityId: 'All',
          stateId: 'All',
          nationalFlag: true,
      }]);
    }
    else{
      getProvinces();
    }
  };

  return (
    <Box>
      <PageHeader>
        <h1>Gestão de Contratantes</h1>
        <Button
          variant="contained"
          sx={{ minWidth: 160, marginLeft: 2 }}
          onClick={() => setShowMaintainers(!showMaintainers)}
        >
          Visualizar Mantenedores
        </Button>        
      </PageHeader>

    <MMaintainers 
        contractorId={Number(contractorId)}
        maintainers={maintainers} 
        isModalOpen={showMaintainers} 
        onClose={()=>setShowMaintainers(!showMaintainers)}
        onMaintainersChange={fetchData}
        />
      
      {isLoading ? (
        <MLoading />
      ) : (
        <form autoComplete="off">
          <FormControl fullWidth>
            <TextField
              id="contractor-name-label"
              label="Nome"
              fullWidth
              value={name}
              variant="outlined"
              onChange={handleContractorName}
              inputProps={{ maxLength: 50, autoComplete: "off" }}
              sx={{ marginBottom: 2 }}
            />
          </FormControl>
          <FormControl fullWidth>
            <TextField
             label="Liderança"
              fullWidth
              multiline     
              value={lead}
              variant="outlined"
              sx={{ marginBottom: 2 }}
              onChange={handleContractorLead}
              inputProps={{ maxLength: 50, autoComplete: "off" }}
            />
          </FormControl>
          <FormControl fullWidth>
            <TextField
              value={documentNumber}
              label="CNPJ"
              variant="outlined"
              onChange={handleContractorDocumentNumber}
              inputProps={{ maxLength: 50, autoComplete: "off" }}
              sx={{ marginBottom: 2 }}
            />
          </FormControl>
          <FormControl fullWidth>
            <TextField
              value={mail}
              label="E-mail"
              variant="outlined"
              onChange={handleContractorMail}
              inputProps={{ maxLength: 50, autoComplete: "off" }}
              sx={{ marginBottom: 2 }}
            />
          </FormControl> 
        <FormGroup>
            <FormControlLabel
              label="Contratante Ativo"
              control={
                <Switch
                  checked={isActive}
                  onChange={handleContractorIsActive}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              sx={{ marginBottom: 2 }}
            />
          </FormGroup>         
        <FormGroup>
          <FormControlLabel label="Cobrir o pais inteiro?"
                            labelPlacement="top"
                            control={<Switch
                                checked={nationalFlag}
                                onChange={handleNationalFlag}
                                inputProps={{'aria-label': 'controlled'}}
                            />}/>
        </FormGroup>
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
                            <TLocationSelector 
                                contractor={Number(contractorId)}
                                province={province} 
                                existingLocations={locations.filter(location => location.stateId === province.sigla)}
                                onCitiesResponse={handleLocationsChange} 
                                locations={locations} 
                            />
                          </Grid>
                      ))}
                  </Grid>
              </Grid>                                
          </>
      ) : true} 
        
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
            onClick={updateContractor}
          >
            Salvar
          </Button>
          </Grid>
        </Grid>
        </form>
      )}
    </Box>
  );
}

export default TContractorDetail;
