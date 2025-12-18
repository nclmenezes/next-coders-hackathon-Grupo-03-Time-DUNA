export type StudentPaymentDto = {
  id: number;
  studentId: number;
  studentClassId?: number;
  contractorRewardId: number;
  monthlyPayment: number;  
  periodReward: number;
  presence: number;
  grade: number;
  classPeriodId: number;
  periodNumber:number;
  currentPeriod: boolean;
  closedPeriod: boolean;
};