import { CreateSubModuleDto } from "../../../interfaces/courses/requests/CreatesDto";
import { UpdateOrDeleteSubModuleDto } from "../../../interfaces/courses/requests/UpdateOrDelete";
import { SubModule } from "../../../interfaces/courses/responses/Course";
import { httpCourseProvider } from "../../../providers";

class SubModuleService 
{
    Create = async (createSubModule: CreateSubModuleDto): Promise<SubModule> => {    
        try{
          const { data } = await httpCourseProvider.post("submodule", createSubModule);
          return data;
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }           
    };
    
    Update = async (updateSubModule: SubModule) => {    
        try{
          await httpCourseProvider.put("submodule", updateSubModule);
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }           
    };  
    
    BulkUpdate = async (updateSubModule: UpdateOrDeleteSubModuleDto[]) => {    
        try{
          await httpCourseProvider.put("submodule/bulkupdate", updateSubModule);
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }           
    };        
    
    Delete = async (subModuleId: number) => {    
        try{
          await httpCourseProvider.delete(`submodule/${subModuleId}`);
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }           
    };    
};

export default new SubModuleService();
