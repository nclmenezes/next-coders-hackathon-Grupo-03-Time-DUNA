import { httpStudentProvider } from "../../../providers";
import { IContractorMaintainer } from "./maintainersContractor.service";


export interface IMaintainer {
  maintainerId: number;
  name: string;
  lead: string;
  documentNumber: string;
  mail: string;
  createdAt: Date | null;
  createdBy: string | null;
}

export interface IMaintainersReturn{
  page: number;
  pageSize: number;
  totalPages: number;
  quantity: number;
  maintainers: IMaintainer[];
}

class MaintainersService
{    
  InsertMaintainer = async (data: IMaintainer) => {
    try{
      await httpStudentProvider.post("maintainers", data);
    }catch (error) {
        console.error('Error:', error);
        throw error;
    }      
  }

  List = async (page: number, pageSize: number): Promise<IMaintainersReturn> => {
    try{
      var {data} = await httpStudentProvider.get(`maintainers/${page}/${pageSize}`);
      return data;
    }catch (error) {
        console.error('Error:', error);
        throw error;
    }      
  }  

  FindById = async (maintainerId: number): Promise<IContractorMaintainer[]> => {
    try{
      var {data} = await httpStudentProvider.get(`maintainers/${maintainerId}`);
      return data;
    }catch (error) {
        console.error('Error:', error);
        throw error;
    }      
  }    

  Update = async (data: IMaintainer) => {
    try{
      await httpStudentProvider.put("maintainers", data);
    }catch (error) {
        console.error('Error:', error);
        throw error;
    }      
  }
      
};

export default new MaintainersService();