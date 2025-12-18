import { useState, useEffect } from 'react';
import studentNewService, { CoursesAll } from '../services/studentNew/studentNew.service';
import { UserRoleEnum } from '../enums';
import { useAuth } from '../context/AuthProvider/useAuth';

export const useStudentCourses = () => {
  const [courses, setCourses] = useState<CoursesAll | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      if (user?.role !== UserRoleEnum.student) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await studentNewService.getDataCourses();
        setCourses(response);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user?.role]);

  const hasPrimaryCourses = () => {
    return courses?.primaryCourses && courses.primaryCourses.length > 0;
  };
 
  const getFirstExtraCourse = () => { 
    if (courses?.extraCourseRegister && courses.extraCourseRegister.length > 0) {
      return courses.extraCourseRegister[0];
    } 
    return null;
  };

  return {
    courses,
    loading,
    hasPrimaryCourses,
    getFirstExtraCourse
  };
};
