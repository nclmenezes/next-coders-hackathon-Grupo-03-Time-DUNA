import { httpClassManagementProvider } from "../../providers";
import { IAgentClassCertificate, IStudentClassCertificate} from "../../interfaces/teams/class.interfaces";

class CertificateService {
    async UpdateCertificate(body: IAgentClassCertificate): Promise<IStudentClassCertificate | null> {
        try {
            const response = await httpClassManagementProvider.put('studentclass/certificate', body);
            return response.data;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }
    async CreateCertificate(body: IAgentClassCertificate): Promise<IStudentClassCertificate | null> {
        try {
            const response = await httpClassManagementProvider.post('studentclass/certificate', body);
            return response.data;
        }
        catch (error) {
            console.error(error);
            return null;
        }
        
    }
    async DeleteCertificate(studentClassId: number): Promise<boolean> {
        try {
            const response = await httpClassManagementProvider.delete(`studentclass/certificate/${studentClassId}`);
            return true;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }

}

export default new CertificateService();