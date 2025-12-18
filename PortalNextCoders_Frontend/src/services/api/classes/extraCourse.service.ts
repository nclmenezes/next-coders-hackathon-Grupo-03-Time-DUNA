import { CreateCourseDto } from "../../../interfaces/courses/requests/CreatesDto";
import { UpdateOrDeleteCourseDto } from "../../../interfaces/courses/requests/UpdateOrDelete";
import {Course, ExtraCourse} from "../../../interfaces/courses/responses/Course";
import { httpCourseProvider } from "../../../providers";

class ExtraCourseService
{
    Create = async (createCourse: CreateCourseDto): Promise<ExtraCourse> => {
        try{
            const { data } = await httpCourseProvider.post("extraCourse", createCourse);
            return data;
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    GetAll = async (): Promise<ExtraCourse[]> => {
        try{
            const { data } = await httpCourseProvider.get(`extraCourse`);
            return data;
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    Update = async (updateCourse: ExtraCourse) => {
        try{
            await httpCourseProvider.put("extraCourse", updateCourse);
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    Delete = async (courseId: Number) => {
        try{
            await httpCourseProvider.delete(`extraCourse/${courseId}`);
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };
};

export default new ExtraCourseService();
