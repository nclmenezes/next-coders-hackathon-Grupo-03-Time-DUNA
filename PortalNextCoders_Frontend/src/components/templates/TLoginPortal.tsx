import { Box, Grid, Typography } from "@mui/material";

import logo from '../../assets/logo.png'
import { Marketing } from '../organisms/Marketing';
import FormLoginPortal from '../molecules/MPortal/FormLoginPortal';

export default function TLoginPortal() {
  return (
    <Grid container  columns={16} height="100vh">

      <Grid  item sm={8}  id='left' 
      sx={{
        width: '100%',
        display: "flex",
        flexDirection: 'column',
        background: '#F8F9FA', 
        alignItems: 'center', justifyContent: 'end'
        }}>

      <Box sx={{ 
        marginRight: {md:27}, 
        marginBottom: 3
       }}>
      <img style={{
          marginBottom: 15,
          height: '80px'
         }} 
         alt="logo" 
         src={logo}/>
        <Box>
          <Typography  variant="subtitle1" 
            sx={{ 
              fontFamily: 'Arial', fontWeight: 500, fontSize: 14
            }}
            >Olá, bem-vindo(a) de volta
          </Typography>

          <Typography  variant="h4" 
            sx={{ 
              fontFamily: 'Arial', fontWeight: 600, fontSize: 30
            }}
            >Faça seu login
           </Typography>
        </Box>
      </Box>

        <FormLoginPortal />

        <Typography variant="subtitle2" sx={{
          color: '#9EA6AD',
          marginTop: {xll: 30, xl: 15, sm: 12},
          padding: 1,
        }}>
        © Next Coders - Copyright 2022 - {new Date().getFullYear().toString()}
        </Typography>
      </Grid>

      <Grid item sm={8}  id="right"
      sx={{
      width: '100%',
      background: '#0A4295', 
      display: "flex",
      flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center'
       }}>
       <Marketing/>
      </Grid>

    </Grid>
) 
  }