import {useNavigate} from "react-router";
import {Box, Button, Container, Typography} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import authService from "../../services/auth.service";
import logoNotFound from "../../assets/notFound.png";
import {useEffect} from "react";

function Error404() {
    const navigate = useNavigate();
    const isAuthenticated = authService.getToken() !== null;
    const handleLogout = () => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }

    useEffect(() => {
        handleLogout();
    }, []);

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
                    <Typography align="center" color="#22c25f" variant="h3">
                        Você veio aqui por engano. Seja como for, vamos voltar para a home.
                    </Typography>
                    <Box sx={{textAlign: "center"}}>
                        <img
                            alt="Under development"
                            src={logoNotFound}
                            style={{
                                marginTop: 50,
                                display: "inline-block",
                                maxWidth: "100%",
                                width: 365,
                            }}
                        />
                    </Box>
                    <Button
                        component="a"
                        startIcon={<ArrowBackIcon fontSize="small"/>}
                        sx={{mt: 3}}
                        variant="contained"
                        onClick={() => navigate("/")}
                    >
                        Voltar para home
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}

export default Error404;
