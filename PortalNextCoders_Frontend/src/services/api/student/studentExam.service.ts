import {httpStudentProvider} from "../../../providers";

export interface AnswerExamQuestionRequest {
    studentId: number;
    questionId: number;
    answerId: number;
    examHeaderId: number;
    examManagementId: number;
}

interface ExamManagements {

    id: number;
    questionId: number;
    answerId?: number;
    examHeaderId: number;
    observation?: string;
    createdBy?: string;
    createdAt?: string;
    updatedBy?: string;
    updatedAt?: string;
}

export interface ExamManagementResponse {
    examHeaderId?: number;
    startAt?: string;
    endAt?: string;
    finishedAt?: string;
    examId?: number;
    studentId: number;
    inspetorId?: number;
    examManagments?: ExamManagements[];
    createdBy?: string;
    createdAt?: string;
    updatedBy?: string;
    updatedAt?: string;
}

export interface Answers {
    answerId: number;
    text: string;
    type: number;
    isCorrect: boolean;
    isActive: boolean;
    questionId: number;
    weight: number;
}

interface ExamQuestion {
    questionId: number;
    text: string;
    imageLink: string;
    type: number;
    level: number;
    weight: number;
    isActive: boolean;
    answers: Answers[];
}

export interface ExamResponse {
    examId: number;
    title: string;
    description: string;
    type: number;
    level: string;
    weight: number;
    limitQuestions: number;
    isActive: boolean;
    timeLimit: number;
    examQuestions: ExamQuestion[];
}

class StudentExamService {
    GetStudentExamAllowed = async (studentId: number): Promise<any> => {
        try {
            const {status} = await httpStudentProvider.get(`candidate/exam/examManagement/allowed/${studentId}`);
            return status;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    CreateExam = async (studentId: number): Promise<any> => {
        try {
            const {status} = await httpStudentProvider.post(`candidate/exam/${studentId}`);
            return status;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    GetExamData = async (): Promise<ExamResponse> => {
        try {
            const {data} = await httpStudentProvider.get(`candidate/exam`);
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    GetStudentExamManagement = async (studentId: number): Promise<ExamManagementResponse | undefined> => {
        try {
            const {data, status} = await httpStudentProvider.get(`candidate/exam/examManagement/${studentId}`);
            return data;
        } catch (error) {
            console.error('Error:', error);
            return undefined;
        }
    }

    AnswerExamQuestion = async (request: AnswerExamQuestionRequest): Promise<any> => {
        try {
            const {data} = await httpStudentProvider.put(`candidate/exam/answerQuestion`, request);
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    FinishExam = async (studentId: number): Promise<any> => {
        try {
            const {data, status} = await httpStudentProvider.put(`candidate/exam/finish/${studentId}`);
            return {data, status}
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
}

export default new StudentExamService();