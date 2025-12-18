import AuthService from "./auth.service";
import storageRepository from "../repositories/storage-repository";

class UserService {

    async insertUser(data: any) {
        storageRepository.insert("user", data);
    }

    logout() {
        storageRepository.delete(["user", "token", "student"]);
        return true;
    }

    async getUser() {
        return await storageRepository.get("user");
    }

    async getUserId() {
        const data = await storageRepository.get("user");
        if (!data) return null
        if (!data.id) return null;
        return data.id;
    }

    async getUserEmail() {
        const data = await storageRepository.get("user");
        if (!data) return null
        if (!data.email) return null;
        return data.email;
    }

    async isUserLogged() {
        var user = await this.getUser();
        if (!user) return false;
        if (!user.id) return false;
        if (!AuthService.isValidToken()) return false;
        return true;
    }
    
    async getClass(id: string){
        const data = await storageRepository.get(id);
        if (!data) return null
        return data;
    }
}

export default new UserService();