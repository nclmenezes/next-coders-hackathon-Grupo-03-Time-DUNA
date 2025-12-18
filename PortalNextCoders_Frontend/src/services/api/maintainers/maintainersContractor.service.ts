import { httpStudentProvider } from "../../../providers";

export interface RefreshMaintainersContractorDto{
  contractorId: number;
  maintainerId: number;
}

export interface IContractorMaintainer {
  contractor: number;
  maintainerId: number;
  name: string;
}

class MaintainersContractorService
{    
  InsertContractorLink = async (data: RefreshMaintainersContractorDto[]) => {    
      try{
        await httpStudentProvider.post("maintainers/contractor", data);
      }catch (error) {
          console.error('Error:', error);
          throw error;
      }           
  };         
    
  GetAllMaintainers = async (contractorId: number, typeList: boolean): Promise<IContractorMaintainer[]> => {    
    try{
      var { data } = await httpStudentProvider.get(`maintainers/contractor/${contractorId}/${typeList}`);

      return data;
    }catch (error) {
        console.error('Error:', error);
        throw error;
    }          
  };       
    
  DeleteMaintainersContractor = async (contractorId: number, maintainerId: number) => {    
    try{
      await httpStudentProvider.delete(`maintainers/contractor/${contractorId}/${maintainerId}`);
    }catch (error) {
        console.error('Error:', error);
        throw error;
    }          
  };      
};

export default new MaintainersContractorService();