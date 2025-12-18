import { httpClassManagementProvider } from "../../../providers";
import { CloseTypeDto, AgentDto, ResponsePagination } from "../../../interfaces/teams/class.interfaces";

class GenericService {
    async GetCloseTypes(): Promise<CloseTypeDto[] | null> {
        try {
            const response = await httpClassManagementProvider.get('studentclass/close/type');
            return response.data;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }
    async GetAgents(): Promise<ResponsePagination<AgentDto[]> | null> {
        try {
            const response = await httpClassManagementProvider.get('agent');
            return response.data;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }
}

export default new GenericService();