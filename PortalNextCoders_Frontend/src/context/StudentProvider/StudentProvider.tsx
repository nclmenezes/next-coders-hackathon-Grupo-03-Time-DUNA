import { createContext, useContext } from "react";

import usePersistedState from "../../hooks/usePersistedState";
import studentService from "../../services/student/student.service";
import periodService from "../../services/api/contractorengine/period.service";

import {
  IStudentCompleteProgress,
  IStudentProgress,
} from "../../interfaces/student/student.interfaces";
import { IStudentContext, IStudentProvider } from "./types";
import {
  IContent,
  IContentProgress,
} from "../../interfaces/student/content.interfaces";
import { ClassDto } from "../../interfaces/StudentContents/Responses/Classes";
import { StudentPaymentDto } from "../../interfaces/StudentContents/Responses/Student";
import { CheckStudentResponses } from "../../services/api/student/satisfaction.service";
import { Period } from "../../services/api/contractorengine/types";

const StudentContext = createContext<IStudentContext | null>(null);

const StudentProvider = ({ children }: IStudentProvider) => {

  //------------------------------------------------------------
  const [classes, setClasses] = usePersistedState<ClassDto | null>("classes", null);
  
  const setClass = async (data: ClassDto) => {
    try {
      setClasses(data);
    } catch (e) {
      console.error(e);
    }
  };

  const [checkStudentResponses, setCheckStudentResponses] = usePersistedState<CheckStudentResponses[] | null>("studentReponses", null);

  const setCheckStudentResponse = async (data: CheckStudentResponses[]) => {
    try {
      setCheckStudentResponses(data);
    } catch (e) {
      console.error(e);
    }
  };


  const [studentPayment, setStudentPayment] = usePersistedState<StudentPaymentDto[] | null>("payment", null);
  
  const setPayment = async (data: StudentPaymentDto[]) => {
    try {
      setStudentPayment(data);
    } catch (e) {
      console.error(e);
    }
  };

  //---------------------------------------------------


  const [studentProgress, setStudentProgress] =
    usePersistedState<IStudentProgress | null>("studentProgress", null);

  const [studentCompleteProgress, setStudentCompleteProgress] =
    usePersistedState<IStudentCompleteProgress[]>(
      "studentCompleteProgress",
      []
    );

  const [content, setContent] = usePersistedState<IContent[]>("content", []);

  const [contentProgress, setContentProgress] = usePersistedState<
    IContentProgress[]
  >("contentProgress", []);


  const [studentPeriod, setStudentPeriod] = usePersistedState<
  Period[]
>("studentPeriod", []);

  const getStudentProgress = async () => {
    try {
      const response = await studentService.getStudentCourseProgress();

      setStudentProgress(response[0]);
    } catch (e) {
      console.error(e);
    }
  };

  const getStudentCompleteProgress = async () => {
    try {
      const response = await studentService.getStudentCourseCompleteProgress();

      setStudentCompleteProgress(response);
    } catch (e) {
      console.error(e);
    }
  };

  const getContent = async () => {
    try {
      const response = await studentService.getContent();

      setContent(response);
    } catch (e) {
      console.error(e);
    }
  };

  const finishContent = async (contentId: number) => {
    try {
      const response = await studentService.finishContent(contentId);

      return response;
    } catch (e) {
      console.error(e);
    }
  };

  const getContentProgress = async (contentId: number) => {
    try {
      const response = await studentService.getContentProgress(contentId);

      setContentProgress(response);
    } catch (e) {
      console.error(e);
    }
  };

  const getStudentPeriod = async (studentId: number) => {
    try {
      const response = await periodService.getStudentPeriod(studentId);

      setStudentPeriod(response);
    } catch (e) {
      console.error(e);
    }
  };

  const studentProviderValue = {
    //------------
    studentPayment,
    setStudentPayment,

    classes,
    setClass,
    
    checkStudentResponses,
    setCheckStudentResponse,

    //------------

    studentProgress,
    getStudentProgress,

    studentCompleteProgress,
    getStudentCompleteProgress,

    content,
    getContent,
    finishContent,

    contentProgress,
    getContentProgress,

    studentPeriod,
    getStudentPeriod
  };

  return (
    <StudentContext.Provider value={studentProviderValue}>
      {children}
    </StudentContext.Provider>
  );
};

function useStudent(): IStudentContext {
  const context = useContext(StudentContext);
  if (!context) throw new Error("useStudent must be used within StudentContext provider");
  return context;
};

export { StudentProvider, useStudent };
