import {httpMailProvider} from "../../../providers";

//TODO: Add types
class MailService {
    public async getMails() {
        try {
            const endpoint = `api/Email`;
            const response = await httpMailProvider.get<any>( endpoint );

            return response.data;
        } catch ( error ) {
            throw error;
        }
    }

    public async sendCommunication(payload: any) {
        try {
            const endpoint = `api/Email/Communication`;
            const response = await httpMailProvider.post<any>( endpoint, payload );
            return response.status;
        } catch ( error ) {
            throw error;
        }
    }
}

export default new MailService();
