import { Module } from '../courses/responses/Course';
import { IManagementLocationState, IAgentLocationState, IStudentClassData } from './class.interfaces';

export interface IHandsOnAttendanceDto {
    moduleId?: number;
    contentId: number;
    studentId: number;
    presence: boolean;
    name?: string;
};

export interface IStudent {
    studentId: number,
    studentName: string,
    attendance?: boolean;
    changedAttendance?: boolean;
};

export interface ITrail {
    id: number;
    name: string;
    modules: Module[];
};

export interface IHandsTrail {
    students: IStudent[];
    className: string;
    trails: ITrail[] | undefined;
    studentClassData?: IStudentClassData;
    managementLocation?: IManagementLocationState;
    agentLocation?: IAgentLocationState;
    navigateBack?: string;
};

export interface IHandsModule {
    students: IStudent[];
    className: string[];
    trailId: number;
    trailName: string;
    modules: Module[];
    classTrails: ITrail[];
    studentClassData?: IStudentClassData;
    managementLocation?: IManagementLocationState;
    agentLocation?: IAgentLocationState;
    navigateBack?: string;
};

export interface IModules {
    moduleId: number;
    orderNumber: number;
    moduleName: string;
    handsOnLink: string | null;
    handsDate: Date;
    dateId: number;
    contentId: number;
    handsOnTypeId: number | null;
    register: boolean;
};

export interface ISelectLists {
    value: string;
    id: number;
}

export interface IHandsPresence {
    className: string;
    classId: number;
    students: IStudent[];
    trailId: number;
    trailName: string;
    modules: Module[];
    moduleId: number;
    moduleName: string;
    date: Date;
    classTrails: ITrail[];
    studentClassData?: IStudentClassData;
    managementLocation?: IManagementLocationState;
    agentLocation?: IAgentLocationState;
    navigateBack?: string;
};

export interface IHandsOnDto {
    studentClassId: number;
    contentHandsOnTrails: ContentHandsOnTrail[];
};
  
export interface ContentHandsOnTrail {
    trailId: number;
    contentHandsOnModules: ContentHandsOnModule[];
};

export interface ContentHandsOnModule {
    moduleId: number;
    subModuleId: number;
    contentId: number;
    link: string | null;
    handsOnTypeId: number | null;
    maxDate: string;
    register: boolean;
};

export interface IHandsOnClass {
    studentClassId: number;
    contentId: number;
    link: string;
    handsOnTypeId: 1 | 2 | null;
};