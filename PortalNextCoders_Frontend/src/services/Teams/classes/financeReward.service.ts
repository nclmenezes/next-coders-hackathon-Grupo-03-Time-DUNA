import { httpClassManagementProvider } from "../../../providers";
import {
    IClassFinanceReward,
    ICreateFinanceReward,
    IUpdateFinanceReward,
    IFinanceType
} from "../../../interfaces/teams/financeReward.interfaces";

class FinanceRewardService {
    async GetManagementClassReward(
        studentClassManagementId: number
    ): Promise<IClassFinanceReward | null> {
        try {
            const response = await httpClassManagementProvider
                .get<IClassFinanceReward>(`finances/reward/${studentClassManagementId}`);
            if (response.status === 200) return response.data;
            return null;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    };

    async CreateFinanceReward(body: ICreateFinanceReward): Promise<IClassFinanceReward | null> {
        try {
            const response = await httpClassManagementProvider.post<IClassFinanceReward>('finances/reward', body);
            if (response.status === 201) return response.data;
            return null;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    };

    async UpdateFinanceReward(body: IUpdateFinanceReward): Promise<boolean> {
        try {
            const response = await httpClassManagementProvider.put('finances/reward', body);
            return response.status === 204;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    };

    async DeleteFinanceReward(financeRewardId: number): Promise<boolean> {
        try {
            const response = await httpClassManagementProvider.delete(`finances/reward/${financeRewardId}`);
            if (response.status !== 204) return false;
            return true;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    };

    async GetFinanceRewardCalculationTypes(): Promise<IFinanceType[]> {
        try {
            const response = await httpClassManagementProvider.get<IFinanceType[]>('finances/reward/calculation/type');
            if (response.status === 200) return response.data;
            return [];
        }
        catch (error) {
            console.error(error);
            return [];
        }
    };

    async GetFinanceRewardTypes(): Promise<IFinanceType[]> {
        try {
            const response = await httpClassManagementProvider.get<IFinanceType[]>('finances/reward/type');
            if (response.status === 200) return response.data;
            return [];
        }
        catch (error) {
            console.error(error);
            return [];
        }
    };

    async GetActivityTypes(): Promise<IFinanceType[]> {
        try {
            const response = await httpClassManagementProvider.get<IFinanceType[]>('studentclass/activity/type');
            if (response.status === 200) return response.data;
            return [];
        }
        catch (error) {
            console.error(error);
            return [];
        }
    };
}

export default new FinanceRewardService();