import { Box } from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { IStudentTransferDto } from "../../../interfaces/student/studentTransfer.interfaces";

type arrowSide = 'left' | 'right';
interface IArrowButtonProps {
    arrowSide: arrowSide;
    disabled: boolean;
    studentsTransferList: IStudentTransferDto[];
    handleStudentTransfer: (studentTransferList: IStudentTransferDto[]) => void;
};

const AArrowButton = ({
    arrowSide,
    disabled,
    studentsTransferList,
    handleStudentTransfer
}: IArrowButtonProps) => (
    <Box
        sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: disabled ? '#DDDDDD' : '#0A5995',
            padding: '10px',
            borderRadius: '5px',
            cursor: disabled ? 'not-allowed' : 'pointer'
        }}
        onClick={() => { if (!disabled) handleStudentTransfer(studentsTransferList); }}
    >
        {arrowSide === 'right' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
    </Box>
);

export default AArrowButton;