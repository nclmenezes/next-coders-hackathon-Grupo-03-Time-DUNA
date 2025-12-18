import { Class, Module } from "../../interfaces/student/studentModule.interfaces";
export interface TStudentTeamModuleDetailPage {
    studentModulesData?: Module[];
    classInfoData?: Class;
    totalPagesData?: number;
    isFromNewApi?: {
        studentClassManagementId: number;
        studentClassId: number;
    };
};