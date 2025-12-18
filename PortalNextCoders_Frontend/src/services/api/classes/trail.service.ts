import { CreateTrailDto } from "../../../interfaces/courses/requests/CreatesDto";
import { UpdateOrDeleteTrailDto } from "../../../interfaces/courses/requests/UpdateOrDelete";
import { Trail } from "../../../interfaces/courses/responses/Course";
import { httpCourseProvider } from "../../../providers";

class TrailService 
{
    Create = async (createTrail: CreateTrailDto): Promise<Trail> => {    
        try{
          const { data } = await httpCourseProvider.post("trail", createTrail);
          return data;
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }           
    };

    GetAll = async (): Promise<Trail[]> => {    
        try{
          const { data } = await httpCourseProvider.get(`trail`);
          return data;
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }           
    };      

    GetAllByCourse = async (courseId: number): Promise<Trail[]> => {    
        try{
          const endpointResponse = await httpCourseProvider.get(`trail/${courseId}`);
          if (endpointResponse.status !== 200) throw new Error();
          return endpointResponse.data;
        } catch (error) {
            return [];
        };
    };    
    
    Update = async (updateTrail: Trail) => {    
        try{
          await httpCourseProvider.put("trail", updateTrail);
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }           
    };  
    
    BulkUpdate = async (updateTrail: UpdateOrDeleteTrailDto[]) => {    
        try{
          await httpCourseProvider.put("trail/bulkupdate", updateTrail);
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }           
    }; 

    Delete = async (trailId: number) => {    
        try{
          await httpCourseProvider.delete(`trail/${trailId}`);
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }           
    };         
};

export default new TrailService();
