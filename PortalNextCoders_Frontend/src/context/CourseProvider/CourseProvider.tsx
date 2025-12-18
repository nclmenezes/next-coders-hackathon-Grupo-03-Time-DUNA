import { createContext, useContext, useEffect, useState } from "react";

import usePersistedState from "../../hooks/usePersistedState";
import { ICourseContext, ICourseProvider } from "./types";

import { Course, SubModule } from "../../interfaces/courses/responses/Course";

const CourseContext = createContext<ICourseContext | null>(null);

const CourseProvider = ({ children }: ICourseProvider) => {

  const [course, setCourse] = usePersistedState<Course | null>("course", null);
  const [subModule, setSubModule] = usePersistedState<SubModule | null>("subModule", null);

  const courseProviderValue = {
    course,
    setCourse,
    subModule,
    setSubModule
  };

  return (
    <CourseContext.Provider value={courseProviderValue}>
      {children}
    </CourseContext.Provider>
  );
};

function useCourse(): ICourseContext {
  const context = useContext(CourseContext);

  if (!context) {
    throw new Error("useCourse must be used within CourseContext provider");
  }

  return context;
}

export { CourseProvider, useCourse };
