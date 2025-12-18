import { SharedModel } from "../SharedModel";
import { CreateCourseDto
  , CreateTrailDto
  , CreateModuleDto
  , CreateSubModuleDto
  , CreateContentDto,
  CreateAnswerDto} from "./CreatesDto";

export type UpdateOrDeleteCourseDto = CreateCourseDto & {
  studentClassId: number;
}

export type UpdateOrDeleteTrailDto = CreateTrailDto & {
  trailId: number;
  isActive: boolean;
}

export type UpdateOrDeleteModuleDto = CreateModuleDto & {
  moduleId: number;
  isActive: boolean;
}

export type UpdateOrDeleteSubModuleDto = CreateSubModuleDto & {
  subModuleId: number;
  isActive: boolean;
}

export type UpdateOrDeleteContentDto = CreateContentDto & {
  contentId: number;
  isActive: boolean;
}

export type UpdateOrDeleteQuestionDto = SharedModel & {
  questionId: number;
  assessmentId: number;
  text: string;
  isActive: boolean;
  answers: UpdateOrDeleteAnswerDto[];
}

export type UpdateOrDeleteAnswerDto = CreateAnswerDto & {
  answerId: number;
  isActive: boolean;
}