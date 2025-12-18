import { Box, Grid, Typography } from "@mui/material";

import logo from '../../../assets/logo.png'

import FormUserResetPassword from "../../molecules/MUser/FormUserResetPassword";
import { Marketing } from "../../organisms/Marketing";

function TUserResetPassword() {
  return (
    <Grid container  columns={16} height="100vh" sx={{width: '100%'}}>
     <Grid  item sm={8}  id='left' 
      sx={{
        width: '100%',
        display: "flex",
        flexDirection: 'column',
        background: '#F8F9FA', 
        alignItems: 'center', justifyContent: 'end'
        }}>
      <Box sx={{ 
      marginRight: {md:3}, 
      marginBottom: 3
      }}>
      <img style={{
        marginBottom: 15,
        height: '80px'
        }} 
        alt="logo" 
        src={logo}/>

        <Box>
        <Typography  variant="h4" 
           sx={{ 
            fontFamily: 'Inter', fontWeight: 600, fontSize: 35, color: '#212429'
          }}
           >Nova senha
          </Typography>
           
          <Typography  variant="subtitle1" 
           sx={{ 
            fontFamily: 'Inter', fontWeight: 500, fontSize: 16, color: '#495057', width: 400
          }}
           >Informe sua nova senha:
           </Typography>
        </Box>
      </Box> 
      
      <FormUserResetPassword/>

      <Typography variant="subtitle2" sx={{
          color: '#9EA6AD',
          marginTop: {slc:7, xl: 3, lg: 3},
          padding: 1,
        }}>
        © Next Coders - Copyright 2022 - {new Date().getFullYear().toString()}
      </Typography>
     </Grid>


      <Grid  item sm={8}  id='right' 
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

    );
}

export default TUserResetPassword;
