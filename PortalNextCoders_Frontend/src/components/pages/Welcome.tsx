import { Box, Button, Container, Typography } from '@mui/material';

function Welcome() {
  var dataUser = localStorage.getItem("user")

  const dadosUsuario = !dataUser ? "" : JSON.parse(dataUser);

  return (
    <Box
      component="main"
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexGrow: 1,
        minHeight: '100vh'
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography
            align="center"
            color="#22c25f"
            variant="h2"
          >
            Bem-vindo(a)!
          </Typography>
          <Typography
            align="center"
            color="#22c25f"
            variant="h4"
          >
            {dadosUsuario.email}
          </Typography>
          <Typography
            align="center"
            color="white"
            variant="subtitle1"
          >
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
          </Box>
          <a
            href="/login"
          >
            <Button
              component="a"
              sx={{ mt: 3 }}
              variant="contained"
            >
              Login
            </Button>
          </a>
        </Box>
      </Container>
    </Box>
  );
}
export default Welcome;
