export interface StudentSubModuleDetail {
    totalRecords: number;
    totalPages: number;
    results: Class[];
};
  
export interface Class {
    studentClassId: number;
    name: string;
    contractorName: string | null;
    class: string;
    startAt: string;
    endAt: string;
    state: string;
    city: string;
    students: number;
    grade: number;
    attendance: number;
    contractorId: number | null;
    classStudents: Student[];
};

export interface Student {
    studentId: number;
    studentName: string;
    studentGrade: number;
    studentAttendance: number;
    currentSubModule: string;
    lastLogin: string;
    studentPaymentResponses: any;
    subModules: SubModule[];
    modules: Module[];
};

export interface SubModule {
    moduleName: string;
    moduleId: number;
    subModuleModuleName: string;
    isCompleted: boolean;
    subModuleGrade?: number;
    studentAttendance: number;
    subModuleTypeId: number;
    handsOnRegister?: boolean;
    lastDate?: string;
    limitDate: string;
    assessmentId?: number;
    moduleTypeId: number;
    orderNumber?: number;
};

export interface Module {
    moduleName: string;
    moduleId: number;
    subModuleModuleName: string | null;
    isCompleted: boolean;
    subModuleGrade: number;
    studentAttendance: number;
    subModuleTypeId: number;
    handsOnRegister?: boolean;
    lastDate?: string;
    limitDate: string;
    assessmentId?: number;
    moduleTypeId: number | null;
    trailOrder?: number;
    moduleOrder?: number;
};