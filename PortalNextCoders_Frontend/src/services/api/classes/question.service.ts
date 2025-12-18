import { AssessmentDto } from "../../../interfaces/StudentContents/Responses/Assessments";
import { CreateQuestionDto } from "../../../interfaces/courses/requests/CreatesDto";
import { Question } from "../../../interfaces/courses/responses/Course";
import { httpCourseProvider } from "../../../providers";

class QuestionService 
{
    Create = async (createQuestion: CreateQuestionDto): Promise<Question> => {    
        try{
          const { data } = await httpCourseProvider.post("question", createQuestion);
          return data;
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }           
    };

    GetQuestionsByAssessment = async (assessmentId: number): Promise<Question[]> => {    
        try{
          const { data } = await httpCourseProvider.get(`question/${assessmentId}`);
          return data;
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }           
    };

    Update = async (updateQuestion: Question) => {    
        try{
            await httpCourseProvider.put("question", updateQuestion);
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }           
    };     

    Delete = async (questionId: Number) => {    
        try{
          await httpCourseProvider.delete(`question/${questionId}`);
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }           
    };        
};

export default new QuestionService();
