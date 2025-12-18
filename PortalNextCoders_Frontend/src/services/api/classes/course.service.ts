import { CreateCourseDto } from "../../../interfaces/courses/requests/CreatesDto";
import { UpdateOrDeleteCourseDto } from "../../../interfaces/courses/requests/UpdateOrDelete";
import { Course } from "../../../interfaces/courses/responses/Course";
import { httpCourseProvider } from "../../../providers";

class CourseService 
{
    Create = async (createCourse: CreateCourseDto): Promise<Course> => {    
        try{
          const { data } = await httpCourseProvider.post("course", createCourse);
          return data;
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }           
    };

    GetAll = async (): Promise<Course[]> => {    
        try{
          const { data } = await httpCourseProvider.get(`course`);
          return data;
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }           
    };
    
    Update = async (updateCourse: Course) => {    
        try{
          await httpCourseProvider.put("course", updateCourse);
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }           
    };    

    Delete = async (courseId: Number) => {    
        try{
          await httpCourseProvider.delete(`course/${courseId}`);
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }           
    };       
};

export default new CourseService();
