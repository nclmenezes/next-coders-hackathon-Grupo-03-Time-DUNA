import { httpStudentProvider } from "../../providers";
import { ICertificateDto } from "../../interfaces/certificate.interface";

class CertificateService {
    public async getCertificateByStudentId(studentId: number): Promise<ICertificateDto | null> {
        const endpoint = `certificate/student/${studentId}`;
        try {
            const endpointResponse = await httpStudentProvider.get<ICertificateDto>(endpoint);
            return endpointResponse.data; 
        } catch (error) {
            return null;
        };
    };

    public async getCertificateById(certificateId: string): Promise<ICertificateDto | null> {
        const endpoint = `certificate/${certificateId}`;
        try {
            const endpointResponse = await httpStudentProvider.get<ICertificateDto>(endpoint);
            return endpointResponse.data; 
        } catch (error) {
            return null;
        };
    };

    public async createUserCertificate(formData: FormData) {
        try {
            const endpointResponse = await httpStudentProvider.post<ICertificateDto>("certificate", formData);
            return endpointResponse.data; 
        } catch (error) {
            return null;
        };
    };
}

export default new CertificateService();