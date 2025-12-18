import { httpStudentProvider } from "../../../providers";


export interface RefreshMaintainersClassDto{
  studentClassId: number;
  maintainerId: number | null;
}

class MaintainersClassService
{    
  UpdateClassLink = async (data: RefreshMaintainersClassDto) => {    
    try{
      await httpStudentProvider.put("maintainers/class/", data);
    }catch (error) {
        console.error('Error:', error);
        throw error;
    }           
  };       
      
};

export default new MaintainersClassService();