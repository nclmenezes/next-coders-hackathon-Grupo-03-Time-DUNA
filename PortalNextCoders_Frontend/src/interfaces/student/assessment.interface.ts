export type Assessment = {
    AssessmentId: number;
    QuestionId: number;
    ContentId: number;
    Question: string;
    TotalQuestions: number;
    Answers: Answers[];
  };

  export type Answers = {
    AnswerId: number;
    Answer: string;
    IsCorrect: boolean;
  }

  export type Result = {
    assessmentId: number;
    status: string;
    correctAnswers: number;
    wrongAnswers: number;
}
