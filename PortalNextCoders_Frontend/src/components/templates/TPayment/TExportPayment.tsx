import * as XLSX from 'xlsx';
import { Button, Box, Dialog, DialogTitle } from "@mui/material";
import { ClassStudent, StudentPaymentResponse } from "../../../interfaces/teams/class.interfaces";

interface IExportPayment {
    open: boolean;
    onClose: () => void;
    studentInfo: ClassStudent[];
    className: string;
}

function TExportPayment({open, onClose, className, studentInfo}:IExportPayment) {    
    
    const exportToExcel = (periodId: number) => {    
        const data = studentInfo.map((student: ClassStudent)  => {
            const periodPayment = student.studentPaymentResponses.find((pr: StudentPaymentResponse) => pr.periodNumber === periodId);
            return {
                Nome: student.studentName,
                Bonificacao: periodPayment?.monthlyReward || 0,
                Presenca: periodPayment?.presence || 0,
                Nota: periodPayment?.grade || 0,
            };
        });
    
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, `${className} - Relatório de pagamento de bonificação - Período ${periodId}.xlsx`);

        onClose();
    };   

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" style={{ margin: "auto" }}>
            <DialogTitle>Escolha o período de exportação</DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {[...Array(3)].map((_, index) => (
                    <Button key={index} onClick={() => exportToExcel(index + 1)}>
                        Exportar Período {index + 1}
                    </Button>
                ))}
            </Box>
        </Dialog>
    );
}

export default TExportPayment