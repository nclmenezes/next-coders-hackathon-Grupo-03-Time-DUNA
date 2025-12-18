import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Box, Typography, Button } from "@mui/material";
import QuestionCard from "../../../molecules/MTraining/MClass/MAssessment/MQuestionsCard";
import MLoading from "../../../molecules/MLoading";
import {
  QuestionResultDto,
  SaveAssessmentDto,
} from "../../../../interfaces/StudentContents/Requests/AssessmentRequest";
import { IContentClass } from "../../../../interfaces/CourseService/courseService.interface";
import { AssessmentDto } from "../../../../interfaces/StudentContents/Responses/Assessments";
import { useParams } from "react-router-dom";
import studentAssessmentService from "../../../../services/api/student/studentAssessment.service";
import studentExtraAssessmentService from "../../../../services/api/student/studentExtraAssessment.service";
import { showErrorToast } from "../../../../utils/toast";
import { POST_ASSESSMENT_ERROR_MSG, POST_ATTENDANCE_ERROR_MSG } from "../../../../constants/contentLayout/contentLayout";

interface OAssessment {
  content: IContentClass;
  contentAttendance: () => Promise<boolean>;
  setContentLoading: Dispatch<SetStateAction<boolean>>;
};

export default function OAssessment({
  content,
  contentAttendance,
  setContentLoading
}: OAssessment) {
  const [assessment, setAssessment] = useState<AssessmentDto>();
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [questionResult, setQuestionResult] = useState<QuestionResultDto[]>(
    []
  );

  const [number, setNumber] = useState<number>(0);
  const [numberQuestions, setNumberQuestions] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(true);

  const startQuiz = async () => {
    setLoading(true);
    try {
      setStartDate(new Date());
      let assessmentData;
      if (window.location.pathname.includes("extra")) {
        assessmentData = await studentExtraAssessmentService.GetStudentExtraAssessment(content.assessmentId!);
      } else {
        assessmentData = await studentAssessmentService.GetStudentAssessment(content.assessmentId!);
      }
      setAssessment(assessmentData);
      setNumberQuestions(assessmentData!.questions.length);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startQuiz();
    const savedResults = localStorage.getItem('assessmentResults');

    if (savedResults) {
      setQuestionResult(JSON.parse(savedResults));
    }      
  }, []);

  useEffect(() => {
    localStorage.setItem('assessmentResults', JSON.stringify(questionResult));
  }, [questionResult]);  

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const answerId = parseInt(e.currentTarget.value);
    const questionResult: QuestionResultDto = {
      QuestionId: assessment!.questions[number].questionId,
      AnswerId: answerId,
    };
    setQuestionResult((prevAnswer) => {
      const newAnswer: QuestionResultDto[] = [...prevAnswer];
      newAnswer[number] = questionResult;
      return newAnswer;
    });
  };
  
  const onFinishAnswer = async () => {
    setLoading(true);
    try {
      const save: SaveAssessmentDto = {
        ContentId: content.contentId,
        AssessmentId: content.assessmentId!,
        StartDate: startDate,
        QuestionResults: questionResult
      };

      const postContentAttendance: boolean = await contentAttendance();
      if (!postContentAttendance) return showErrorToast(POST_ATTENDANCE_ERROR_MSG);

      setContentLoading(true);
      let postAssessmentResult: boolean;
      // Apenas um request de save, usando pathname para decidir o serviço
      if (window.location.pathname.includes("extra")) {
        postAssessmentResult = await studentExtraAssessmentService.SaveStudentExtraAssessment(save);
      } else {
        postAssessmentResult = await studentAssessmentService.SaveStudentAssessment(save);
      }
      setContentLoading(false);

      if (!postAssessmentResult) {
        return showErrorToast(POST_ASSESSMENT_ERROR_MSG);
      }

      localStorage.removeItem('assessmentResults');
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (number < numberQuestions - 1 ) {
      setNumber((prev) => prev + 1);
    } else {
      await onFinishAnswer();
    }
  }; 

  const hanldeBack = () => {
    setNumber((prev) => prev - 1);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        px: 2,
      }}
    >
      {loading ? (
        <MLoading />
      ) : (
          <Box id="quiz">
            <Box id="description">
              <Typography
                variant="h4"
                sx={{
                  color: "#212429",
                  fontFamily: "Inter",
                  fontWeight: 600,
                  fontSize: "24px",
                  lineHeight: "29.05px",
                }}
              >
                Avaliação
              </Typography>
            </Box>

            <Box>
            <QuestionCard
            questionText={assessment!.questions[number].text}
            answers={assessment!.questions[number].answers}
            questionResult={questionResult ? questionResult[number] : undefined}
            click={checkAnswer}
          />

              <Box
                id="buttons"
                sx={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box id="questionNumber">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 1,
                      width: "190px",
                      height: "45px",
                      my: 2,
                      textTransform: "none",
                      bgcolor: "#67A10F",
                      "&:hover": { backgroundColor: "#67A10F" },
                      color: "#FFFFFF",
                      fontWeight: 600,
                      fontFamily: "Inter",
                    }}
                  >
                    Pergunta: {number + 1} / {numberQuestions}
                  </Box>
                </Box>

                <Box id="Next-return" sx={{ display: "flex", gap: 2 }}>
                  {number >= 1 && (
                    <Button
                      variant="contained"
                      onClick={hanldeBack}
                      sx={{
                        width: "200px",
                        height: "45px",
                        mt: 2,
                        color: "#4263EB",
                        bgcolor: "#FFFFFF",
                        border: "1.9px solid #4263EB",
                        textTransform: "none",
                        fontFamily: "Inter",
                        fontWeight: 600,
                        "&:hover": { backgroundColor: "#FFFFFF" },
                      }}
                    >
                      Voltar Pergunta
                    </Button>
                  )}

                  {!!questionResult[number] && (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{
                        width: "200px",
                        height: "45px",
                        mt: 2,
                        fontFamily: "Inter",
                        fontWeight: 600,
                        fontSize: "14px",
                        textTransform: "none",
                        bgcolor: "#4263EB",
                        "&:hover": { backgroundColor: "#4263EB" },
                      }}
                    >
                      {number + 1 === numberQuestions
                        ? "Finalizar"
                        : "Próxima pergunta"}
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        )}
    </Box>
  );
}