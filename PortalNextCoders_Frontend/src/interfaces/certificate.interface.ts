import { IUser } from "../context/AuthProvider/types";

export interface ICertificateDetails {
    courseName: string;
    issueDate: string;
    contractorName: string;
    signatureLocation: string;
};

export interface ICertificateProps {
    userInfo: IUser,
    certificateDetails: ICertificateDetails | undefined,
};

export interface ICertificateDto {
    certificateId: string;
    studentId: number;
    courseName: string;
    issueDate: string;
    organizationId: number;
    url: string;
};