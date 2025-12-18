import { Box, IconButton } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import MStudentProfileMenu from "../MStudentProfileMenu/MStudentProfileMenu";
import { useNavigate } from "react-router";


const MNavBar = () => {
    const navigate = useNavigate();
    return (
        <Box
            sx={{
                padding: '7.5px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
            }}
        >
            <IconButton onClick={() => navigate('/')} >
                <HomeIcon sx={{ color: '#0A5995' }} />
            </IconButton>
            <MStudentProfileMenu />
        </Box>
    );
};

export default MNavBar;