import { SharedModel } from "../SharedModel";

export type CreateCourseDto = SharedModel & {
  name: string;
  description: string;
}

export type CreateTrailDto = SharedModel & {
  courseId: number;
  name: string;
  description: string;
  workload: number;
  orderNumber: number;
}

export type CreateModuleDto = SharedModel & {
  trailId: number;
  moduleTypeId: number;
  name: string;
  description: string;
  workload: number;
  orderNumber: number;
}

export type CreateSubModuleDto = SharedModel & {
  moduleId: number;
  name: string;
  subModuleTypeId: number;
  description: string;
  orderNumber: number;
}

export type CreateContentDto = SharedModel & {
  subModuleId: number;
  contentTypeId: number;
  name: string;
  description: string;
  link: string;
  linkDescription: string;  
  duration: number;
  orderNumber: number;
  isAssessment: boolean;
  limitQuestions: number;
}

export type CreateAnswerDto = SharedModel & {
  questionId: number | null;
  text: string;
  isCorrect: boolean;
}

export type CreateQuestionDto = SharedModel & {
  assessmentId: number;
  text: string;
  answers: CreateAnswerDto[];
}


export type CreateExtraModuleDto = SharedModel & {
  extraTrailId: number;
  moduleTypeId: number;
  name: string;
  description: string;
  workload: number;
  orderNumber: number;
}

export type CreateExtraSubModuleDto = SharedModel & {
  extraModuleId: number;
  name: string;
  subModuleTypeId: number;
  description: string;
  orderNumber: number;
}

export type CreateExtraContentDto = SharedModel & {
  subModuleId: number;
  contentTypeId: number;
  name: string;
  description: string;
  link: string;
  linkDescription: string;
  duration: number;
  orderNumber: number;
  isAssessment: boolean;
  limitQuestions: number;
}