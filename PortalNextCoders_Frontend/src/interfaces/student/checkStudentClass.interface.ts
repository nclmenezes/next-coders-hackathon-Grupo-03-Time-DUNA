interface IContractorManagementDto {
    studentClassManagementId: number;
    studentClassId: number;
};

export interface IStudentClassCheckDto {
    studentId: number;
    studentClassReferenceId: number;
    contractorManagement: IContractorManagementDto | null;
};