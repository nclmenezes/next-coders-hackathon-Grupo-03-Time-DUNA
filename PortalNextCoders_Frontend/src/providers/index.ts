import axios from "axios";

export const httpStudentAccountProvider = axios.create({
  baseURL : import.meta.env.VITE_STUDENT_ACCOUNT_API_URL,
});
export const httpAccountProvider = axios.create({
  baseURL: import.meta.env.VITE_ACCOUNT_API_URL,
});

export const httpAuthProvider = axios.create({
  baseURL:
    import.meta.env.VITE_STUDENT_AUTH_API_URL ||
    process.env.VITE_STUDENT_AUTH_API_URL,
});

export const httpClassProvider = axios.create({
  baseURL: import.meta.env.VITE_CLASS_API_URL,
});

export const httpCourseProvider = axios.create({
  baseURL: import.meta.env.VITE_COURSE_API_URL || process.env.VITE_COURSE_API_URL,
});

export const httpStudentProvider = axios.create({
  baseURL: import.meta.env.VITE_STUDENT_API_URL,
});

export const httpClassManagementProvider = axios.create({
  baseURL: import.meta.env.VITE_CLASS_MANAGEMENT_API_URL,
});

export const httpSurveyProvider = axios.create({
  baseURL: import.meta.env.VITE_SURVEY_API_URL,
});

export const httpMailProvider = axios.create({
  baseURL: import.meta.env.VITE_MAIL_API_URL || process.env.VITE_MAIL_API_URL,
});

export const httpCandidateClassProvider = axios.create({
  baseURL: import.meta.env.VITE_CANDIDATE_CLASS_API_URL,
});