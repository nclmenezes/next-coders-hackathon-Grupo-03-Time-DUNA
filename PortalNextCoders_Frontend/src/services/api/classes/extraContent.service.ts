import {CreateExtraContentDto} from "../../../interfaces/courses/requests/CreatesDto";
import { UpdateOrDeleteContentDto } from "../../../interfaces/courses/requests/UpdateOrDelete";
import {ExtraContent} from "../../../interfaces/courses/responses/Course";
import { httpCourseProvider } from "../../../providers";

class ExtraContentService
{
    Create = async (createContent: CreateExtraContentDto): Promise<ExtraContent> => {
        try{
            const { data } = await httpCourseProvider.post("extraContent", createContent);
            return data;
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    GetAllBySubModule = async (subModuleId: number): Promise<ExtraContent[]>  => {
        try{
            const { data } = await httpCourseProvider.get(`extraContent/${subModuleId}`);
            return data;
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    Update = async (updateContent: ExtraContent) => {
        try{
            await httpCourseProvider.put("extraContent", updateContent);
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    BulkUpdate = async (updateContent: UpdateOrDeleteContentDto[]) => {
        try{
            await httpCourseProvider.put("extraContent/bulkupdate", updateContent);
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    Delete = async (deleteContent: ExtraContent) => {
        try{
            await httpCourseProvider.delete("extraContent", {
                params: {
                    contentId: deleteContent.extraContentId,
                    sectionId: deleteContent.extraSectionId,
                    assessmentId: deleteContent.assessmentId
                }
            });
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };
};

export default new ExtraContentService();
