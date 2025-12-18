import { Player } from "@lottiefiles/react-lottie-player";
import { Box, Typography } from "@mui/material";

const MLoadingReport = () => {
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
                <Player
                    autoplay
                    loop
                    src="https://lottie.host/58a05164-e5f5-4caf-b4cf-c8f17264a3a1/hc9Q2UaI4J.json"
                    style={{ height: '180px', width: '180px' }}
                />
            </Box>
            <Box>
                <Typography variant="h5" color="#0a5995">
                   Baixando seu relatório...
                </Typography>
            </Box>
        </Box>
    );
};

export default MLoadingReport;