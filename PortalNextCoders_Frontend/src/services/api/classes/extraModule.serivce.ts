import {CreateExtraModuleDto, CreateModuleDto} from "../../../interfaces/courses/requests/CreatesDto";
import { UpdateOrDeleteModuleDto } from "../../../interfaces/courses/requests/UpdateOrDelete";
import {ExtraModule, Module} from "../../../interfaces/courses/responses/Course";
import { httpCourseProvider } from "../../../providers";

class ExtraModuleService
{
    Create = async (createModule: CreateExtraModuleDto): Promise<ExtraModule> => {
        try{
            const { data } = await httpCourseProvider.post("extraModule", createModule);
            return data;
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    Show = async (moduleId: number): Promise<ExtraModule> => {
        try{
            const {data}= await httpCourseProvider.get(`extraModule/${moduleId}`);
            return data;
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    Update = async (updateModule: ExtraModule) => {
        try{
            await httpCourseProvider.put("extraModule", updateModule);
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    Delete = async (moduleId: Number) => {
        try{
            await httpCourseProvider.delete(`extraModule/${moduleId}`);
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };
};

export default new ExtraModuleService();
