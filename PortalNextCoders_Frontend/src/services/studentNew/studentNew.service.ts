import { httpStudentProvider } from "../../providers";

export interface CoursesAll { 
        primaryCourses: CourseDetail[];
        extraCourseRegister: CourseDetail[];
        extraCourseAvailable: CourseDetail[];
}

export interface CourseDetail {
    id: number; 
    name: string;
    description: string;
    image: string;
    isEnrolled: boolean;
}

class StudentNewService {
    public async getDataCourses() : Promise<CoursesAll> {
        try {
            const response =  await httpStudentProvider.get("student/allcourse"); 
            return response.data;
        } catch (error) {
            console.error('Erro ao obter os contratantes ativos:', error);
            throw error;
        }
    }
}
 

export default new StudentNewService();