import { format, parse, compareDesc, parseISO } from 'date-fns';
import {
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from '@mui/material';
import { IStudentTransferHistoryDto } from '../../../interfaces/student/studentTransfer.interfaces';

interface ITransferHistoryListProps {
    studentsTransferHistory: IStudentTransferHistoryDto[];
};

const ATransferHistoryList = ({ studentsTransferHistory }: ITransferHistoryListProps) => (
    <TableContainer sx={{ padding: 0, height: '68vh', overflowY: 'auto' }}>
        <Table>
            <TableHead>
                <TableRow sx={{ '&:last-child td, &:last-child th': { color: '#0A5995' } }}>
                    <TableCell>Estudante</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Turma origem</TableCell>
                    <TableCell>Turma destino</TableCell>
                    <TableCell>Data</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    studentsTransferHistory
                        .sort((a, b) => {
                            const dateA = parse(a.transferedAt, 'dd/MM/yyyy HH:mm:ss', new Date());
                            const dateB = parse(b.transferedAt, 'dd/MM/yyyy HH:mm:ss', new Date());
                            return compareDesc(dateA, dateB);
                        })
                        .map(transfer => (
                            <TableRow
                                key={transfer.transferHistoryId}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell>{transfer.studentName}</TableCell>
                                <TableCell>
                                    {
                                        transfer.studentClassId === transfer.studentClassOriginId ?
                                        "Enviado" : "Recebido"
                                    }
                                </TableCell>
                                <TableCell>{transfer.studentClassOriginName}</TableCell>
                                <TableCell>{transfer.studentClassDestinationName}</TableCell>
                                <TableCell>{format(parse(transfer.transferedAt, 'MM/dd/yyyy HH:mm:ss', new Date()), 'dd/MM/yyyy HH:mm:ss')}</TableCell>
                            </TableRow>
                        ))
                }
            </TableBody>
        </Table>
    </TableContainer>
);

export default ATransferHistoryList;