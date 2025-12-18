import { Box, Button } from '@mui/material';

interface BackNextContentProps {
    handleBackButton: () => void;
    handleNextButton: () => void;
    nextButtonText: string;
    backButtonText: string;
    backButtonVisibility: boolean;
    nextButtonVisibility: boolean;
};

const ABackNextContent = ({
    handleBackButton,
    handleNextButton,
    nextButtonText,
    backButtonText,
    backButtonVisibility,
    nextButtonVisibility
}: BackNextContentProps) => (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
        <Button
            onClick={() => handleBackButton()}
            sx={{
                visibility: backButtonVisibility ? 'hidden' : 'default',
                bgcolor: '#DDDDDD',
                '&:hover': { bgcolor: '#DDDDDD' },
                fontFamily: 'Inter',
                fontWeight: 500,
                textTransform: 'none',
                color: 'grey',
                padding: '10px 25px'
            }}
        >
            { backButtonText }
        </Button>
        <Button
            onClick={() => handleNextButton()}
            sx={{
                visibility: nextButtonVisibility ? 'default' : 'hidden',
                bgcolor: 'rgb(66, 99, 235)',
                '&:hover': { bgcolor: 'rgb(66, 99, 235)' },
                fontFamily: 'Inter',
                fontWeight: 500,
                textTransform: 'none',
                color: 'white',
                padding: '10px 25px'
            }}
        >
            { nextButtonText }
        </Button>
    </Box>
);

export default ABackNextContent;