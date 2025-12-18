import axios from "axios";
import { httpStudentProvider } from "../../providers";
import {
    IStudentTransferHistoryDto,
    IStudentTransferTraceDto
} from "../../interfaces/student/studentTransfer.interfaces";

class StudentTransferService {
    public async GetStudentClassTransferHistory(studentClassId: number): Promise<IStudentTransferHistoryDto[] | null> {
        try {
            const transferHistoryResponse = await httpStudentProvider.get(`studentTransfer/${studentClassId}`);
            if (transferHistoryResponse.status !== 200) throw new Error(`Unexpected status code: ${transferHistoryResponse.status}`);
            return transferHistoryResponse.data;
        }
        catch(error) {
            if (axios.isAxiosError(error) && error.response?.status === 404 ) return [];
            console.log(error);
            return null;
        };
    };

    public async PostStudentsTransfer(studentsTransferTrace: IStudentTransferTraceDto[]): Promise<boolean> {
        try {
            const studentsTransferResponse = await httpStudentProvider.put("studentTransfer", studentsTransferTrace);
            if (studentsTransferResponse.status !== 204) throw new Error(`Unexpected status code: ${studentsTransferResponse.status}`);
            return true;
        }
        catch(error) {
            console.log(error);
            return false;
        };
    };
};

export default new StudentTransferService();