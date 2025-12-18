import { ReactElement } from "react";

import {
  IStudentCompleteProgress,
  IStudentProgress,
} from "../../interfaces/student/student.interfaces";
import {
  IContent,
  IContentProgress,
} from "../../interfaces/student/content.interfaces";
import { ClassDto } from "../../interfaces/StudentContents/Responses/Classes";
import { StudentPaymentDto } from "../../interfaces/StudentContents/Responses/Student";
import { CheckStudentResponses } from "../../services/api/student/satisfaction.service";
import { Period } from "../../services/api/contractorengine/types";

export interface IStudentContext {
  //------------
  studentPayment: StudentPaymentDto[] | null;
  setStudentPayment: (data: StudentPaymentDto[]) => void;

  classes: ClassDto | null;
  setClass:(data: ClassDto)=> void;

  checkStudentResponses: CheckStudentResponses[] | null;
  setCheckStudentResponse: (data: CheckStudentResponses[]) => void;

  studentProgress: IStudentProgress | null;
  getStudentProgress: () => void;

  //------------------------

  studentCompleteProgress: IStudentCompleteProgress[];
  getStudentCompleteProgress: () => void;

  content: IContent[];
  getContent: () => void;
  finishContent: (contentId: number) => any;

  contentProgress: IContentProgress[];
  getContentProgress: (contentId: number) => void;

  studentPeriod: Period[];
  getStudentPeriod: (studentId: number) => void;
}

export interface IStudentProvider {
  children: ReactElement | ReactElement[];
}
