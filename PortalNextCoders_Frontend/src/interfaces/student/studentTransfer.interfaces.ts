import { IStudentClassData, ClassStudent } from "../teams/class.interfaces";

export interface IStudentClassTrace {
    studentManagementClassId: number;
    studentAgentClassId: number;
    studentReferenceId: number;
};

export interface IStudentTransferDto extends ClassStudent {
    isChecked: boolean;
    incomingTransfer: boolean;
    originClass: IStudentClassTrace;
    destinationClass: IStudentClassTrace | null;
};

export type ListOptions = 'transfer' | 'info' | 'history';

export type StudentClassCache = { [studentClassId: string]: IStudentClassData };

export interface IStudentTransferHistoryDto {
    studentClassId: number;
    transferHistoryId: number;
    studentId: number;
    studentName: string;
    studentClassOriginId: number;
    studentClassOriginName: string;
    studentClassDestinationId: number;
    studentClassDestinationName: string;
    transferedAt: string;
};

export interface IStudentTransferTraceDto {
    studentClassOriginId: number;
    studentClassDestinationId: number;
    studentId: number;
};