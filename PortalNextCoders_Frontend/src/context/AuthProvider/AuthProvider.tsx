import { createContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { useParams, useLocation } from 'react-router-dom';
import jwt_decode from "jwt-decode";

import { IAuthContextData, IAuthProvider, IUser } from "./types";

import usePersistedState from "../../hooks/usePersistedState";
import AuthService from "../../services/auth.service";
import UserService from "../../services/user.service";
import storageRepository from "../../repositories/storage-repository";
import {
  handleAxiosAuthHeader,
  persistAxiosAuthHeader,
} from "../../utils/auth";
import Base64 from "../../utils/base64";
import authService from "../../services/auth.service";

export const AuthContext = createContext<IAuthContextData>(
  {} as IAuthContextData
);

export const AuthProvider = ({ children }: IAuthProvider) => {
  const navigate = useNavigate();
  const [user, setUser] = usePersistedState<IUser | null>("user", null);
  const isAuthenticated = authService.getToken() !== null;
  const urlPath = useLocation().pathname;
  const certificateIdMatch = urlPath.match(/certificate\/([^\/]+)\/?/);

  persistAxiosAuthHeader();
  
  useEffect(() => {
    if (certificateIdMatch) return;
    if (user === null) {
      navigate("/");

      storageRepository.delete([
        "activeContent",
        "content",
        "contentIsFinished",
        "contentProgress",
        "course",
        "studentProgress",
        "studentCompleteProgress",
        "token",
        "user",
      ]);
    }
  }, [user]);

  async function signIn(email: string, password: string) {
    const response = await AuthService.login({ email, password });

    if (!response) {
      // toast an error

      return;
    }

    const role =
      response.data?.userToken?.claims?.find(
        (item: any) => item.type === "profile"
      )?.value || "";

    const token = response.data?.accessToken;

    const userData = {
      name: response.data.userToken?.fullName || "",
      email: response.data.userToken?.email || "",
      role,
      id: response.data?.userToken?.claims?.find(
          (item: any) => item.type === "student_id")?.value || "",
      contractorId: response.data?.userToken?.claims?.find(
            (item: any) => item.type === "contractor_id")?.value || "",
      profileId: response.data?.userToken?.claims?.find(
            (item: any) => item.type === "profile_id")?.value || ""
    };
    setUser(userData);

    await UserService.insertUser(userData);
    await AuthService.insertToken(response.data);

    handleAxiosAuthHeader(token);

    return response.data;
  }

  async function signInWithToken(accessToken: string) {
    let decodeToken = Base64.decode(accessToken);
    let jsonToken = JSON.parse(decodeToken);
    const role =
      jsonToken.userToken?.claims?.find(
        (item: any) => item.type === "profile"
      )?.value || "";
    const token = jsonToken.accessToken;
    const userData = {
      name: jsonToken.userToken?.fullName || "",
      email: jsonToken.userToken?.email || "",
      role,
      id: jsonToken.userToken?.student_id || "",
      contractorId: jsonToken.userToken?.contractor_id || "",
      profileId: jsonToken.userToken?.profileId || ""
    };
    setUser(userData);
    await UserService.insertUser(userData);
    await AuthService.insertToken(jsonToken);
    handleAxiosAuthHeader(token);
    return jsonToken;    
  }

  async function signInWithRefreshToken(refreshToken: string) {
    let decodeToken = Base64.decode(refreshToken);
    let ret = await AuthService.RefreshToken(decodeToken);
    let jsonToken = ret.data;
    
    if (jsonToken != null) {
      const role =
        jsonToken.claims?.find(
          (item: any) => item.type === "profile"
        )?.value || "";

        const decodedToken: any = jwt_decode (jsonToken.accessToken);
      const token = jsonToken.accessToken;
      const userData = {
        name: decodedToken.name || "",
        email: decodedToken.email || "",
        role,
        id: decodedToken.student_id || "",
        contractorId: decodedToken.contractor_id || "",
        profileId: decodedToken.profileId || ""
      };
      setUser(userData);
      await UserService.insertUser(userData);
      await AuthService.insertToken(jsonToken);
      handleAxiosAuthHeader(token);
      
      return jsonToken;
    } else {
      return null;
    }

  }

  function signOut() {
    setUser(null);
  }

  const authValue = {
    isAuthenticated,
    signIn,
    signInWithToken,
    signInWithRefreshToken,
    signOut,
    user,
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};
