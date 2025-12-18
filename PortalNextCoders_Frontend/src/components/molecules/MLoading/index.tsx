import { Player } from "@lottiefiles/react-lottie-player";
import { Box, CircularProgress, Typography } from "@mui/material";

const MLoading = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        height: "100%",
        background: "rgba(255, 255, 255, .6)",
        textAlign: "center",
      }}
    >
      <Box>
        <CircularProgress size={54} />
      </Box>
      <Box>
        <Typography variant="h6" color="#0a5995">
          Carregando...
        </Typography>
      </Box>
    </Box>
  );
};

export default MLoading;
