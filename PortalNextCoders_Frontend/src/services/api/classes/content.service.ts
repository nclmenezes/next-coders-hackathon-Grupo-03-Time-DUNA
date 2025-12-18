import { CreateContentDto } from "../../../interfaces/courses/requests/CreatesDto";
import { UpdateOrDeleteContentDto, UpdateOrDeleteSubModuleDto } from "../../../interfaces/courses/requests/UpdateOrDelete";
import { Content } from "../../../interfaces/courses/responses/Course";
import { httpCourseProvider } from "../../../providers";

class ContentService
{
    Create = async (createContent: CreateContentDto): Promise<Content> => {    
        try{
          const { data } = await httpCourseProvider.post("content", createContent);
          return data;
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }           
    };

    GetAllBySubModule = async (subModuleId: number): Promise<Content[]>  => {    
        try{
          const { data } = await httpCourseProvider.get(`content/${subModuleId}`);
          return data;
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }           
    };     
    
    Update = async (updateContent: Content) => {    
        try{
          await httpCourseProvider.put("content", updateContent);
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }           
    };  
    
    BulkUpdate = async (updateContent: UpdateOrDeleteContentDto[]) => {    
        try{
          await httpCourseProvider.put("content/bulkupdate", updateContent);
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }           
    };      

    Delete = async (deleteContent: Content) => {    
        try{
          await httpCourseProvider.delete("content", {
            params: {
                contentId: deleteContent.contentId,
                sectionId: deleteContent.sectionId,
                assessmentId: deleteContent.assessmentId
            }
          });
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }           
    };    
};

export default new ContentService();
