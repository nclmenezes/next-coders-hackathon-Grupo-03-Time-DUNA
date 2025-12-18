import { httpClassManagementProvider } from "../../../providers";
import { IStudentPeriod, Period, PeriodDetail, StudentPeriodPayment, UpdateStudentPaymentDto } from "./types";


class PeriodService {
    getPeriodosByManagementClassId = async (studentClassManagementId: Number): Promise<IStudentPeriod[]> => {
        try {
            const { data } = await httpClassManagementProvider.get(`studentclass/management/period/${studentClassManagementId}`);
            return data;
        } catch (error) {
            console.error('Error in getPeriodosByManagementClassId:', error);
            throw error;
        }
    };

    getPeriodDetailById = async (studentManegamentePeriodId: Number): Promise<PeriodDetail> => {
        try {
            const { data } = await httpClassManagementProvider.get(`/studentclass/management/period/detail/${studentManegamentePeriodId}`);
            return data;
        } catch (error) {
            console.error('Error in getPeriodDetailById:', error);
            throw error;
        }
    };

    createStudentPayment = async (paymentData: FormData): Promise<StudentPeriodPayment> => {
        try {
            const { data } = await httpClassManagementProvider.post('/studentclass/management/period/payment', paymentData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return data;
        } catch (error) {
            console.error('Error in createStudentPayment:', error);
            throw error;
        }
    };

    updateStudentPayment = async (payment: UpdateStudentPaymentDto): Promise<StudentPeriodPayment> => {
        try {
            const { data } = await httpClassManagementProvider.put('/studentclass/management/period/payment', payment);
            return data;
        } catch (error) {
            console.error('Error in updateStudentPayment:', error);
            throw error;
        }
    };

    deleteStudentPayment = async (id: Number) => {
        try {
            await httpClassManagementProvider.delete(`/studentclass/management/period/payment/${id}`);
        } catch (error) {
            console.error('Error in deleteStudentPayment:', error);
            throw error;
        }
    };

    getStudentPeriod = async (studentId: number): Promise<Period[]> => {
        try {
            const { data } = await httpClassManagementProvider.get(`/student/period/${studentId}`);
            return data;
        } catch (error) {
            console.error('Error in getStudentPeriod:', error);
            throw error;
        }
    };
}

export default new PeriodService();
