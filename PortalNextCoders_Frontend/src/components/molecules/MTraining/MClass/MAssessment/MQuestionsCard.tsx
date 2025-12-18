import { Box, Button, Radio, Typography } from "@mui/material";

import React from 'react';
import { AnswerDto } from "../../../../../interfaces/StudentContents/Responses/Assessments";
import { QuestionResultDto } from "../../../../../interfaces/StudentContents/Requests/AssessmentRequest";

interface Props {
  questionText: string;
  answers: AnswerDto[];
  click: (event: React.MouseEvent<HTMLButtonElement>) => void;
  questionResult: QuestionResultDto | undefined;
}

const MQuestionsCard: React.FC<Props> = ({
  questionText,
  answers,
  questionResult,
  click,
}) => {
  return (
    <Box>
      <Box
        sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}
      >
        <Typography
          sx={{
            color: "#212429",
            fontFamily: "Inter",
            fontWeight: 600,
            fontSize: "16px",
          }}
          dangerouslySetInnerHTML={{ __html: questionText }}
        />

        {answers.map((answer: AnswerDto, index) => (
          <Button
            sx={{
              display: "flex",
              justifyContent: "start",
              background:
                questionResult?.AnswerId === answer.answerId ? "#4263EB" : null,
              "&:hover": {
                backgroundColor:
                questionResult?.AnswerId === answer.answerId ? "#4263EB" : null,
              },
              transition: "all 0.3s ease;",
            }}
            key={index}
            value={answer.answerId}
            onClick={click}
          >
            <Radio
              checked={questionResult?.AnswerId === answer.answerId}
              color="secondary"
              sx={{ color: "#4263EB" }}
            />

            <span
              style={{
                color: questionResult?.AnswerId === answer.answerId ? "white" : "#495057",
                fontWeight: 600,
                fontFamily: "Inter",
                fontSize: "14px",
                textTransform: "none",
              }}
              dangerouslySetInnerHTML={{ __html: answer.text }}
            ></span>
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default MQuestionsCard;
