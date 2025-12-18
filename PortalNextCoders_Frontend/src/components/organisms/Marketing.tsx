import { Box, ImageListItem, Typography } from "@mui/material";
import imagem from '../../assets/imagem.png'


export function Marketing() {
  return (
    <Box id='boxPai'>
    <Box id='textsBox' sx={{
      position: 'relative',
      left: { xs:40 , md: 60, sm: 20},
      marginTop: {xs: 3},
    }}> 
       <Box id='title'>
          <Typography  variant="h3" 
          marginBottom={3}
          sx={{
          fontFamily: 'Inter', fontWeight: 400, 
          fontSize: {xs: 32, sm: 25, md: 32},
          color: '#FFFFFF'
          }}
          > Mais de 

          <span style={{fontWeight: "bold", 
          fontFamily: 'Inter',
          paddingLeft: 10, 
          color: '#FFFFFF'}}>500 bolsas
          </span> <br/>

          de estudo disponíveis!
          </Typography>
        </Box>
        <Box id='subtitle'>
          <Typography  variant="subtitle2" 
          marginBottom={3}
          sx={{
            fontFamily: 'Inter', 
            color: '#EEEEEE',
            fontWeight: 400, 
            fontSize: 16,
            lineHeight: 2,
            width: {lg: 450, md: 400, sm: 290, xs: 450 },
          }}
          >Você escolhe nossa trilha e nossas empresas escolhem
          você como futuro trainee. Uma vez no mercado, você cria
          seu caminho!
          </Typography>
        </Box>
    </Box>

    <Box id='img'>
    <ImageListItem>
    <img alt="logo" src={imagem}/>
    </ImageListItem>
    </Box>

  </Box>
  );
}