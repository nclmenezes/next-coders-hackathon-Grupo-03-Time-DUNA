import {Outlet, useLocation, useParams} from "react-router";
import {Box, Link} from "@mui/material";
import OSectionProgress from "../organisms/OTraining/OSectionProgress";
import {Section} from "../molecules/MNavbar";
import MNavbarInline from "../molecules/MNavBarInline";
import { useStudent } from "../../context/StudentProvider/StudentProvider";
import { useEffect, useState } from "react";
import studentCourseService from "../../services/api/student/studentCourse.service";
import StudentCourseExtraService from "../../services/api/student/studentCourseExtra.service";
import MLoading from "../molecules/MLoading";

const sectionsRoutesTraining: Section[] = [
    {
        path: "",
        title: "Trilhas de formação",
        modal: false,
    },
]

function TrainingLayout() {
    const { setClass } = useStudent();
    const { courseExtraId } = useParams<{ courseExtraId: string }>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
    const fetchData = async () => { 
      try {
        setLoading(true);
        if (courseExtraId === undefined) {
          const data = await studentCourseService.GetClasses();
          setClass(data);
        }
        else {
          const data = await StudentCourseExtraService.GetExtraCourse(parseInt(courseExtraId));
          setClass(data);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseExtraId]);

    return (
        <>
            {!loading ? (<>
                <OSectionProgress
                    value={10}
                    title="Test Desenvolvedor Backend Junior - ASP.Net"
                    dataInit="Jan 2023"
                    dataFinaly="fev 2023"
            />
            
            {/* <MNavbarInline sections={sectionsRoutesTraining}/> */}
            {/* <MNavbarExam /> */}
            <Box>
                <Outlet/>
            </Box>
            </>) : <MLoading />}
        </>
    );
}

export default TrainingLayout;
