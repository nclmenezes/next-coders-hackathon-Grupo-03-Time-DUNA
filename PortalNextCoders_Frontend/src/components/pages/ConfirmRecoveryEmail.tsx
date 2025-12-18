import { Box, Button, Container, Typography } from "@mui/material";

function ConfirmRecoveryEmail() {
  return (
    <Box
      component="main"
      sx={{
        alignItems: "center",
        display: "flex",
        flexGrow: 1,
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography align="center" color="gray" variant="h3">
            Recuperação de senha!
          </Typography>
          <p>
            Enviamos um e-mail para atualização da sua senha, por favor verifique
            seu e-mail.
          </p>
          <Typography align="center" color="white" variant="subtitle1" />
          <Box sx={{ textAlign: "center" }}></Box>
          <Button
            component="a"
            href="/login"
            aria-label="Voltar para a página de login"
            sx={{ mt: 3 }}
            variant="contained"
          >
            Login
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default ConfirmRecoveryEmail;
