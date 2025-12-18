import { IStudentClassCheckDto } from '../../interfaces/student/checkStudentClass.interface';
import { httpClassManagementProvider } from "../../providers";
import { UNEXPECTED_SERVICE_ERROR_MSG } from "../../constants/contentLayout/contentLayout";
import { showErrorToast } from "../../utils/toast";

const CheckStudentClass = async (studentId: number): Promise<IStudentClassCheckDto | null> =>  {
    try {
        const endpointResponse = await httpClassManagementProvider.get(`studentclass/checkStudentClass/${studentId}`);
        if (endpointResponse.status !== 200) throw new Error();
        return endpointResponse.data;
    } catch (err) {
        showErrorToast(UNEXPECTED_SERVICE_ERROR_MSG);
        return null;
    };
};

export default CheckStudentClass;