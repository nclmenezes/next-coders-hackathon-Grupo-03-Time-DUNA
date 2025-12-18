// ---------------------------------------------- Generic ---------------------------------------------- 

export interface CloseTypeDto {
    id: number;
    type: string;
};

interface DefaultEntity {
    createdAt: string;
    createdBy: number;
    updatedAt: string | null;
    updatedBy: number | null;
}

interface WithDeleteEntity extends DefaultEntity {
    isDeleted: boolean;
    deletedAt: string | null;
    deletedBy: number | null;
}

export interface ResponsePagination<T> {
    page: number;
    totalPages: number;
    quantity: number;
    data: T;
}

enum CloseTypes {
    Month = 1,
    Week = 2,
    Period = 3,
}

// ---------------------------------------------- Management Class ---------------------------------------------- 

export interface StudentClassManagementHolidayDto {
    id: number;
    studentClassManagementId: number;
    holidayDate: string;
};

export interface IManagementClassFilter {
    contractorId?: number;
    closeTypeId?: number;
    startAt?: string;
    endAt?: string;
    isActive?: boolean;
    isDeleted?: boolean;
}


interface StudentClassManagementPeriodDto {
    id: number;
    studentClassManagementId: number;
    number: number;
    startAt: string;
    endAt: string;
};

export interface IManagementClass extends WithDeleteEntity {
    id: number;
    contractor: AgentDto;
    closeType: CloseTypeDto;
    name: string;
    classPeriodQuantity: number;
    periodQuantity: number;
    startAt: string;
    endAt: string;
    isActive: boolean;
    studentClasses: IAgentClass[];
    studentClassManagementHolidays: StudentClassManagementHolidayDto[];
    studentClassManagementPeriods: StudentClassManagementPeriodDto[];
};

export interface ICreateManagementClass {
    contractorId: number;
    closeTypeId: CloseTypes;
    name: string;
    classPeriodQuantity: number;
    periodQuantity: number;
    startAt: string;
    endAt: string;
    createdBy: number;
    holidays: string[];
}

export interface IUpdateManagementClass {
    id: number;
    contractorId: number;
    closeTypeId: CloseTypes;
    name: string;
    classPeriodQuantity: number;
    periodQuantity: number;
    startAt: string;
    endAt: string;
    isActive: boolean;
    updatedBy: number;
    isDeleted: boolean;
    holidays: string[];
}

// ---------------------------------------------- Agent Class ---------------------------------------------- 

export interface IAgentClassFilter {
    studentClassManagementId?: number;
    maintainerId?: number;
}


export interface ICreateOrUpdateStudentClassCoverage {
    studentClassId: number;
    nationalFlag: boolean;
    coverages: CoverageDto[];
}

export interface StudentClassScheduler {
    id: number;
    studentClassId: number;
    activityType: ActivityType | null;
    classRoomId: number;
    scheduledAt: string;
};

export interface ICreateStudentClassScheduler extends Omit<StudentClassScheduler, 'id' | 'activityType' | 'scheduleAt'> {
    activityTypeId: number;
    scheduledAt: string;
};

export interface IUpdateStudentClassScheduler extends Omit<StudentClassScheduler, 'studentClassId' | 'activityType' | 'classRoomId' | 'scheduleAt'> {
    scheduledAt: string;
};

export interface StudentClassAverage {
    id: number;
    studentClassId: number;
    activityType: ActivityType;
    average: number;
};

interface ActivityType {
    id: number;
    type: string;
};

export interface StudentClassCoverage {
    id: number;
    studentClassId: number;
    city: string;
    state: string;
};

interface AgentTypeDto {
    id: number;
    type: string;
};

export interface AgentCoverageDto {
    id: number;
    agentId: number;
    city: string;
    state: string;
};

export interface AgentDto extends WithDeleteEntity {
    id: number;
    agentType: AgentTypeDto | null;
    name: string;
    lead: string;
    documentNumber: string;
    mail: string;
    nationalFlag: boolean;
    agentCoverages: AgentCoverageDto[];
};

export enum AgentTypes {
    Contractor = 1,
    Maintainer = 2,
}

export interface CreateAgentDto {
    agentTypeId: AgentTypes;
    name: string;
    lead: string;
    documentNumber: string;
    mail: string;
    createdBy: number;
}

export interface UpdateAgentDto {
    id: number;
    name: string;
    lead: string;
    documentNumber: string;
    mail: string;
    updatedBy: number;
    isDeleted?: boolean;
}

export interface CoverageDto {
    state: string;
    city: string;
}

export interface CreateOrUpdateAgentCoverageDto {
    agentId: number;
    nationalFlag: boolean;
    coverages: CoverageDto[];
}

export interface IStudentClassCertificate {
    id: number;
    studentClassId: number;
    sponsor: string;
    issueAt: string;
};

export interface IAgentClassCertificate extends Omit<IStudentClassCertificate, 'id'> { };

export interface IAgentClass extends WithDeleteEntity {
    id: number;
    studentClassManagementId: number;
    maintainer: AgentDto;
    studentClassReferenceId: number;
    courseId: number;
    name: string;
    description: string;
    nationalFlag: boolean;
    studentQuantity: number;
    studentClassCertificate: IStudentClassCertificate;
    studentClassAverages: StudentClassAverage[];
    studentClassCoverages: StudentClassCoverage[];
    studentClassSchedulers: StudentClassScheduler[];
};

export interface ICreateAgentClass {
    studentClassManagementId: number;
    maintainerId?: number;
    courseId: number;
    name: string;
    description: string;
    nationalFlag: boolean;
    studentQuantity: number;
    createdBy: number;
};

export interface IUpdateAgentClass {
    id: number;
    maintainerId?: number;
    courseId: number;
    name: string;
    description: string;
    updatedBy: number;
    isDeleted: boolean;
    updatedCourse: boolean;
};

// ---------------------------------------------- Student Class (tela antiga de turma) ---------------------------------------------- 

export interface StudentPaymentResponse {
    studentId: number;
    classPeriodId: number;
    periodNumber: number;
    presence: number;
    grade: number;
    monthlyReward: number;
};

export interface ClassStudent {
    studentId: number;
    studentName: string;
    status: number | null;
    studentGrade: number | null;
    studentAttendance: number;
    currentSubModule: string | null;
    lastLogin: string | null;
    studentPaymentResponses: StudentPaymentResponse[];
    subModules: any[] | null;
    modules: any[] | null;
};

export interface IStudentClassData {
    studentClassId: number;
    studentClassManagementName?: string;
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
    classStudents: ClassStudent[];
};

export interface StudentClassListPagination {
    totalRecords: number;
    totalPages: number;
    results: IStudentClassData[];
};

// -------------------------------------------- antigos -------------------------------------------------

export interface IFilteredFields<T> {
    page: number;
    pageSize: number;
    filteredFields: T | null;
};

export interface IAgentClassDates extends IAgentClass {
    startAt: string;
    endAt: string;
};

export interface IAgentLocationState {
    agentClasses: IAgentClass[];
    selectFields: IAgentClassFilter;
    filteredPage: IFilteredFields<IAgentClassFilter>;
};

export interface IManagementLocationState {
    managementClasses: IManagementClass[];
    selectFields: IManagementClassFilter;
    filteredPage: IFilteredFields<IManagementClassFilter>;
};

export interface ILocationState {
    managementLocation?: IManagementLocationState;
    agentLocation?: IAgentLocationState;
    navigateBack?: string;
    studentClassData?: IStudentClassData;
};




// ---------------------------------------------- enum ----------------------------------------------

export enum ActivityTypes {
    Grade = 1,
    Presence = 2,
    HandsOn = 3,
    Mentoring = 4,
};

export interface ActiveStudentClassDto {
    id: number;
    name: string;
    description: string;
    startAt: string;
    endAt: string;
    handsOnSchedule: string | null;
    certificateIssueDate: string | null;
    certificateSponsor: string | null;
    trailId: number;
    trail: any;
    status: number;
    vacancies: number;
    forumLink: string | null;
    createdAt: string;
    updatedAt: string | null;
    students: any;
    contractorCoverageId: number;
    contractorId: number; 
};