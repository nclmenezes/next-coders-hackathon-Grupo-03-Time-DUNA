import { useEffect, useState } from 'react';
import { Box, Checkbox } from "@mui/material";
import { IStudentTransferDto } from "../../../interfaces/student/studentTransfer.interfaces";

interface IStudentTotalProps {
    studentsTransferList: IStudentTransferDto[];
    handleChangeAllStudents: (isCheck: boolean) => void
};

const AStudentTotal = ({
    studentsTransferList,
    handleChangeAllStudents
}: IStudentTotalProps) => {
    const [checkAllStudents, setCheckAllStudents] = useState<boolean>(false);

    useEffect(() => {
        setCheckAllStudents(studentsTransferList.every(student => student.isChecked));
    }, [studentsTransferList]);

    return (
        <Box
            sx={{
                display: 'flex',
                gap: '14px',
                alignItems: 'center',
                padding: '10px 10px 10px 32px',
                borderTop: '1px solid #DDDDDD',
                color: 'rgba(0, 0, 0, 0.6)',
                cursor: 'pointer',
                userSelect: 'none'
            }}
            onClick={() => {
                handleChangeAllStudents(!checkAllStudents);
                setCheckAllStudents(!checkAllStudents);
            }}
        >
            <Checkbox
                checked={checkAllStudents}
                sx={{ '&.Mui-checked': { color: '#0A5995' } }}
            />
            {studentsTransferList.length} estudantes
        </Box>
    );
}

export default AStudentTotal;