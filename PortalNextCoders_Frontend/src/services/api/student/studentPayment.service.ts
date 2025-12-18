import { StudentPaymentDto } from "../../../interfaces/StudentContents/Responses/Student";
import { httpStudentProvider } from "../../../providers";


export interface ICreateRegisterPaymentDto{
    studentId: number;
    periodNumber: number;
    paymentTypeId: number;
    value: number;
    paymentAt: string | null;
    file: File | null;
}

interface PaymentTypeDto {
    id: number;
    type: string;
}

export interface IRegisterPaymentDto{
    registerPaymentId: number;
    studentPaymentId: number;
    paymentType: PaymentTypeDto;
    fileName: string;
    fileNameUrl: string;
    value: number;
    paymentAt: string;
    createdBy: string;
    createdAt: Date;
    updatedBy: string;
    updatedAt: Date;
}

class StudentPaymetService 
{
    GetStudentPayment = async (): Promise<StudentPaymentDto[]> => {    
        try{
            const { data } = await httpStudentProvider.get(`student/payment`);
            return data;
        }catch (error) {
            throw error;
        }          
    };
    
    InsertRegister = async (create: ICreateRegisterPaymentDto): Promise<IRegisterPaymentDto> => {    
        try {
            const formData = new FormData();
            formData.append('studentId', create.studentId.toString());
            formData.append('periodNumber', create.periodNumber.toString());
            formData.append('paymentTypeId', create.paymentTypeId.toString());
            formData.append('paymentAt', create.paymentAt!);
            formData.append('value', create.value.toString());
            formData.append('file', create.file!);
            const { data } = await httpStudentProvider.post(`student/payment/register`, formData);
            return data;
        } catch (error) {
            throw error;
        }          
    };    

    ListRegisters = async (studentId: number, periodId: Number): Promise<IRegisterPaymentDto[]> => {    
        try{
            const { data } = await httpStudentProvider.get(`student/payment/register/${studentId}/${periodId}`);
            return data;
        }catch (error) {
            throw error;
        }          
    };    

    DeleteRegister = async (registerPaymentId: number) => {    
        try{
            await httpStudentProvider.delete(`student/payment/register/${registerPaymentId}`);
        }catch (error) {
            throw error;
        }          
    };      
};

export default new StudentPaymetService();


