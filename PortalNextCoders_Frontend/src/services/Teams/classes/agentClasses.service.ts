import { httpClassManagementProvider } from "../../../providers";
import {
    IAgentClass,
    ICreateAgentClass,
    IUpdateAgentClass,
    ResponsePagination,
    IAgentClassFilter,
    ICreateOrUpdateStudentClassCoverage
} from "../../../interfaces/teams/class.interfaces";

class AgentClassesService {
    async GetAgentClasses(
        page: number,
        pageSize: number,
        classFilter: IAgentClassFilter | null
    ): Promise<ResponsePagination<IAgentClass[]> | null> {
        try {
            let url = `studentclass/${page}/${pageSize}`;

            if (classFilter) {
                const queryParams = new URLSearchParams();

                Object.keys(classFilter).forEach(key => {
                    const value = (classFilter as any)[key];
                    if (value !== undefined && value !== null) {
                        queryParams.append(key, String(value));
                    };
                });

                const queryString = queryParams.toString();
                if (queryString) url += `?${queryString}`;
            };

            const response = await httpClassManagementProvider.get<ResponsePagination<IAgentClass[]>>(url);
            if (response.status < 200 || response.status >= 300) return null;
            return response.data;
        }
        catch (error) {
            console.error(error);
            return null;
        };
    };

    async GetAgentClassById(
        id: number
    ): Promise<IAgentClass | null> {
        try {
            const response = await httpClassManagementProvider.get<IAgentClass>(`studentclass/${id}`);
            if (response.status !== 200) return null;
            return response.data;
        }
        catch (error) {
            console.error(error);
            return null;
        };
    };

    async UpdateAgentClasses(body: IUpdateAgentClass): Promise<IAgentClass | null> {
        try {
            const response = await httpClassManagementProvider.put('studentclass', body);
            return response.data;
        }
        catch (error) {
            console.error(error);
            return null;
        };
    }

    async CreateAgentClasses(body: ICreateAgentClass): Promise<IAgentClass | null> {
        try {
            const response = await httpClassManagementProvider.post('studentclass', body);
            if (response.status !== 200) return null;
            return response.data;
        }
        catch (error) {
            console.error(error);
            return null;
        };
    };

    async DeleteAgentClasses(studentClassId: number): Promise<boolean> {
        try {
            const response = await httpClassManagementProvider.delete(`studentclass/${studentClassId}`);
            return response.status === 200;
        }
        catch (error) {
            console.error(error);
            return false;
        };
    };

    async DeleteOrUpdateAgentClassCoverage(body: ICreateOrUpdateStudentClassCoverage): Promise<boolean> {
        try {
            const response = await httpClassManagementProvider.post(`studentclass/coverage`, body);
            return response.status === 200;
        }
        catch (error) {
            console.error(error);
            return false;
        };
    };
};
export default new AgentClassesService();