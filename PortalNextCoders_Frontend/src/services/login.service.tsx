import { LoginInterface } from "../interfaces/login.interface";
import AuthService from "./auth.service";
import UserService from "./user.service";
import { ResetPasswordInterface } from "../interfaces/api/account/reset-passord.interface";

class LoginService {

    async Login(data: LoginInterface) {
        const result = await AuthService.login(data);
        
        if (result == null) 
            return null;

        UserService.insertUser(result.data.userToken);
        AuthService.insertToken(result.data);
        
        return result;
    }

    async RefreshToken() {
        if (!AuthService.isValidRefreshToken()) 
            return null;
            
        const result = await AuthService.refreshToken();
        if (result == null) 
            throw new Error();
        if (result.status != 200) 
            throw new Error();

        UserService.logout();
        UserService.insertUser(result.data.userToken);
        AuthService.insertToken(result.data);
        return result.data;
    }

    async ResetPassword(data: ResetPasswordInterface) {
        const result = await AuthService.resetPassword(data);
        if (result == null) return null;
        // return result.data;
        return result;
    }

}

export default new LoginService();