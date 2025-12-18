import { httpStudentProvider } from "../../providers";
import { IHandsOnAttendanceDto, IHandsOnDto, IHandsOnClass } from "../../interfaces/teams/handsOn.interfaces";

class HandsOnService {
    async getHandsOn(classId: number) {
      try {
        const response = await httpStudentProvider.get<IHandsOnDto[]>(`content/extra/${classId}`);
        if (response.status !== 200) return null;
        return response.data;
      } catch {
        return null;
      }
    };

    async addHandsOnClass(body: IHandsOnClass): Promise<boolean> {
      try {
          await httpStudentProvider.post("content/extra", body);
          return true;
      } catch (error) {
          console.error('Error:', error);
          return false;
      }
    };
  
    async updateHandsOnClass(body: IHandsOnClass): Promise<boolean> {
        try {
            await httpStudentProvider.put("content/extra", body);
            return true;
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    };

    async getHandsOnAttendance(studentList: IHandsOnAttendanceDto[]) {
      try {
        const response = await httpStudentProvider.post<IHandsOnAttendanceDto[]>("content/extra/presence/list", studentList);
        if (response.status !== 200) return [];
        return response.data;
      } catch {
        return [];
      }
    };

    async getHandsOnAttendanceByStudent(studentClassId: number, studentId: number) {
      try {
        const response = await httpStudentProvider.get<IHandsOnAttendanceDto[]>(`content/extra/presence/list/${studentClassId}/${studentId}`);
        if (response.status !== 200) return [];
        return response.data;
      } catch {
        return [];
      }
    };

    async postHandsOnAttendance(studentsAttendance: IHandsOnAttendanceDto[]) {
      try {
        const postData = await httpStudentProvider.post<IHandsOnAttendanceDto[]>("content/extra/presence", studentsAttendance);
        if (postData.status !== 200) return false;
        return true;
      } catch (error) {
        throw error;
      }
    };

    async deleteHandsOnAttendance(studentsAttendance: IHandsOnAttendanceDto[]) {
      try {
        const postData = await httpStudentProvider.post<IHandsOnAttendanceDto[]>("/content/extra/deletar/presence", studentsAttendance);
        if (postData.status !== 200) return false;
        return true;
      } catch (error) {
        throw error;
      }
    };
};

export default new HandsOnService();