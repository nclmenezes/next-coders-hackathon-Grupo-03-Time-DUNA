import React, { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { FormControl, InputLabel, MenuItem, Select, Switch, FormControlLabel, FormGroup, Grid, SelectChangeEvent, OutlinedInput, Box, Chip, Typography, CardContent, Card } from "@mui/material";
import { ICity, ICityResponse, IProvince } from "../../../interfaces/student/student.interfaces";

interface LocationSelectorProps {
    contractor: number;
    province: IProvince;
    existingLocations: ICityResponse[];
    locations: ICityResponse[];
    contractorLocations?: ICityResponse[];
    onCitiesResponse: (cities: ICityResponse[])=>void;
}

const TLocationSelector = ({ 
    contractor, 
    province,
    existingLocations,
    locations,
    contractorLocations,
    onCitiesResponse,
     }: LocationSelectorProps) => {
    const [citiesList, setCitiesList] = useState<ICity[]>([]);
    const [cityName, setCityName] = useState<string[]>([]);
    const [cityFullCoverageCheck, setCityFullCoverageCheck] 
        = useState(false);   

    const getProvinceCities = async (state: any) => {
        if(contractorLocations !== undefined && contractorLocations[0].cityId !== 'All') {
            const cities: ICity[] = contractorLocations.map(city => {
                return {
                    id: 0,
                    nome: city.cityId,
                };
            });
            setCitiesList(cities);
        }else{
            await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`).then(res => {
                const sortedData = res.data.sort((a: ICity, b: ICity) => a.nome.localeCompare(b.nome));
                setCitiesList(res.data)
            })
        }
    };

    useEffect(() => {
        const updatedLocations = locations.filter(location => location.stateId !== province.sigla);
        
        if(cityFullCoverageCheck) {
            if(contractorLocations !== undefined && contractorLocations[0].cityId !== 'All') {
                const cities = contractorLocations.map(city => {
                    return {
                        contractorId: contractor,
                        cityId: city.cityId,
                        stateId: province.sigla,
                        nationalFlag: false,
                    };
                });
                updatedLocations.push(...cities);
            }else{
                const cities: ICityResponse[] = [{
                    contractorId: contractor,
                    cityId: 'All',
                    stateId: province.sigla,
                    nationalFlag: false,
                }];
                updatedLocations.push(...cities);
            }
        }
        else {
            const cities: ICityResponse[] = cityName.map((city: string) => {
                return {
                    contractorId: contractor,
                    cityId: city,
                    stateId: province.sigla,
                    nationalFlag: false,
                };
            });
            updatedLocations.push(...cities);
        }
    
        onCitiesResponse(updatedLocations);
    }, [cityName, cityFullCoverageCheck, province, locations, onCitiesResponse]);

    useEffect(() => {
        const data = async () => {
            await getProvinceCities(province.sigla);
        };
        data();
    }, [province]);

    useEffect(() => {
        if(existingLocations.length>0 && cityName.length===0){
            const cities = existingLocations.filter(location => location.stateId === province.sigla);
            const citiesNames = cities.map(city => city.cityId);
            if(cities.some(city => city.cityId != 'All'))
                setCityName(citiesNames);
            
            setCityFullCoverageCheck(cities.some(city => city.cityId === 'All'));
        }
        
    }, [existingLocations]);    

    const handleCityChange = (event: SelectChangeEvent<typeof cityName>) => {
        const {
            target: {value},
        } = event;
        setCityName(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleContractorFullCoverageIsActive = (event: ChangeEvent<HTMLInputElement>) => {
        setCityFullCoverageCheck(event.target.checked);
    };

    const labelState = contractorLocations !== undefined ? 
        'Cobrir estado de acordo com o contratante?' : 'Cobrir estado inteiro?';

    return (
        <Card sx={{ backgroundColor: '#f5f5f5', margin: '1rem' }}>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <Typography align="center" variant="h5" sx={{ color: '#000' }}>{province.nome}</Typography>
                        </FormControl>
                    </Grid>
    
                    <Grid item xs={12}>
                        <FormGroup>
                            <FormControlLabel label={labelState}
                                              labelPlacement="top"
                                              control={<Switch
                                                  checked={cityFullCoverageCheck}
                                                  onChange={handleContractorFullCoverageIsActive}
                                                  inputProps={{'aria-label': 'controlled'}}
                                              />}/>
                        </FormGroup>
                    </Grid>            
    
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="contractor-province-label">Cidades</InputLabel>
                            <Select
                                multiple
                                value={cityName}
                                onChange={handleCityChange}
                                disabled={cityFullCoverageCheck}
                                input={<OutlinedInput id="select-multiple-chip" label="Chip"/>}
                                renderValue={(selected) => (
                                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                                        {selected.map((value: any) => (
                                            <Chip key={value} label={value}/>
                                        ))}
                                    </Box>
                                )}
                            >
                                {citiesList.map((item: any) => (
                                    <MenuItem key={item.id} value={item.nome}>
                                        {item.nome}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default TLocationSelector;