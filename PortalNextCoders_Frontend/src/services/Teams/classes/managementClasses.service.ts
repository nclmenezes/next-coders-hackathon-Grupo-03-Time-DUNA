import { httpClassManagementProvider } from "../../../providers";
import {
    IManagementClass,
    IUpdateManagementClass,
    ICreateManagementClass,
    ResponsePagination,
    IManagementClassFilter
} from "../../../interfaces/teams/class.interfaces";

class ManagementClassesService {
    async GetManagementClasses(
        page: number,
        pageSize: number,
        classFilter: IManagementClassFilter | null
    ): Promise<ResponsePagination<IManagementClass[]> | null> {
        try {
            let url = `studentclass/management/${page}/${pageSize}`;

            if (classFilter) {
                const queryParams = new URLSearchParams();
                Object.keys(classFilter).forEach(key => {
                    const value = (classFilter as any)[key];
                    if (value !== undefined && value !== null) queryParams.append(key, String(value));
                });
                const queryString = queryParams.toString();
                if (queryString) url += `?${queryString}`;
            };

            const response = await httpClassManagementProvider.get<ResponsePagination<IManagementClass[]>>(url);
            return response.data;
        }
        catch (error) {
            console.error(error);
            return null;
        };
    };

    async GetManagementClassById(
        id: number
    ): Promise<IManagementClass | null> {
        try {
            const response = await httpClassManagementProvider
                .get<IManagementClass>(`studentclass/management/${id}`);
            return response.data;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }

    async UpdateManagementClasses(body: IUpdateManagementClass): Promise<IManagementClass | null> {
        try {
            const response = await httpClassManagementProvider.put('studentclass/management', body);
            return response.data;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }
    async CreateManagementClasses(body: ICreateManagementClass): Promise<IManagementClass | null> {
        try {
            const response = await httpClassManagementProvider.post<IManagementClass>('studentclass/management', body);
            return response.data;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }
    async DeleteManagementClasses(studentClassManagementId: number): Promise<boolean> {
        try {
            const response = await httpClassManagementProvider.delete(`studentclass/management/${studentClassManagementId}`);
            if (response.status < 200 || response.status >= 300) return false;
            return true;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }
}

export default new ManagementClassesService();