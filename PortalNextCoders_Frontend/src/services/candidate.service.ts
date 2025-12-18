import { httpAccountProvider, httpClassProvider } from "../providers";
import { CandidateInterface } from "../interfaces/candidate.interface";
import { authHeader } from "./auth.header";

class AccountService {
  async getCandidateList () {
    try {
      const endpoint = `api/Profiles`;
      const response = await httpAccountProvider.get<CandidateInterface[]>(
        endpoint
      );
      return response.data;
    } catch ( error ) {
      throw error;
    }
  }

  async getContractors () {
    try {
      const endpoint = `api/Contractor`;
      const response = await httpAccountProvider.get<any>(endpoint);

      return response.data;
    } catch ( error ) {
      throw error;
    }
  }
  
  async getProfilesForReports({
    page
  }: any) {
    try {
      const endpoint = `api/Profiles/GetReport/${page}`;

      const response = await httpAccountProvider.get<any>(endpoint);

      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  async getExportData() {
    try {
      const endpoint = 'api/Profiles/GetReportExportData/';

      const response = await httpAccountProvider.get<any>(endpoint);

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getProfilesWithFinishedExams({
                                       page,
                                       pageSize = 10,
                                       name,
                                       profileStatus,
                                       candidateStatus,
                                       city, state,
                                       finishDate,
                                     }: any) {
    try {
      const endpoint = `api/Profiles/FinishedExams`;
      const params = {
        page,
        pageSize,
        sortOrder: "asc",
        ...(name !== "" && {name}),
        ...(profileStatus !== "" && {profileStatus}),
        ...(candidateStatus !== "" && {candidateStatus}),
        ...(city !== "" && {city}),
        ...(state !== "" && {state}),
        ...(finishDate !== "" && {finishDate}),
      };
      
      if (name !== "" || profileStatus !== "" || candidateStatus !== "" || city !== "" || state !== "" || finishDate !== "" || pageSize > 10) {
        params.page = 1;
      }

      const defaultParams = {
        page,
        pageSize,
        sortOrder: "asc"
      };

      const response = await httpAccountProvider.get<any>(endpoint, {params});
      if (response.status === 204) {
        const defaultResponse = await httpAccountProvider.get<any>(endpoint, {params: defaultParams});
        defaultResponse.data = {
            ...defaultResponse.data,
            userNotFound: true,
        };
        return defaultResponse.data;
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
  async getStudentStatus () {
    try {
      const endpoint = `api/Enums/StudentStatus`;

      const response = await httpAccountProvider.get<any>( endpoint );

      return response.data;
    } catch ( error ) {
      throw error;
    }
  }

  async getProfileStatus () {
    try {
      const endpoint = `api/Enums/ProfileStatus`;

      const response = await httpAccountProvider.get<any>( endpoint );

      return response.data;
    } catch ( error ) {
      throw error;
    }
  }


  async approveCandidate ( profileId: Number, studentClassId: Number, payload:{
    contractorId: Number,
    contractorCoverageId: Number,
  } ) : Promise<any> {
    try {
      const endpoint = `api/Profiles/ApproveCandidate/${profileId}/${studentClassId}`;
      const response = await httpAccountProvider.post<any>( endpoint, payload );
      return response.data;
    } catch ( error ) {
      throw error;
    }
  }

  async approveCandidateWithoutTest ( profileId: Number, studentClassId: Number, payload:{
    contractorId: Number,
    contractorCoverageId: Number,
  } ) : Promise<any> {
    try {
      const endpoint = `api/Profiles/ApproveCandidateWithoutTest/${profileId}/${studentClassId}`;
      const response = await httpAccountProvider.post<any>( endpoint, payload );
      return response.data;
    } catch ( error ) {
      throw error;
    }
  }

  async blockCandidate ( profileId: Number ) {
    try {
      const endpoint = `api/Profiles/BlockCandidate/${profileId}`;
      const response = await httpAccountProvider.post<any>( endpoint );

      return response.data;
    } catch ( error ) {
      console.log( `Error blocking candidate: ${error}` );
      throw error;
    }
  }

  async getActiveClasses ( ) {
    try {
      const endpoint = "StudentClasses/ActiveClasses";
      const response = await httpClassProvider.get<any>( endpoint );

      return response.data;
    } catch ( error ) {
      console.log( `Error blocking candidate: ${error}` );
      throw error;
    }
  }
}

export default new AccountService();
