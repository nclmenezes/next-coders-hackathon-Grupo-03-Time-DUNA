import {httpStudentAccountProvider} from "../../../providers";

class studentAccountService {
  async getStudentAccountByProfileId(profileId: number) {
    const response = await httpStudentAccountProvider.get(`api/Profiles/${profileId}`);
    return response.data;
  }
  
    async updateStudent(profileId: number, data: any) {
        return await httpStudentAccountProvider.put(`api/Profiles/UpdateStudent?profileId=${profileId}`, data);
    }
}

export default new studentAccountService();