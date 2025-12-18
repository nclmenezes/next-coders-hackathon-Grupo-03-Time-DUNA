import { ReactElement } from "react";
import { Course, SubModule, Trail } from "../../interfaces/courses/responses/Course";


export interface ICourseContext {
  course: Course | null;
  setCourse:(data: Course)=> void;

  subModule: SubModule | null;
  setSubModule:(data: SubModule)=> void;
}

export interface ICourseProvider {
  children: ReactElement | ReactElement[];
}
