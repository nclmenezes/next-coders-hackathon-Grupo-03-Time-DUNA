import { SaveAssessmentDto } from "../../../interfaces/StudentContents/Requests/AssessmentRequest";
import { AssessmentDto, ResultQuestionDto } from "../../../interfaces/StudentContents/Responses/Assessments";
import { httpAccountProvider } from "../../../providers";

class CandidateService 
{
    UpdateStatus = async (candidateId: number, candidateStatusId: number) => {
      try {  
        await httpAccountProvider.patch(`candidate/status/${candidateId}/${candidateStatusId}`) 
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    } 
};

export default new CandidateService();
