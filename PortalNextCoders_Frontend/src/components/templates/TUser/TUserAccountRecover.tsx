import { Box, Grid, Typography } from "@mui/material";

import logo from '../../../assets/logo.png'
import { Marketing } from "../../organisms/Marketing";
import FormUserPasswordRecover from "../../molecules/MUser/FormUserPasswordRecover";

function TUserAccountRecover() {
  return (
    <Grid container  columns={16} height="100vh">
      <Grid  item sm={8}  id='left' 
      sx={{
        width: '100%',
        display: "flex",
        flexDirection: 'column',
        background: '#F8F9FA', 
        alignItems: 'center', justifyContent: 'center'
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
            fontFamily: 'Inter', fontWeight: 600, fontSize: 35, color: '#212429', marginBottom: 2,
          }}
           >Recuperar senha
          </Typography>
           
          <Typography  variant="subtitle1" 
           sx={{ 
            fontFamily: 'Inter', fontWeight: 500, fontSize: 16, color: '#495057', width: 400
          }}
           >Esqueceu sua senha? Digite seu e-mail que 
           enviaremos um link para definir uma nova senha.
           </Typography>
        </Box>
      </Box> 

        <FormUserPasswordRecover/>
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
  );
}

export default TUserAccountRecover;
