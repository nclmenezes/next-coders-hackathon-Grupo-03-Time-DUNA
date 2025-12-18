import { ReactElement } from "react";
import {ExtraCourse, ExtraSubModule} from "../../interfaces/courses/responses/Course";


export interface IExtraCourseContext {
    course: ExtraCourse | null;
    setCourse:(data: ExtraCourse)=> void;

    subModule: ExtraSubModule | null;
    setSubModule:(data: ExtraSubModule)=> void;
}

export interface IExtraCourseProvider {
    children: ReactElement | ReactElement[];
}
