import { SubModuleDto, HandsOnDto, SaveContentDto } from "../../../interfaces/StudentContents/Responses/Classes";
import { httpStudentProvider } from "../../../providers";
import { showErrorToast } from "../../../utils/toast";
import { UNEXPECTED_SERVICE_ERROR_MSG } from "../../../constants/contentLayout/contentLayout";

class ContentService 
{
    GetSubmoduleById = async (subModuleId: number): Promise<SubModuleDto> => {    
        try{
            const { data } = await httpStudentProvider.get(`student/submodule/${subModuleId}`);
            return data;
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }          
    };

    GetHandsOnData = async (studentClassId: number, subModuleId: number): Promise<HandsOnDto[]> => {
        try {
            /*
                This endpoint always returns an empty array ([]) when a non-existent studentClassId or subModuleId is
                provided, hence there is no status code handling.
            */
            const { data } = await httpStudentProvider.get<HandsOnDto[]>(`/content/extra/${studentClassId}/${subModuleId}`);
            if (data.length === 0) throw Error;
            return data;
        } catch (error) {
            showErrorToast(UNEXPECTED_SERVICE_ERROR_MSG);
            return [];
        }
    };
    
    SaveStudentContentProgress = async (contentId: number): Promise<boolean> => {    
        try {
            const studentProgressResult = await httpStudentProvider.post<SaveContentDto>(`student/progress/${contentId}`);
            return studentProgressResult.status === 200;
        }
        catch (error) {
            console.error(error);
            return false;
        };     
    };    
};

export default new ContentService();
