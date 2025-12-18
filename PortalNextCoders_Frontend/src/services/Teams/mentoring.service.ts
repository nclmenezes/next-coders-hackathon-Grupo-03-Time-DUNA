import { httpStudentProvider } from "../../providers";
import { IMentoringDto, IAttendanceDto } from "../../interfaces/mentoring.interface";

class MentoringService {
    async getMentoringByPeriod(studentClassId: number, periodId: number) : Promise<IMentoringDto[]> {
      try {
        const response = await httpStudentProvider.get<IMentoringDto[]>(`Content/extra/mentoring/${studentClassId}/${periodId}`);
        if (response.status !== 200) return [];
        return response.data;
      } catch {
        return [];
      };
    } 
    
    async sendMentoringAttendance(attendanceList: IAttendanceDto[]) {
      try {
        const response = await httpStudentProvider.post(`Content/extra/mentoring/presence`, attendanceList);
        if (response.status !== 201) return [];
        return response.data;
      } catch {
        return [];
      };
    }
    
    async getMentoringAttendance(mentoringId: number) {
      try {
        const response = await httpStudentProvider.get<IAttendanceDto[]>(`content/extra/mentoring/${mentoringId}`);
        if (response.status !== 200) return [];
        return response.data;
      } catch {
        return [];
      }
    };

    async getMentoringAttendanceByStudentAndPeriodId(studentClassId: number, studentId: number, periodId: number) {
      try {
        const response = await httpStudentProvider.get<IAttendanceDto[]>(`/content/extra/mentoring/${studentClassId}/${periodId}/${studentId}`);
        if (response.status !== 200) return [];
        return response.data;
      } catch {
        return [];
      }
    };
}

export default new MentoringService();