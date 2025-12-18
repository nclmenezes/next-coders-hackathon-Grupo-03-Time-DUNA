import {
    Box,
    Card, Typography
} from '@mui/material';
import {ReactNode} from 'react';

interface MExamExceededCardProps {
    icon: ReactNode,
    title: string,
    subtitle: ReactNode
}

const MExamExceededCard = ({icon, title, subtitle}: MExamExceededCardProps) => {
    return (
        <Box>
            <Card variant="outlined" sx={{
                boxShadow: 'none', borderColor: '#dde2e5', borderRadius: '4px', borderWidth: '2px'
            }}>
                <Box display='flex' justifyContent='space-between'>
                    <Box display='flex' sx={{margin: '10px'}}>
                        <Box sx={{
                            alignSelf: 'center',
                            margin: '20px'
                        }}>
                            <Box>
                                <Typography color='#EC3737' fontSize={16}>{icon}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{
                            alignSelf: 'center',
                            paddingRight: '0px'
                        }}>
                            <Box>
                                <Typography color='#EC3737' fontSize={16} fontWeight='bold'>{title}</Typography>
                            </Box>
                            <Box>
                                <Typography color='#495057' fontSize={14}>{subtitle}</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Card>
        </Box>
    );
}
export default MExamExceededCard;
  