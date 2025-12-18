export interface IFinanceRewardWeight {
    activityTypeId: number;
    percentage: number;
};

export interface ICreateFinanceReward {
    studentClassManagementId: number;
    financeRewardTypeId: number;
    financeRewardCalculationTypeId: number;
    bonusValue: number;
    createdBy: number | null;
    financeRewardConfiguration: IFinanceRewardWeight[];
};

export interface IUpdateFinanceReward {
    id: number;
    financeRewardTypeId: number;
    financeRewardCalculationTypeId: number;
    bonusValue: number;
    updatedBy: number | null;
    financeRewardConfiguration: IFinanceRewardWeight[];
};

export interface IFinanceType {
    id: number;
    type: string;
};

export interface IFinanceRewardConfiguration {
    id: number;
    financeRewardId: number;
    activityType: IFinanceType;
    percentage: number;
};

interface IUserTrace {
    createdAt: string;
    createdBy: number;
    updatedAt: string | null;
    updateBy: number | null;
};

export interface IClassFinanceReward extends IUserTrace {
    id: number;
    studentClassManagementId: number;
    financeRewardType: IFinanceType;
    financeRewardCalculationType: IFinanceType;
    bonusValue: number;
    financeRewardConfigurations: IFinanceRewardConfiguration[];
};