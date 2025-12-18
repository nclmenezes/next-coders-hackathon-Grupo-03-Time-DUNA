import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthProvider/useAuth";
import studentService from "../../../services/student/student.service";
import { UserRoleEnum } from "../../../enums";

const StudentReportLink = () => {
    const { user } = useAuth();
    const [studentTeamId, setStudentTeamId] = useState<number | null>(null);

    useEffect(() => {
        const getStudentTeamId = async () => {
            if (user && user.id && user.role === UserRoleEnum.student) {
                const studentClass = await studentService.GetClassByStudentId(user.id);
                if (studentClass) {
                    setStudentTeamId(studentClass.studentClassId);
                }
            }
        };
        getStudentTeamId();
    }, [user]);

    if (user?.role === UserRoleEnum.student && studentTeamId) {
        return (
            <Link to={`/teamsDetail/${user.id}/${studentTeamId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                Relatório de notas e faltas
            </Link>
        );
    }

    return null;
}

export default StudentReportLink;
