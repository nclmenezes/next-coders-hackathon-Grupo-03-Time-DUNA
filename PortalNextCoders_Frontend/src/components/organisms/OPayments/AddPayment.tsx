import { Button, Dialog, DialogActions, DialogTitle, MenuItem, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import studentPaymentService, { ICreateRegisterPaymentDto, IRegisterPaymentDto } from "../../../services/api/student/studentPayment.service";
import MLoading from "../../molecules/MLoading";
import DatePicker, { Value } from "react-multi-date-picker";
import { formatISO, parse } from "date-fns";

interface AddPaymentModalProps {
  open: boolean;
  onClose: () => void;
  studentId: number;
  periodId: number;
  onPaymentAdded: (register:IRegisterPaymentDto) => void;
}

const paymentTypes = [
  { id: 1, type: "Bolsa" },
  { id: 2, type: "Bonificação" },
];
const inputFormat = 'yyyy/MM/dd';

export function AddPayment({ open, onClose, studentId, periodId, onPaymentAdded  }: AddPaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [paymentAt, setPaymentAt] = useState<Value>();
  const [formData, setFormData] = useState<ICreateRegisterPaymentDto>({
    studentId: studentId,
    periodNumber: periodId,
    paymentTypeId: 0,
    value: 0,
    paymentAt: null,
    file: null,
  });

  useEffect(() => {
    if (open) {
      setFormData({
        studentId: studentId,
        periodNumber: periodId,
        paymentTypeId: 0,
        value: 0,
        paymentAt: null,
        file: null,
      });
    }
  }, [open, studentId, periodId]);  

  const handleAddPaymentClick = async () => {
    setLoading(true);
    try{
      formData.paymentAt = formatISO(parse(paymentAt!.toString(), inputFormat, new Date()));
      const data = await studentPaymentService.InsertRegister(formData);
      onPaymentAdded(data);
      onClose();
    }
    catch(error: any){
      console.log(error)
    }
    finally{
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setFormData({
        ...formData,
        file: file,
      });
    }
  };


  const handleValueChange = (value: string) => {
    const floatValue = parseFloat(value);
    
    if (!isNaN(floatValue)) {
      setFormData({
        ...formData,
        value: floatValue,
      });
    } else {
      setFormData({
        ...formData,
        value: 0,
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" style={{ margin: "auto" }}>
      <DialogTitle>Adicionar novo pagamento</DialogTitle>
      {loading? <MLoading/> : (
        <form style={{ margin: "0 16px" }}>

          <Typography sx={{fontFamily: 'Inter', fontWeight: 500, marginBottom:1}}>
                        Selecione a data de pagamento
            </Typography>              
            <DatePicker
              title="Data do pagamento"
              onChange={setPaymentAt}
            />   

          <TextField
            label="Tipo de Pagamento"
            select
            fullWidth
            sx={{ marginTop: 2, marginBottom: 2 }}	
            required
            value={formData.paymentTypeId}
            onChange={(e) =>
              setFormData({
                ...formData,
                paymentTypeId: parseInt(e.target.value, 10),
              })
            }
          >
            {paymentTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.type}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Valor do pagamento"
            fullWidth
            type="number"
            value={formData.value || ""}
            sx={{ marginBottom: 2 }}
            onChange={(e) => handleValueChange(e.target.value)}
          />

          <TextField
            fullWidth
            type="file"
            onChange={handleFileChange}
            sx={{ marginBottom: 4 }}
          />       
        </form>
      )}

      <DialogActions style={{ margin: "16px" }}>
        <Button onClick={handleAddPaymentClick}>Criar</Button>
        <Button onClick={onClose}>Cancelar</Button>
      </DialogActions>
    </Dialog>
  );
}