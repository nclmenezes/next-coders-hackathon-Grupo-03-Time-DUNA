import React from "react";
import {Box} from "@mui/system";
import {Typography} from "@mui/material";

interface MExamInfoProps {
    icon: any;
    text: string;
    quantity?: string;
}

const MExamInfo = ({icon, text, quantity}: MExamInfoProps) => {
    return (
        <Box display="flex" alignItems="center">
            <Box sx={{marginRight: '19px'}}>
                <Typography color="#67A10F" fontSize={16}>
                    {icon}
                </Typography>
            </Box>
            <Box>
                <Typography color="#333333" fontSize={16} fontWeight={600}>
                    {text}
                    <span style={{fontWeight: 400}}>
            {quantity ? ' - ' + quantity : ''}
          </span>
                </Typography>
            </Box>
        </Box>
    );
}

export default MExamInfo;