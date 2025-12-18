import {httpStudentProvider} from "../../../providers";

export interface ProfessionalProfile {
    studentId: number;
    linkedin: string;
    availability: boolean;
    visibility: boolean;
    certificateUrl: string;
    course: string;
    class: string;
    startAt: string;
    endAt: string;
}

export interface ProfessionalProfileRequest {
    studentId: number;
    linkedin: string | null;
    availability: boolean | null;
    visibility: boolean | null;
    photo: File | null;
}

class StudentProfessionalProfileService {
    GetProfessionalProfile = async (studentId: number): Promise<ProfessionalProfile> => {
        try{
            const { data } = await httpStudentProvider.get(`professional-profile?studentId=${studentId}`);
            return data;
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    GetProfessionalProfilePhotoUrl = async (studentId: number): Promise<string> => {
        try{
            const { data } = await httpStudentProvider.get(`professional-profile/photo?studentId=${studentId}`);
            return data;
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };
    
    UpsertProfessionalProfile = async (data: ProfessionalProfileRequest): Promise<any> => {
        try{
            const formData = new FormData();
            formData.append('studentId', data.studentId.toString());
            formData.append('linkedin', data.linkedin ?? '');
            formData.append('availability', data.availability?.toString() ?? '');
            formData.append('visibility', data.visibility?.toString() ?? '');
            formData.append('photo', data.photo!);
            
            const response = await httpStudentProvider.post(`professional-profile`, formData);
            return response.data;
        }catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
}

export default new StudentProfessionalProfileService();