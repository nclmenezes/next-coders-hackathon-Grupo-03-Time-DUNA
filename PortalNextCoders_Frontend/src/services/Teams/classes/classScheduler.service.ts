import { httpClassManagementProvider } from "../../../providers";
import {
    ICreateStudentClassScheduler,
    IUpdateStudentClassScheduler,
    StudentClassScheduler
} from "../../../interfaces/teams/class.interfaces";

class ClassSchedulerService {
    async UpdateSchedule(body: IUpdateStudentClassScheduler): Promise<StudentClassScheduler | null> {
        try {
            const response = await httpClassManagementProvider.put<StudentClassScheduler>('studentclass/scheduler', body);
            return response.data;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }
    async CreateSchedule(body: ICreateStudentClassScheduler): Promise<StudentClassScheduler | null> {
        try {
            const response = await httpClassManagementProvider.post<StudentClassScheduler>('studentclass/scheduler', body);
            return response.data;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }
    async DeleteSchedule(id: number): Promise<boolean> {
        try {
            const response = await httpClassManagementProvider.delete(`studentclass/scheduler/${id}`);
            if (response.status !== 200) return false;
            return true;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }
}

export default new ClassSchedulerService();