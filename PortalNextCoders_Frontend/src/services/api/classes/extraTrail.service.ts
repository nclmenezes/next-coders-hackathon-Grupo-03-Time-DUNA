import {CreateTrailDto} from "../../../interfaces/courses/requests/CreatesDto";
import {UpdateOrDeleteTrailDto} from "../../../interfaces/courses/requests/UpdateOrDelete";
import {ExtraTrail} from "../../../interfaces/courses/responses/Course";
import {httpCourseProvider} from "../../../providers";

class ExtraTrailService {
    Create = async (createTrail: CreateTrailDto): Promise<ExtraTrail> => {
        try {
            const {data} = await httpCourseProvider.post("extraTrail", createTrail);
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    GetAll = async (): Promise<ExtraTrail[]> => {
        try {
            const {data} = await httpCourseProvider.get(`extraTrail`);
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    GetAllByCourse = async (courseId: number): Promise<ExtraTrail[]> => {
        try {
            const endpointResponse = await httpCourseProvider.get(`extraTrail/${courseId}`);
            if (endpointResponse.status !== 200) throw new Error();
            return endpointResponse.data;
        } catch (error) {
            return [];
        }
        ;
    };

    Update = async (updateTrail: ExtraTrail) => {
        try {
            await httpCourseProvider.put("extraTrail", updateTrail);
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    BulkUpdate = async (updateTrail: UpdateOrDeleteTrailDto[]) => {
        try {
            await httpCourseProvider.put("extraTrail/bulkupdate", updateTrail);
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    Delete = async (trailId: number) => {
        try {
            await httpCourseProvider.delete(`extraTrail/${trailId}`);
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };
};

export default new ExtraTrailService();
