import { SharedModel } from "../SharedModel";

export type Course = SharedModel &  {
  courseId: number;
  name: string;
  description: string;
  moduleCount: number;
  trails: Trail[];
}

export type Trail = SharedModel & {
  trailId: number;
  courseId: number;
  courseName: string;
  name: string;
  description: string;
  isActive: boolean;
  workload: number;
  orderNumber: number;
  modules: Module[];
}

export type Module = SharedModel & {
  moduleId: number;
  trailId: number;
  moduleTypeId: number;
  name: string;
  description: string;
  isActive: boolean;
  workload: number;
  orderNumber: number;
  subModules: SubModule[];
}

export type SubModule = SharedModel & {
  subModuleId: number;
  moduleId: number;
  name: string;
  subModuleTypeId: number;
  description: string;
  isActive: boolean;
  orderNumber: number;
  contents: Content[]
}

export type Content = SharedModel & {
  contentId: number;
  sectionId: number;
  subModuleId: number;
  assessmentId: number | null;
  contentTypeId: number;
  contentType: ContentType;
  name: string;
  description: string;
  link: string;
  linkDescription: string;
  isActive: boolean;
  duration: number;
  orderNumber: number;
  assessment: Assessment | null;
}

export type ContentType = {
  id : number;
  type: string;
}

export type Assessment = SharedModel & {
  assessmentId: number;
  title: string;
  description: string;
  level: number;
  weight: number;
  limitQuestions: number;
  isActive: boolean;
  questions: Question[];
}

export type Question = SharedModel & {
  questionId: number;
  assessmentId: number;
  text: string;
  level: number;
  weight: number;
  isActive: boolean;
  answers: Answer[];
}

export type Answer = SharedModel & {
  answerId: number;
  questionId: number;
  text: string;
  isCorrect: boolean;
  isActive: boolean;
}

export type ExtraCourse = SharedModel &  {
  extraCourseId: number;
  name: string;
  description: string;
  moduleCount: number;
  extraTrails: ExtraTrail[];
}

export type ExtraTrail = SharedModel & {
  extraTrailId: number;
  extraCourseId: number;
  courseName: string;
  name: string;
  description: string;
  isActive: boolean;
  workload: number;
  orderNumber: number;
  extraModules: ExtraModule[];
}

export type ExtraModule = SharedModel & {
  extraModuleId: number;
  extraTrailId: number;
  moduleTypeId: number;
  name: string;
  description: string;
  isActive: boolean;
  workload: number;
  orderNumber: number;
  extraSubModules: ExtraSubModule[];
}

export type ExtraSubModule = SharedModel & {
  extraSubModuleId: number;
  extraModuleId: number;
  name: string;
  subModuleTypeId: number;
  description: string;
  isActive: boolean;
  orderNumber: number;
  extraContents: ExtraContent[]
}

export type ExtraContent = SharedModel & {
  extraContentId: number;
  extraSectionId: number;
  extraSubModuleId: number | null;
  assessmentId: number | null;
  contentTypeId: number;
  contentType: ContentType;
  name: string;
  description: string;
  link: string;
  linkDescription: string;
  isActive: boolean;
  duration: number;
  orderNumber: number;
  extraAssessment: ExtraAssessment | null;
}
export type ExtraAssessment = SharedModel & {
  assessmentId: number;
  title: string;
  description: string;
  level: number;
  weight: number;
  limitQuestions: number;
  isActive: boolean;
  questions: Question[];
}