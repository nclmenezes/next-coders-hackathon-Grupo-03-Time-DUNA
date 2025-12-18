import {Box, FormControl, FormLabel, RadioGroup} from "@mui/material";
import React, {useEffect, useState} from 'react';
import parse from 'html-react-parser'
import {useAuth} from "../../../context/AuthProvider/useAuth";
import StudentExamService from "../../../services/api/student/studentExam.service";
import MExamAnswers from "./MExamAnswer";

interface MExamQuestionProps {
    question: any;
    index: number;
    isActive: boolean;
    setAnsweredQuestions: (param?: any) => void;
    type?: number;
    examHeaderId?: number;
}

export default function MExamQuestion({
                                          question,
                                          index,
                                          isActive,
                                          setAnsweredQuestions,
                                          type,
                                          examHeaderId
                                      }: MExamQuestionProps) {
    const [answerSelected, setAnswerSelected] = useState(0);
    const [examManagementId, setExamManagementId] = useState(0);
    const {user} = useAuth();
    const fetchData = async () => {
        const data = await StudentExamService.GetStudentExamManagement(user?.id ?? 0);
        setExamManagementId(data?.examManagments?.find((em: any) => em.questionId === question.questionId)?.id ?? 0);
        setAnswerSelected(data?.examManagments?.find((em: any) => em.questionId === question.questionId)?.answerId ?? 0);

        return data;
    };

    useEffect(() => {
        fetchData();
    }, [])

    function answer(a: any) {
        return (

            <Box key={"answer_" + a.answerId}>
                <MExamAnswers index={a.answerId} answer={a.text} change={answerChecked}
                              checked={answerSelected == a.answerId}/>
            </Box>
        );
    }

    const answerChecked = async (event: any) => {
        setAnswerSelected(event.target.value);
        
        await StudentExamService.AnswerExamQuestion({
            studentId: user?.id ?? 0,
            questionId: question.id,
            answerId: event.target.value,
            examHeaderId: examHeaderId ?? 0,
            examManagementId: examManagementId ?? 0
        }).then(res => res.data)
            .then(async () => {
                await StudentExamService.GetStudentExamManagement(user?.id ?? 0).then(res => res)
                    .then(data => {
                        setAnsweredQuestions(data?.examManagments?.filter((em: { answerId?: number }) => em.answerId));
                    });
            });
    }

    return (
        <Box display={!isActive ? 'none' : ''} sx={{width: '100%'}}>
            <Box sx={{padding: '14px 0'}}>
                <FormLabel sx={{
                    fontFamily: 'Inter',
                    fontStyle: 'normal',
                    fontWeight: '500',
                    fontSize: '16px',
                    lineHeight: '19px',
                    color: '#495057',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    {parse((index + 1) + ' - ' + question.text)}

                </FormLabel>

            </Box>
            <FormControl sx={{width: '100%'}}>
                <Box sx={{width: '100%', alignItems: 'center'}}></Box>
                <RadioGroup
                    aria-labelledby="radio-buttons-group-label"
                    defaultValue=""
                    name="radio-buttons-group"
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap'
                    }}
                >
                    {question.answers.map((a: any) => answer(a))}
                </RadioGroup>
            </FormControl>
        </Box>
    );
}           