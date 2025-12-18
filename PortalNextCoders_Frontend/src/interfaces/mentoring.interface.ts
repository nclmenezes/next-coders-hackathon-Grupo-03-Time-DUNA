import { IManagementLocationState, IAgentLocationState, IStudentClassData } from "./teams/class.interfaces";

export interface IMentoringDto {
    id: number;
    studentClassId: number;
    periodId: number;
    name: string;
};

export interface IStudent {
    studentId: number;
    studentName: string;
    asyncConfirm: boolean | null;
    syncConfirm: boolean | null;
    changedSyncAttendance: boolean;
    changedAsyncAttendance: boolean;
};

export interface IAttendanceDto {
    id?: number | null;
    mentoringId: number;
    name?: string;
    studentId: number;
    asyncConfirm: boolean | null;
    syncConfirm: boolean | null;
};

export interface IClassData {
    students: IStudent[];
    className: string;
    startDate: string;
    endDate: string;
    studentClassData?: IStudentClassData;
    managementLocation?: IManagementLocationState;
    agentLocation?: IAgentLocationState;
    navigateBack?: string;
};

export interface IPeriod {
    id: number;
    name: string;
};