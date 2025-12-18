import { Box, SxProps, Theme, Typography } from "@mui/material";

interface props {
    name: string;
    percentage: number;
    style?: SxProps<Theme>;
    colorProgress?: string;
}

export function MProgressLine({ name, percentage, style, colorProgress }: props) {
    const displayText = `${percentage}% ${name}`;

    return (
        <Box className="m-progress-line" sx={{ width: '100%', height: `32px`, borderRadius: 53, padding: `2.5px`, backgroundColor: `#CDCDCD`, ...style }}>
            <Box sx={{ display: 'flex', paddingLeft: `15px`, alignItems: 'center', width: `${percentage}%`, height: `100%`, backgroundColor: colorProgress ?? '#4263EB', borderRadius: 53 }}>
                <Typography fontFamily={`Inter`} fontSize={13} color={`#FFF`} sx={{ color: 'white', whiteSpace: 'nowrap',  lineHeight: '1' }}>
                    {displayText}
                </Typography>
            </Box>
        </Box>
    );
}
