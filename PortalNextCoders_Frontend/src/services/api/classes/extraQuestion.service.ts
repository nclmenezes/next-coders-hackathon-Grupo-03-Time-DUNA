import {CreateQuestionDto} from "../../../interfaces/courses/requests/CreatesDto";
import {Question} from "../../../interfaces/courses/responses/Course";
import {httpCourseProvider} from "../../../providers";

class ExtraQuestionService {
    Create = async (createQuestion: CreateQuestionDto): Promise<Question> => {
        try {
            const {data} = await httpCourseProvider.post("extraQuestion", createQuestion);
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    GetQuestionsByAssessment = async (assessmentId: number): Promise<Question[]> => {
        try {
            const {data} = await httpCourseProvider.get(`extraQuestion/${assessmentId}`);
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    Update = async (updateQuestion: Question) => {
        try {
            await httpCourseProvider.put("extraQuestion", updateQuestion);
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    Delete = async (questionId: Number) => {
        try {
            await httpCourseProvider.delete(`extraQuestion/${questionId}`);
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };
};

export default new ExtraQuestionService();
