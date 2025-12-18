import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { useAuth } from "../../../../context/AuthProvider/useAuth";

import Hand from "@mui/icons-material/SignLanguage";

export default function OTitleHome() {
  const { user } = useAuth();

  return (
    <Box sx={{ display: "flex", alignItems: "center", py: 2, mt: -2 }}>
      <Box
        sx={{
          display: "flex",
          width: "43px",
          bgcolor: "#4263EB",
          borderRadius: "100%",
          alignItems: "center",
          justifyContent: "center",
          py: 1,
          mx: 1,
        }}
      >
        <Hand color="info" fontSize="medium" />
      </Box>
      <Typography
        variant="body1"
        sx={{
          fontFamily: "Inter",
          fontStyle: "normal",
          fontWeight: "500",
          fontSize: "20px",
          lineHeight: "24px",
          color: "#212429",
        }}
      >
        <b>Olá {user?.name}, seja bem-vindo(a)!</b>
      </Typography>
    </Box>
  );
}
