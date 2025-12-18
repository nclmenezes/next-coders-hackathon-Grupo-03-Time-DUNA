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

class StudentCourseExtraService 
{
    RegistrationInExtraCourse = async (courseId: number, studentId: number): Promise<boolean> => {
      try {
        const payload = {
          extraCourseId: courseId,
          studentId: studentId
        }; 
        var response = await httpStudentProvider.post('student/extra/course', payload);
        return response.status === 201;
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    };

    GetExtraCourse = async (id: number): Promise<ClassDto> => {
      try{
        const { data }  = await httpStudentProvider.get(`student/extra/course/${id}`);
        return data;
      }catch (error) {
        console.error('Error:', error);
        throw error;
      }
    };

};

export default new StudentCourseExtraService();
