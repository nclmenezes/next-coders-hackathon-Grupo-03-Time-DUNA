import { SaveAssessmentDto } from "../../../interfaces/StudentContents/Requests/AssessmentRequest";
import { AssessmentDto, ResultQuestionDto } from "../../../interfaces/StudentContents/Responses/Assessments";
import { httpStudentProvider } from "../../../providers";

class AssessmentExtraService 
{
    SaveStudentExtraAssessment = async (dataAssessment: SaveAssessmentDto): Promise<boolean> => {
      try {  
        const postResult = await httpStudentProvider.post('student/extra/assessment', dataAssessment) ;
        return postResult.status === 204;
      } catch (error) {
        console.error('Error:', error);
        return false;
      };
    };

    GetStudentExtraAssessment = async (assessmentId: number): Promise<AssessmentDto> => {    
      try{
        const { data } = await httpStudentProvider.get(`/student/extra/assessment/${assessmentId}`);
        return data;
      }catch (error) {
          console.error('Error:', error);
          throw error;
      }           
  };

    GetStudentExtraAnswers = async (assessmentId: number, subModuleId: number): Promise<ResultQuestionDto> => {
      try {  
        const { data } = await httpStudentProvider.get(`student/extra/assessment/answers/${assessmentId}/${subModuleId}`) 
        return data;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    }    
};

export default new AssessmentExtraService();
