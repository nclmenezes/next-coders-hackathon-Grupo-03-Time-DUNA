export type CreateAssessmentManagmentDto ={
  AssessmentHeaderId: number;
  QuestionId: number;
  AnswerId: number;
}

export type SaveAssessmentDto = {
  ContentId: number;
  AssessmentId: number;
  StartDate: Date;
  QuestionResults: QuestionResultDto[]
}

export type QuestionResultDto = {
  QuestionId: number;
  AnswerId: number;
}