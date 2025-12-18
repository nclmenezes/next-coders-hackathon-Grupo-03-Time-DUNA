import { httpSurveyProvider } from "../../../providers";

class ExamService 
{
    async getExamCandidateManagmentByProfileId(profileId: Number, typeExam: string | null = null) {      
        let url = `ExamManagments/GetExamCandidateManagmentByProfileId/${profileId}`;
        if (typeExam !== null) {
            url += `?typeExam=${typeExam}`;
        }
        return await httpSurveyProvider.get(url);
    }
    
    
};

export default new ExamService();