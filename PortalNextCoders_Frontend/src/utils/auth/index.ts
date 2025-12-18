import { AxiosInstance } from "axios";
import {
  httpAccountProvider,
  httpCourseProvider,
  httpStudentProvider,
  httpSurveyProvider,
} from "../../providers";

const AUTHENTICATED_PROVIDERS = [
  httpAccountProvider,
  httpCourseProvider,
  httpStudentProvider,
  httpSurveyProvider,
];

export const handleAxiosAuthHeader = (token: string) => {
  AUTHENTICATED_PROVIDERS.forEach((axiosInstance) => {
    axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;

    // axiosInstance.interceptors.request.use(
    //   (config) => {
    //     config.headers.Authorization = `Bearer ${token}`;
    //     return config;
    //   },
    //   (error) => {
    //     return Promise.reject(error);
    //   }
    // );
  });
};

export const persistAxiosAuthHeader = () => {
  const tokenData = JSON.parse(localStorage.getItem("token") as string);
  if (tokenData?.token) {
    handleAxiosAuthHeader(tokenData?.token);
  }
};
