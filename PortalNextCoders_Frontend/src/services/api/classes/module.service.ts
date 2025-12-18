import { CreateModuleDto } from "../../../interfaces/courses/requests/CreatesDto";
import { UpdateOrDeleteModuleDto } from "../../../interfaces/courses/requests/UpdateOrDelete";
import { Module } from "../../../interfaces/courses/responses/Course";
import { httpCourseProvider } from "../../../providers";

class ModuleService 
{
    Create = async (createModule: CreateModuleDto): Promise<Module> => {    
        try{
          const { data } = await httpCourseProvider.post("module", createModule);
          return data;
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }           
    };

    Show = async (moduleId: number): Promise<Module> => {    
        try{
            const {data}= await httpCourseProvider.get(`module/${moduleId}`);
            return data;
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }           
    };     
    
    Update = async (updateModule: Module) => {    
        try{
          await httpCourseProvider.put("module", updateModule);
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }           
    };     
    
    Delete = async (moduleId: Number) => {    
        try{
          await httpCourseProvider.delete(`module/${moduleId}`);
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }           
    };     
};

export default new ModuleService();
