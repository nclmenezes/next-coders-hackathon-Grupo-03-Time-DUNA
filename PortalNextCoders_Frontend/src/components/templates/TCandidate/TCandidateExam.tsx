import OCandidateExam from "../../organisms/OCandidate/OCandidateExam";
import React, {useEffect, useState} from "react";
import StudentExamService, {ExamManagementResponse} from "../../../services/api/student/studentExam.service";
import {useAuth} from "../../../context/AuthProvider/useAuth";
import {useNavigate} from "react-router";
import MLoading from "../../molecules/MLoading";
import OExamExceeded from "../../organisms/OCandidate/OExamExceeded";
import OExamFinished from "../../organisms/OCandidate/OExamFinished";
import OExamInfo from "../../organisms/OCandidate/OExamInfo";

const TCandidateExam = () => {
    const {user} = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [examFinished, setExamFinished] = useState(false);
    const [examExceeded, setExamExceeded] = useState(false);
    const [examManagement, setExamManagement] = useState<ExamManagementResponse>();
    const [examStarted, setExamStarted] = useState(false);

    const fetchData = async () => {
        const studentAllowed = await StudentExamService.GetStudentExamAllowed(user?.id ?? 0);
        if (!studentAllowed) {
            navigate('/');
        }
        const StudentData = await StudentExamService.GetStudentExamManagement(user?.id ?? 0);
        if (StudentData !== null && StudentData !== undefined) {
            setExamManagement(StudentData);
            setExamStarted(true);
            if (StudentData.finishedAt !== null) {
                setExamFinished(true);
            }
            if (StudentData.endAt !== null && StudentData.endAt !== undefined) {
                const endAt = new Date(StudentData?.endAt);
                const now = new Date();
                if (now > endAt) {
                    setExamExceeded(true);
                }
            }
        } else {
            setExamStarted(false);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [])


    return (
        <>
            {
                loading ?
                    <MLoading/>
                    :
                    examExceeded ? <OExamExceeded/> : !examFinished ?
                        <OExamInfo examStarted={examStarted} setExamStarted={setExamStarted}
                                   examManagement={examManagement}/>
                        : <OExamFinished/>
            }
        </>
    )
}

export default TCandidateExam;
