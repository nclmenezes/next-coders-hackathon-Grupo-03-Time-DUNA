export interface IStudentPeriod {
    id: number;
    studentClassManagementId: number;
    number: number;
    periodTypeId: number;
    startAt: string;
    endAt: string;
    studentPeriodAverages: any[];
    studentPeriodPayments: any[];
    studentPeriodRewards: any[];
}

export interface CreateStudentPaymentDto {
    studentId: number;
    studentClassId: number;
    studentClassManagementPeriodId: number;
    paymentTypeId: number;
    filePayment: File | undefined;
    value: number;
    createdBy: number;
}

export interface UpdateStudentPaymentDto {
    id: number;
    paymentTypeId: number;
    value: number;
    paymentAt: string | undefined;
    updatedBy: number;
}

export interface ActivityType {
    id: number;
    type: string;
}

export interface StudentPeriodAverage {
    id: number;
    studentId: number;
    activityType: ActivityType;
    average: number;
}

export interface PaymentType {
    id: number;
    type: string;
}

export interface StudentPeriodPayment {
    id: number;
    studentId: number;
    studentClassId: number;
    studentClassManagementPeriodId: number;
    paymentType: PaymentType;
    fileName: string;
    fileNameUrl: string;
    value: number;
    paymentAt: string | undefined;
    createdAt: string;
    createdBy: number;
    updatedAt?: string;
    updatedBy?: number;
}

export interface StudentDetail {
    studentId: number;
    studentClassId: number;
    name: string;
    reward: number;
    studentPeriodAverages: StudentPeriodAverage[];
    studentPeriodPayments: StudentPeriodPayment[];
}

export interface PeriodDetail {
    id: number;
    number: number;
    startAt: string;
    endAt: string;
    studentDetails: StudentDetail[];
}

export interface Period{
    id: number;
    studentClassManagementPeriodId: number;
    number: number;
    startAt: string;
    endAt: string;
    studentDetails: StudentDetail[]
}

export interface StudentDetail {
    studentId: number;
    studentClassId: number;
    name: string;
    reward: number;
    studentPeriodAverages: StudentPeriodAverage[];
    studentPeriodPayments: StudentPeriodPayment[];
}