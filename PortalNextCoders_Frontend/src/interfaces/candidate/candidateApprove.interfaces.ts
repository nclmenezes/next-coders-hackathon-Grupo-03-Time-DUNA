export interface ICandidateApproveRequest {
    profileId: number;
    studentId: number;
    contractorId: number;
    studentClassReferenceId: number;
    studentEmail: string;
    approveWithoutTest: boolean;
};