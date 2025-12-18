export interface CandidateInterface {
    id: number;
    firstName: string;
    lastName: string;
    nickname: string;
    status: number;
}

export interface CorrectAnswerInterface {
    id: number;
    text: string;
    createdAt: Date;
    isCorrect: boolean;
    isActive: boolean;
    questionId: number;
}

export interface CandidateAnswerInterface {
    id: number;
    text: string;
    createdAt: Date;
    isActive: boolean;
    questionId: number;
}

export interface QuestionInterface {
    id: number;
    isCandidateAnswersCorrect: boolean,
    text: string;
    correctAnswers: CorrectAnswerInterface[];
    candidateAnswers: CandidateAnswerInterface[];
}

export interface AddressInterface {
    id: number;
    street: string;
    number: number;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    zipCode: number;
    createdAt: Date;
}

export interface EmailInterface {
    id: number;
    emailAddress: string;
    main: boolean;
    createdAt: Date;
}

export interface PhoneInterface {
    id: number;
    countryCode: number;
    areaCode: number;
    phoneNumber: number;
    type: number;
    main: boolean;
    createdAt: Date;
}

export interface ProfileDetailInterface {
    id: number;
    nationalIdentityNumber: string;
    birthDate: Date;
    createdAt: Date;
}

export interface ProfileInterface {
    id: number;
    firstName: string;
    lastName: string;
    nickname: string;
    status: number;
    userAuthId: string;
    addresses: AddressInterface[];
    emails: EmailInterface[];
    phones: PhoneInterface[];
    profileDetail: ProfileDetailInterface;
    createdAt: Date;
    updatedAt: Date;
}

export interface CandidateDetailInterface {
    studentId: number;
    examId: number;
    statusId: number;
    description: string;
    title: string;
    questions: QuestionInterface[];
    profile: ProfileInterface;
}

