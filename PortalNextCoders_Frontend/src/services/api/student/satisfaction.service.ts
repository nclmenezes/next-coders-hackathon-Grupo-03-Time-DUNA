import { ClassDto, SubModuleDto } from "../../../interfaces/StudentContents/Responses/Classes";
import { httpStudentProvider } from "../../../providers";

export interface SatisfactionQuestion {
  satisfactionQuestionTrailId: number;
  trailId: number;
  satisfactionQuestionTypeId: number;
  satisfactionQuestionType: number;
  question: string;
}

export interface SatisfactionResponse {
  satisfactionQuestionTrailId: number;
  studentId: number;
  answered: boolean;
  response: string;
}

export interface CheckStudentResponses {
  answered: boolean;
  trailId: number;
}

class SatisfactionService {

  getQuestions = async (trailId: number): Promise<SatisfactionQuestion[]> => {
    try{
      const { data } = await httpStudentProvider.get(`student/satisfaction/${trailId}`);
      return data;
    }catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  insertResponses = async (satisfactionResponses: SatisfactionResponse[]): Promise<string> => {
    try{
      const { data } = await httpStudentProvider.post(`student/satisfaction`, Object.values(satisfactionResponses));
      return data;
    }catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }; 
  
  getStudentResponses = async (trailIds: number[], studentId: number): Promise<CheckStudentResponses[]> => {
    try{
      let params = new URLSearchParams();
      trailIds.forEach(id => params.append('trailIds', id.toString()));
      params.append('studentId', studentId.toString());
  
      const { data } = await httpStudentProvider.get(`student/satisfaction?${params.toString()}`);
      return data;
    }catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };  
}

export default new SatisfactionService();
