import { httpCandidateClassProvider } from "../../providers";
import { ICandidateApproveRequest } from "../../interfaces/candidate/candidateApprove.interfaces";

class CandidateApprovalService {
    async ApproveCandidate(candidateApproveRequest: ICandidateApproveRequest): Promise<ICandidateApproveRequest | null> {
        try {
            const approveResponse = await httpCandidateClassProvider.post<ICandidateApproveRequest>(`studentApprove`, candidateApproveRequest);
            if (approveResponse.status !== 200) return null;
            return approveResponse.data;
        }
        catch (error) {
            console.error(error);
            return null;
        };
    };
};
export default new CandidateApprovalService();