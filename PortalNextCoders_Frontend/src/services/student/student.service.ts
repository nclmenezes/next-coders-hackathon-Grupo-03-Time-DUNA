import {
    Content,
    IClassLate,
    IClassLive,
    IContractor,
    IStudentCompleteProgress,
    IStudentProgress, ISurveyResponse,
} from "../../interfaces/student/student.interfaces";
import {
    IContent,
    IContentProgress,
} from "../../interfaces/student/content.interfaces";

import { httpStudentProvider } from "../../providers";
import { ActiveStudentClassDto } from "../../interfaces/teams/class.interfaces";

export interface StudentClassCreateRequest{
    name: string
    description: string
    startAt: string
    endAt: string
    handsOnSchedule: string
    certificateIssueDate: string
    certificateSponsor: string
    trailId: number
    status: number
    vacancies: number
    contractorCoverageId: number
    contractorId: number
    courseId: number
    holidays: string[]
}

interface StudentClassDto {
    id: number | null
    name: string
    description: string
    startAt: string
    endAt: string
    handsOnSchedule: string
    certificateIssueDate: string
    certificateSponsor: string
    trailId: number
    trail: string | null
    status: number
    vacancies: number
    forumLink: string | null
    createdAt: string,
    updatedAt: string,
    students: any,
    contractorCoverageId: number
    contractorId: number
}

class StudentService {

    public async getActiveContractors() {
        try {
            const response = await httpStudentProvider.get("Contractor/Active");
            const data = response.data;
            return data;
        } catch (error) {
            console.error('Erro ao obter os contratantes ativos:', error);
            throw error;
        }
    }

    public async getActiveCoverages(contractorId: number) {
        try {

            const response = await httpStudentProvider.get(`ContractorCoverage/Active/${contractorId}`);
            const data = response.data;
            return data;
        } catch (error) {
            console.error('Erro ao obter os contratantes ativos:', error);
            throw error;
        }
    }

    public async getActiveClassesByContractorCoverageId(contractorCoverageId: Number ) {
        try {
            const endpoint = `StudentClasses/ActiveClasses/${contractorCoverageId}`;
            const response = await httpStudentProvider.get<any>( endpoint );

            return response.data;
        } catch ( error ) {
            console.log( `Error blocking candidate: ${error}` );
            throw error;
        }
    }

    public async GetActiveClasses(): Promise<ActiveStudentClassDto[] | null> {
        try {
            const activeClassesResponse = await httpStudentProvider.get('StudentClasses/ActiveClasses');
            if (activeClassesResponse.status !== 200) return null;
            return activeClassesResponse.data;
        }
        catch(error) {
            return null;
        };
    };

    public async getActiveClassesGeneral() {
        try {
            const endpoint = `StudentClasses/ActiveClasses/1`;
            const response = await httpStudentProvider.get<any>( endpoint );

            return response.data;
        } catch ( error ) {
            console.log( `Error getting active classes: ${error}` );
            throw error;
        }
    }

    public async getClassById(id: number) {
        try {
            const endpoint = `StudentClasses/filter/${id}`;
            const response = await httpStudentProvider.get<any>( endpoint );

            return response.data;
        } catch ( error ) {
            console.log( `Error getting active classes: ${error}` );
            throw error;
        }
    }

    public async getStudentCourseProgress (): Promise<IStudentProgress[]> {
        const { data } = await httpStudentProvider.get( "StudentCourse/Progress" );

        return data;
    }

    public async getStudentCourseCompleteProgress (): Promise<
        IStudentCompleteProgress[]
    > {
        const { data } = await httpStudentProvider.get(
            "StudentCourse/CompleteProgress"
        );

        return data;
    }

    public async getContent (): Promise<IContent[]> {
        const { data } = await httpStudentProvider.get( "StudentCourse/Content" );

        return data;
    }

    public async finishContent ( contentId: number ): Promise<any> {
        const { data } = await httpStudentProvider.put(
            `StudentCourse/Content/${contentId}`
        );

        return data;
    }

    public async getContentProgress (
        contentId: number
    ): Promise<IContentProgress[]> {
        const { data } = await httpStudentProvider.get(
            `StudentCourse/ContentProgress/${contentId}`
        );

        return data;
    }

    public async getWhatsAppGroupLink () {
        const { data } = await httpStudentProvider.get(
            `StudentClasses`
        );

        return data;
    }

    public async CreateTeam(payload: StudentClassCreateRequest): Promise<any> {
        try {
            const { status,data} = await httpStudentProvider.post(
                `StudentClasses`,
                payload
            );
            return {status, data};
        }
        catch (error) {
            console.error('Erro ao criar turma:', error);
            throw error;
        }
    }

    public async UpdateTeam(studentClassId: number, payload: {
        name: string
        description: string
        startAt: string
        endAt: string
        handsOnSchedule: string
        certificateIssueDate: string
        certificateSponsor: string
        trailId: number
        status: number
        vacancies: number
    }): Promise<any> {
        try {
            const { status,data} = await httpStudentProvider.put(
                `StudentClasses/${studentClassId}`,
                payload
            );
            return {status, data};
        }
        catch (error) {
            console.error('Erro ao criar turma:', error);
            throw error;
        }
    }

    public async GetTeamByStudentClassId(studentClassId: number): Promise<StudentClassDto | undefined> {
        try {
            const { status, data } = await httpStudentProvider.get(`StudentClasses/${studentClassId}`);
            if (status !== 200) return undefined;
            return data;
        }
        catch (error) {
            console.error('Erro ao tentar obter as informacoes da turma: ', error);
            throw error;
        }
    }

    public async createTeamSchedule(payload: {
        trailId: any;
        holidays: string[];
        endDate: string;
        contractorId: number;
        startDate: string
    }): Promise<any> {
        try {
            const { status} = await httpStudentProvider.post(
                `schedule`,
                payload
            );
            return status;
        }
        catch (error) {
            console.error('Erro ao criar turma:', error);
            throw error;
        }
    }

    public async createLiveEvent(payload: {
        name: string;
        description: string;
        type: number;
        link: string;
        isRequired: string;
        studentClassId: string;
        eventDate: string
    }): Promise<any> {
        try {
            const { status} = await httpStudentProvider.post(
                '/LiveContent',
                payload
            );
            return status;
        }
        catch (error) {
            console.error('Erro ao criar conteudo ao vivo:', error);
            throw error;
        }
    }

    public async updateLiveEvent(payload: {
        contentId: number;
        name: string;
        description: string;
        type: number;
        link: string;
        isRequired: string;
        studentClassId: string;
        eventDate: string
    }): Promise<any> {
        try {
            const { status} = await httpStudentProvider.patch(
                '/LiveContent',
                payload
            );
            return status;
        }
        catch (error) {
            console.error('Erro ao criar conteudo ao vivo:', error);
            throw error;
        }
    }
    public async GetClassLive (studentId: number): Promise<IClassLive> {

        const { data } = await httpStudentProvider.get(
            `/LiveContent/student/${studentId}`
        );
        return data;
    }

    public async GetClassByStudentId (studentId: number): Promise<any> {

        const { data } = await httpStudentProvider.get(
            `/StudentClasses/student/${studentId}`
        );
        return data;
    }

    public async BlockStudent (studentId: number): Promise<any> {

        const { status } = await httpStudentProvider.put(
            `/Students/${studentId}`
        );
        return status;
    }
    public async GetClassAllLive (): Promise<any[]> {

        const { data } = await httpStudentProvider.get(
            `/LiveContent`
        );
        return data;

    }

    public async GetStudentClassTrails (studentClassId: number): Promise<any> {
        const { data } = await httpStudentProvider.get(
            `/StudentClasses/studentClassTrails/${studentClassId}`
        );
        return data;
    }
    
    public async GetStudentClassDetailReport (studentClassId: number): Promise<any> {
        const { data } = await httpStudentProvider.get(
            `/ContractorClasses/StudentSubModuleDetailsReport/${studentClassId}`
        );
        return data;
    }
    public async GetSurveyResponsePerTrail (studentClassId: number, page?: number, pageSize?: number, trailId?: number ): Promise<ISurveyResponse> {
        const { data } = await httpStudentProvider.get(
            `/ContractorClasses/StudentsSurveyReport/${studentClassId}?page=${page ?? 1}&pageSize=${pageSize ?? 10}${trailId ? `&trail=${trailId}` : ''}`
        );
        return data;
    }
    public async GetClassLate (): Promise<IClassLate | any> {
        // const { data } = await httpStudentProvider.get('../../../data/live.json');

        // return data;
        return new Promise( ( resolve, reject ) => {
            resolve(
                {
                    "StudentId": -317338882,
                    "AssessmentId": -16637002,
                    "AssessmentDescription": "erat ipsum sit. lorem sit consectetuer.",
                    "DaysLate": 2,
                    "IsLate": true
                }
            );
        } );
    }
}


export default new StudentService();
