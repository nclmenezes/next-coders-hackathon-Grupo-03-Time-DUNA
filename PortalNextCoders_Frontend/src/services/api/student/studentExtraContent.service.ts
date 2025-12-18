import { SaveContentDto } from "../../../interfaces/StudentContents/Responses/Classes";
import { httpStudentProvider } from "../../../providers";

class ContentExtraService 
{
    SaveStudentExtraContentProgress = async (contentId: number): Promise<boolean> => {    
        try {
            const studentProgressResult = await httpStudentProvider.post<SaveContentDto>(`student/extra/progress/${contentId}`);
            return studentProgressResult.status === 200;
        }
        catch (error) {
            console.error(error);
            return false;
        };     
    };    
};

export default new ContentExtraService();
