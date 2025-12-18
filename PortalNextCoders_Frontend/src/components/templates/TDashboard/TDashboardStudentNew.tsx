import React, { useEffect, useState, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import MSliderSection from "../../molecules/MSliderSection/MSliderSection";
import studentNewService, {
  CoursesAll,
} from "../../../services/studentNew/studentNew.service";
import { useAuth } from "../../../context/AuthProvider/useAuth";
import Hand from "../../../assets/Home/hand.png";

const TDashboardStudentNew: React.FC = () => {
  const [courses, setCourses] = useState<CoursesAll>();
  const { user } = useAuth();

  const fetchCourses = async () => {
    try {
      const response = await studentNewService.getDataCourses();
      setCourses(response);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (<Box sx={{ display: "flex", flexDirection: "column" }}> 
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      width: '100%',
      mx: 'auto', p: { xs: 1, md: 4 }
    }}>
      <MSliderSection
        title="Trilha Principal"
        items={courses?.primaryCourses || []}
        primaryCourse={true}
      />
      <MSliderSection
        title="Cursos Extras Matriculados"
        items={courses?.extraCourseRegister || []}
        primaryCourse={false}
      />
      <MSliderSection
        title="Cursos Extras Disponíveis"
        items={courses?.extraCourseAvailable || []}
        primaryCourse={false}
      />
    </Box>
  </Box>
  );
};

export default TDashboardStudentNew;
