import { httpClassManagementProvider } from "../../providers";
import { CreateOrUpdateAgentCoverageDto, AgentDto, ResponsePagination, CreateAgentDto, UpdateAgentDto, AgentCoverageDto } from "../../interfaces/teams/class.interfaces";

class AgentsService {
    async GetAgents(page: number, pageSize: number): Promise<ResponsePagination<AgentDto[]> | null> {
        try {
            const response = await httpClassManagementProvider.get<ResponsePagination<AgentDto[]>>('agent');
            return response.data;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }
    async UpdateAgents(body: UpdateAgentDto): Promise<boolean> {
        try {
            const response = await httpClassManagementProvider.put('agent', body);
            return true;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }
    async CreateAgents(body: CreateAgentDto): Promise<AgentDto | null> {
        try {
            const response = await httpClassManagementProvider.post('agent', body);
            return response.data;
        }
        catch (error) {
            console.error(error);
            return null;
        }
        
    }
    async DeleteAgents(agentId: number): Promise<boolean> {
        try {
            const response = await httpClassManagementProvider.delete(`agent/${agentId}`);
            return true;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }
    async UpdateAgentCoverage(body: CreateOrUpdateAgentCoverageDto): Promise<AgentCoverageDto[] | null> {
        try {
            const response = await httpClassManagementProvider.post('agent/coverage', body);
            return response.data;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }
}

export default new AgentsService();