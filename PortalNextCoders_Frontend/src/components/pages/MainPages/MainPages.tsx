import { Box } from "@mui/material";
import { Outlet } from "react-router";
import { prop } from "../../../interfaces/routes/drawerOptions.interface";
import MLeftBar from "../../molecules/MLeftBar/MLeftBar";
import MNavBar from "../../molecules/MNavBar/MNavBar";

const MainPages = ({ drawerOptions }: prop) => {
    return (
        <Box sx={{ display: 'flex' }}>
            <MLeftBar drawerOptions={drawerOptions} />
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <MNavBar />
                <Box sx={{padding: '15px 20px'}}><Outlet/></Box>
            </Box>
        </Box>
    );
};

export default MainPages;