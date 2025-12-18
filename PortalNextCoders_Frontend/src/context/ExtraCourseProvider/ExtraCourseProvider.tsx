import {createContext, useContext} from "react";

import usePersistedState from "../../hooks/usePersistedState";
import {IExtraCourseContext, IExtraCourseProvider} from "./types";

import {ExtraCourse, ExtraSubModule} from "../../interfaces/courses/responses/Course";

const ExtraCourseContext = createContext<IExtraCourseContext | null>(null);

const ExtraCourseProvider = ({children}: IExtraCourseProvider) => {

    const [course, setCourse] = usePersistedState<ExtraCourse | null>("extraCourse", null);
    const [subModule, setSubModule] = usePersistedState<ExtraSubModule | null>("extraSubModule", null);

    const courseProviderValue = {
        course,
        setCourse,
        subModule,
        setSubModule
    };

    return (
        <ExtraCourseContext.Provider value={courseProviderValue}>
            {children}
        </ExtraCourseContext.Provider>
    );
};

function useExtraCourse(): IExtraCourseContext {
    const context = useContext(ExtraCourseContext);

    if (!context) {
        throw new Error("useCourse must be used within CourseContext provider");
    }

    return context;
}

export {ExtraCourseProvider, useExtraCourse};
