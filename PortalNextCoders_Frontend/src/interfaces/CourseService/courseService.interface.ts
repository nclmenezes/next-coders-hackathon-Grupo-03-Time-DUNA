export interface IModuleClassRequest {
    StudentClassId: number;
    ModuleId: number;
};

export interface IContentClass {
    contentId: number;
    contentType: number;
    assessmentId?: number;
    contentName: string;
    contentDescription?: string;
    contentLink?: string;
    contentLinkDescription?: string;
    contentDuration: number;
    contentOrderNumber: number;
    finishAt: string;
};

export interface ISubModuleClass {
    subModuleId: number;
    subModuleTypeId: number;
    subModuleName: string;
    subModuleDuration: number;
    subModuleOrderNumber: number;
    contents: IContentClass[];
};

export interface IModuleClass {
    studentClassId: number;
    studentId: number;
    trailId?: number;
    trailName?: string;
    moduleId: number;
    moduleName?: string;
    moduleOrderNumber?: number;
    limitDate: string;
    subModules: ISubModuleClass[];
};