export type AssessmentDto = {
  assessmentId: number;
  title: string;
  description: string;
  questions: QuestionDto[]
};

export type QuestionDto = {
  questionId: number;
  text: string;
  answers: AnswerDto[]
};

export type AnswerDto = {
  answerId: number;
  text: string;
  isCorrect: boolean
};

export type AssessmentManagment ={
  id: number;
  assessmentHeaderId: number;
  questionId: number;
  answerId: number;
  isCorrect: boolean
}

export type ResultQuestionDto = {
  correct: number;
  wrong: number;
  release: boolean;
  studentAnswers: AssessmentManagment[]
};

