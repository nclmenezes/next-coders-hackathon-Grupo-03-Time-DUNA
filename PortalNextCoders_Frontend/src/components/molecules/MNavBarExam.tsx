import {
    Button,
    Link,
    List,
    ListItemButton,
    TextField,
    Typography,
} from "@mui/material";
import {useMatch, useNavigate, useResolvedPath} from "react-router";
import {NavLink, Section} from "./MNavBarInline";

function MNavbarExam() {
    const navigate = useNavigate();
    return (
        <List sx={{display: "inline-flex", borderBottom: "1px solid #EBF0F3"}}>
            <ListItemButton 
                disableRipple 
                onClick={() => navigate('/profile/aptitude-test')}
                sx={{
                    bgcolor: "transparent",
                    "&:hover": { bgcolor: "transparent" },
                }}
            >
                <Typography
                    sx={{
                        color: "#4263EB",
                        fontFamily: "Inter",
                        fontWeight: 600,
                        fontSize: "14px",
                        borderBottom: "3px solid #4263EB",
                        pb: 0.5,
                    }}
                >
                    Teste de aptidão
                </Typography>

            </ListItemButton>
        </List>
    );
}

export default MNavbarExam;
