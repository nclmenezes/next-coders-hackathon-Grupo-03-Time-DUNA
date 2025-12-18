import { ClassDto } from "../../../interfaces/StudentContents/Responses/Classes";
import { httpStudentProvider } from "../../../providers";

export interface TrialDto {
  questionId: number;
  questionText: string;
  answers: TrialAnswerDto[];
}

export interface TrialAnswerDto{
  answerId: number;
  answerText: string;
  isCorrect: boolean;
  studentAnswer: boolean;
}

class StudentCourseService 
{
    GetClasses = async (): Promise<ClassDto> => {
      try{
        const { data } = await httpStudentProvider.get(`student/course`);
        return data;
      }catch (error) {
        console.error('Error:', error);
        throw error;
      }
    };

    GetLastContentByTrailId = async (trailId: number): Promise<number> => {
      try{
        const { data } = await httpStudentProvider.get(`student/course/${trailId}`);
        return data.contentId;
      }catch (error) {
        console.error('Error:', error);
        throw error;
      }
    };    

    GetTrialStudent = async (assessmentId: number, studentId: number): Promise<TrialDto[]> => {
      try{
        const { data } = 
          await httpStudentProvider
            .get(`student/course/questions/${assessmentId}/${studentId}`);
        return data;
      }catch (error) {
        console.error('Error:', error);
        throw error;
      }
    };    
};

export default new StudentCourseService();
