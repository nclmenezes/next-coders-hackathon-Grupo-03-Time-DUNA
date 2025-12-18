import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import { AddPayment } from "./AddPayment";
import DeleteIcon from '@mui/icons-material/Delete';
import studentPaymentService, { IRegisterPaymentDto } from "../../../services/api/student/studentPayment.service";
import MLoading from "../../molecules/MLoading";
import { format } from "date-fns";

interface RegisterPaymentModalProps {
  open: boolean;
  onClose: () => void;
  onPeriodButtonClick: (period: number) => void;
}

export function RegisterPeriodsPayment({ open, onClose, onPeriodButtonClick }:RegisterPaymentModalProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Selecione o Período</DialogTitle>
      <DialogContent>
        <Button onClick={() => onPeriodButtonClick(1)}>Período 1</Button>
        <Button onClick={() => onPeriodButtonClick(2)}>Período 2</Button>
        <Button onClick={() => onPeriodButtonClick(3)}>Período 3</Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
      </DialogActions>
    </Dialog>
  );
}

interface PaymentInfoModalProps {
  open: boolean;
  onClose: () => void;
  studentId: number;
  periodId: number;
  trash?: boolean;
}

export function PaymentInfoModal({ open, onClose, studentId, periodId, trash = true }: PaymentInfoModalProps) {
  const [paymentData, setPaymentData] = useState<IRegisterPaymentDto[]>([]);
  const [openAddPayment, setOpenAddPayment] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try{
        var listRegister = await studentPaymentService
          .ListRegisters(studentId, periodId)
        setPaymentData(listRegister)

      }catch(error: any){
        console.log(error)
      }finally{
        setLoading(false)
      }
    };
    fetchData();
  }, [open]);

  const handleAddPaymentClick = () => {
    setOpenAddPayment(true)
  };

  const handleClosedPaymentClick = () => {
    setOpenAddPayment(false)
  }; 

  const handlePaymentAdded = (register: IRegisterPaymentDto)=> {
    setPaymentData([...paymentData, register])
  }

  const handleDeleteRegisterPayment = async (id: number) => {
    setLoading(true);
    try{
      await studentPaymentService.DeleteRegister(id);

      setPaymentData(paymentData.filter((payment) => payment.registerPaymentId !== id));
    }catch(error: any){
      console.log(error)
    }finally{
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Informações de Pagamento - Período {periodId}</DialogTitle>
      {loading? <MLoading /> : (
          <DialogContent>
          <TableContainer component={Paper} style={{ maxHeight: "300px" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>Valor</TableCell>
                  <TableCell>Tipo de Pagamento</TableCell>
                  <TableCell>Dia do Pagamento</TableCell>
                  <TableCell>Anexo</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentData.map((payment: IRegisterPaymentDto) => (
                    <TableRow key={payment.registerPaymentId}>
                    <TableCell>R${payment.value.toLocaleString(`pt-br`, { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>{payment.paymentType.type}</TableCell>
                    <TableCell>{payment.paymentAt ? format(new Date(payment.paymentAt), 'yyyy-MM-dd') : ''}</TableCell>
                    <TableCell>
                      {payment.fileNameUrl ? (
                        <a href={payment.fileNameUrl} target="_blank" rel="noopener noreferrer">
                          Ver Anexo
                        </a>
                      ) : (
                        "Nenhum Anexo"
                      )}
                    </TableCell>
                    {trash?                     
                      (<TableCell>
                          <IconButton onClick={()=>handleDeleteRegisterPayment(payment.registerPaymentId)}>
                              <DeleteIcon />
                          </IconButton>
                      </TableCell>) : <></> 
                    }
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      )}

      <DialogActions>
        {trash?         <Button onClick={handleAddPaymentClick} color="primary">
          Adicionar Pagamento
        </Button> : <></>}

        <Button onClick={onClose} color="primary">
          Fechar
        </Button>
      </DialogActions>

      <AddPayment 
        open={openAddPayment} 
        onClose={handleClosedPaymentClick} 
        studentId={studentId}
        periodId={periodId}
        onPaymentAdded={handlePaymentAdded}
      />

    </Dialog>
  );
}
