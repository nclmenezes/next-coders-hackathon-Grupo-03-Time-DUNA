import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {useEffect, useState} from "react";
import teamsService from "../../../services/Teams/teams.service";
import {toast} from "react-hot-toast";
import SchoolIcon from '@mui/icons-material/School';
import Calendar from "./Calendar";
import {useParams} from "react-router-dom";
import studentService from "../../../services/student/student.service";
import {useAuth} from "../../../context/AuthProvider/useAuth";

const components = {
    event: (props: any) => {
        return (
            <div style={{background: "#6d99a1", color: "#fff", height: "100%"}}>
                <SchoolIcon style={{color: '#e5dada'}}/> - {props.title}
            </div>
        );
    },
};

export default function ControlCalendar() {
    const {id} = useParams<string>();
    const {user} = useAuth();
    const [events, setEvents] = useState<any>([]);
    let studentClassId = id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (id === ':id') {
                    const data = await studentService.GetClassByStudentId(user?.id || 0);
                    studentClassId = data.studentClassId;
                }
                const academicCalendar = await teamsService.getStudentAcademicCalendar(Number(studentClassId))
                setEvents(academicCalendar?.map((item: any) => ({
                    start: moment(item.eventDate).toDate(),
                    end: moment(item.eventDate).toDate(),
                    title: item.name,
                })));
            } catch (error: any) {
                toast.error(error.message)
            }
        };

        fetchData();
    }, []);
    return (
        <Calendar events={events} components={components}/>
    );
}
