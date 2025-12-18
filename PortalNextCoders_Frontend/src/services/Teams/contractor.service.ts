import { httpStudentProvider } from "../../providers";

class ContractorService {
    async deactivateStudentClass(studentClassId: number) {
        try {
            const endpoint = `ContractorClasses/DeactivateStudentClass/${studentClassId}`;
            const response = await httpStudentProvider.put<any>(endpoint);

            return response.data;

        } catch (error) {

            throw error;
        }
    }
    async moveStudents(studentClassId: number, newStudentClassId: number) {
        try {
            const endpoint = `ContractorClasses/MoveStudents/${studentClassId}/ToNewClass/${newStudentClassId}`;
            const response = await httpStudentProvider.put<any>(endpoint);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    async getAllContractors() {
        try {
            const endpoint = `Contractor`;
            const response = await httpStudentProvider.get<any>(endpoint);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getContractorId(id: number) {
        const {data} = await httpStudentProvider.get(`Contractor/${id}`)

        return data;
    } 
    
    async getContractorLocation(id: number) {
        const {data} = await httpStudentProvider.get(`Contractor/ContractorLocation/${id}`)

        return data;
    }

    async getContractorClassLocation(id: number, studentClassId: number) {
        const {data} = await httpStudentProvider.get(`Contractor/ContractorClassLocation/${studentClassId}/${id}`)

        return data;
    }

    async upsertClassLocation(data: any) {
        try {
            const {status} = await httpStudentProvider.post(`Contractor/ContractorClassLocation`, data)
            return status;
        }
        catch (error) {
            console.error('Erro ao atualizar cidades do contratante:', error);}
    }
    async createContractor(data: any) {
        try {
            const {status} = await httpStudentProvider.post(`Contractor`, data)
            return status;
        } catch (error) {
            console.error('Erro ao criar contratante:', error);
            throw error;
        }
    }
    
    async updateContractor(id: number, data:any) {
       try {
           const {status} = await httpStudentProvider.put(`Contractor/${id}`, data)
           return status;
       } catch (error) {
           console.error('Erro ao atualizar contratante:', error);
              throw error;
         }
    }
}

export default new ContractorService();