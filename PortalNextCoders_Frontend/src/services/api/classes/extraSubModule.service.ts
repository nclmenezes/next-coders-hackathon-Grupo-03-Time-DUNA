import {CreateExtraSubModuleDto, CreateSubModuleDto} from "../../../interfaces/courses/requests/CreatesDto";
import { UpdateOrDeleteSubModuleDto } from "../../../interfaces/courses/requests/UpdateOrDelete";
import {ExtraSubModule, SubModule} from "../../../interfaces/courses/responses/Course";
import { httpCourseProvider } from "../../../providers";

class ExtraSubModuleService
{
    Create = async (createSubModule: CreateExtraSubModuleDto): Promise<ExtraSubModule> => {
        try{
            const { data } = await httpCourseProvider.post("extraSubmodule", createSubModule);
            return data;
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    Update = async (updateSubModule: ExtraSubModule) => {
        try{
            await httpCourseProvider.put("extraSubmodule", updateSubModule);
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    BulkUpdate = async (updateSubModule: UpdateOrDeleteSubModuleDto[]) => {
        try{
            await httpCourseProvider.put("extraSubmodule/bulkupdate", updateSubModule);
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    Delete = async (subModuleId: number) => {
        try{
            await httpCourseProvider.delete(`extraSubmodule/${subModuleId}`);
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };
};

export default new ExtraSubModuleService();
