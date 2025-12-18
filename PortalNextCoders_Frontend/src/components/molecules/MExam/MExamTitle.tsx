import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface MTitleProps {
    title: string,
    subtitle?: any
}

const MExamTitle = ({title, subtitle}: MTitleProps) => {
    return (
        <Box sx={{marginBottom: '5px'}}>
            <Typography variant='h5'
                        sx={{
                            fontFamily: 'Inter', fontStyle: 'normal', fontWeight: '600', lineHeight: '29px', fontSize: '24px', color: '#212429', paddingBottom: '17px'
                        }}>
                {title}
            </Typography>
            <Typography
                variant="subtitle1"
                sx={{
                    fontFamily: 'Inter', fontStyle: 'normal', fontWeight: '500', lineHeight: '17px', fontSize: '14px', color: '#495057'
                }}
            >
                {subtitle}
            </Typography>
        </Box>
    );
}

export default MExamTitle;