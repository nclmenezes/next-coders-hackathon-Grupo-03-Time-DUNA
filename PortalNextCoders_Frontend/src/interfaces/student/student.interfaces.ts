export interface ISurveyResponse {
    totalRecords: number;
    totalPages: number;
    results: ISurveyStudentResponse[];
}
export interface ISurveyStudentResponse {
    firstName: string;
    lastName: string;
    socialName: string;
    studentId: number;
    studentClassId: number;
    studentClassName: string;
    trailName: string;
    trailId: number;
    questionId: number;
    question: string;
    answered: string | null;
    response: string | null;
    
}
export interface IProvince {
    id: number;
    nome: string;
    sigla: string;
}

export interface ICity {
    id: number;
    nome: string;
}

export interface ICityResponse {
    studentClassId?: number;
    contractorId: number;
    cityId: string;
    stateId: string;
    nationalFlag: boolean;
}

export interface ISection {
    isAllowed: boolean;
    sectionId: number;
    sectionTitle: string;
    studentProgress: number;
    timeDuration: number;
}

export interface ISubModule {
    isAllowed: boolean;
    sections: ISection[];
    studentProgress: number;
    subModuleId: number;
    subModuleTitle: string;
    timeDuration: number;
}

export interface IModule {
    moduleId: number;
    moduleTitle: string;
    moduleDescription: string;
    timeDuration: number;
    studentProgress: number;
    subModules: ISubModule[];
}

export interface IStudentCompleteProgress {
    trailId: number;
    trailTitle: string;
    trailDescription: string;
    trailStartDate: Date | string;
    trailEndDate: Date | string;
    timeDuration: number;
    studentProgress: number;
    currentSectionId: number;
    modules: IModule[];
}

export interface IStudentProgress {
    trailId: string | number;
    trailTitle: string;
    trailDescription: string;
    trailStartDate: Date | string;
    trailEndDate: Date | string;
    timeDuration: number;
    studentProgress: number;
    currentSectionId: number;
}

export interface IFinishContentResponse {
    nextContentId: number;
    nextContentType: string;
    status: string;
}

export interface IClassLive {
    message: string
    content: Content
}

export interface Content {
    contentId: number
    name: string
    description: string
    type: number
    link: string
    isRequired: boolean
    studentClassId: number
    eventDate: string
    createdAt: string
    createdBy: string
    updatedAt: string
    updatedBy: string
    isDeleted: boolean
    deletedAt: string
    deletedBy: string
}

export type IClassLate = {
    AssessmentId: number,
    AssessmentDescription: string,
    DaysLate: number,
    IsLate: boolean
}

export type IContractor = {
    contractorId: number;
    name: string;
    lead: string;
    documentNumber: string;
    mail: string;
    userAuthId: string;
    isActive: boolean;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    isDeleted: boolean;
    deletedAt: string;
    deletedBy: string;
}