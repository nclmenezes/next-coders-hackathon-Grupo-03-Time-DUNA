import { httpStudentProvider } from "../../providers";
import { StudentSubModuleDetail } from "../../interfaces/student/studentModule.interfaces";
import { StudentClassListPagination } from "../../interfaces/teams/class.interfaces";

class TeamsService {
    async getTeamsWithFilters({
        page, trail,
        state,
        city,
        contractor,
      }: any) {
        try {
          const endpoint = `ContractorClasses/Details`;
          const params = {
            page,
            pageSize: 10,
            ...(trail !== "" && { trail }),
            ...(state !== "" && { state }),
            ...(city !== "" && { city }),
            ...(contractor !== "" && { contractor }),
          };

          const response = await httpStudentProvider.get<any>(endpoint, { params });
          return response.data;

        } catch (error) {
          throw error;
        }
    };

    async getTeamById(teamId: number): Promise<StudentClassListPagination | null>  {
      try {
        const studentClassDto = await httpStudentProvider.get<StudentClassListPagination>(`ContractorClasses/StudentsDetails/${teamId}`);
        if (studentClassDto.status !== 200) return null;
        return studentClassDto.data;
      } catch(errorTrace) {
        console.error(errorTrace);
        return null;
      }
    };
    
    async getStudentAcademicCalendar(teamId: number) {
      const { data } = await httpStudentProvider.get(`StudentClasses/studentClassCalendar/${teamId}`);
      return data;
    } ;
    
    async getStudentByTeamId(teamId: number, studentId: number) {
      try {
        const response = await httpStudentProvider.get<StudentSubModuleDetail>(`ContractorClasses/StudentSubModuleDetails/${teamId}/${studentId}`);
        if (response.status !== 200) return null;
        return response.data;
      } catch {
        console.error("Failed to get student submodule details!");
        return null;
      };
    };
}

export default new TeamsService();