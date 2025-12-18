import { AssessmentDto } from "../../../interfaces/StudentContents/Responses/Assessments";
import { Assessment } from "../../../interfaces/courses/responses/Course";
import { httpCourseProvider } from "../../../providers";

class ExtraAssessmentService
{
    Update = async (updateAssessment: Assessment) => {
        try{
            await httpCourseProvider.put("assessment", updateAssessment);
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    Delete = async (assessmentId: Number) => {
        try{
            await httpCourseProvider.delete(`assessment/${assessmentId}`);
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };
};

export default new ExtraAssessmentService();
