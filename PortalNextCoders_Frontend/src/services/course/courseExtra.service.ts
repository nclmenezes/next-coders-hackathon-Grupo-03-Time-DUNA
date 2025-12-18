import axios from "axios";
import { httpCourseProvider } from "../../providers";
import { IModuleClassRequest, IModuleClass } from "../../interfaces/CourseService/courseService.interface";
import { showErrorToast } from "../../utils/toast";
import {
    UNEXPECTED_SERVICE_ERROR_MSG,
    NO_ACTIVE_CONTENTS_SERVICE_ERROR_MSG,
    NO_AUTHENTICATED_USER_ERROR_MSG
} from "../../constants/contentLayout/contentLayout";

class CourseExtraService {

    public async GetExtraModuleClass(moduleClassRequest: IModuleClassRequest): Promise<IModuleClass | null> {
        try {
            const endpointResponse = await httpCourseProvider.get<IModuleClass>('extramodule/getClass', { params: moduleClassRequest });
            if (endpointResponse.status !== 200) {
                showErrorToast(UNEXPECTED_SERVICE_ERROR_MSG);
                return null;
            };
            return endpointResponse.data;
        } catch(error) {
            if (axios.isAxiosError(error)) {
                const { status } = error.response || {};
                if (status === 404) showErrorToast(NO_ACTIVE_CONTENTS_SERVICE_ERROR_MSG);
                if (status === 401) showErrorToast(NO_AUTHENTICATED_USER_ERROR_MSG);
                if (status === 400 || status === 500) showErrorToast(UNEXPECTED_SERVICE_ERROR_MSG); 
            };
            return null;
        }
    };
}

export default new CourseExtraService();
