import { httpAuthProvider, httpStudentProvider } from "../providers";
import { LoginInterface } from "../interfaces/login.interface";
import { TokenInterface } from "../interfaces/token.interface";
import { RecoveryPasswordInterface } from "../interfaces/api/account/recovery-password.interface";
import { ResetPasswordInterface } from "../interfaces/api/account/reset-passord.interface";
import userService from "./user.service";

class AuthService {

  async login(login: LoginInterface) {
    try {
      const { data, status } = await httpAuthProvider.post("v1/account/login", login);
      if (status !== 200) return null;
      return data;
    } catch (error) {
      return null;
    }
  }

  async refreshToken() {
    let refreshToken = { RefreshToken: this.getRefreshToken() };
    if (!refreshToken) return null;
    return await httpAuthProvider.post("refresh-token", refreshToken);
  }

  async RefreshToken(refreshToken: string) {
    try {
      let token = { RefreshToken: refreshToken };
      if (!refreshToken) return null;
      const { data, status } = await httpAuthProvider.post("v1/account/refresh-token", token);

      if (status !== 200) return null;
      return data;

    } catch (error) {
      return null;
    }    
  }

  async insertToken(data: any) {
    //check expiration  
    let token: TokenInterface = {
      token: data.accessToken,
      refreshToken: data.refreshToken,
      expirationToken: this.setExpirationDateToken(data.expiresIn),
      expirationRefreshToken: this.setExpirationDateRefreshToken(),
    }
    localStorage.setItem("token", JSON.stringify(token));
  }

  getToken() {
    if (!this.isValidToken()) userService.logout();
    const data = localStorage.getItem("token");
    if (!data) return null
    let result = JSON.parse(data);
    if (!result.token) return null;
    return result.token;
  }

  getRefreshToken() {
    if (!this.isValidRefreshToken()) return null;
    const data = localStorage.getItem("token");
    if (!data) return null
    var result = JSON.parse(data);
    if (!result.refreshToken) return null;
    return result.refreshToken;
  }

  private setExpirationDateToken(expiration: number) {
    var expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 4);
    return expirationDate;
  }

  private setExpirationDateRefreshToken() {
    var expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours());
    return expirationDate;
  }

  isValidToken() {
    const data = localStorage.getItem("token");
    if (!data) return false;
    var result = JSON.parse(data);
    if (!result.token) return false;
    if (!result.expirationToken) return false;
    var today = new Date(new Date().toUTCString());
    var expiration = new Date(result.expirationToken);
    return today > expiration ? false : true;
  }

  isValidRefreshToken() {
    const data = localStorage.getItem("token");
    if (!data) return false;
    var result = JSON.parse(data);
    if (!result.refreshToken) return false;
    if (!result.expirationRefreshToken) return false;
    var today = new Date(new Date().toUTCString());
    var expiration = new Date(result.expirationRefreshToken);
    return today > expiration ? false : true;
  }

  isLoggedIn() {
    const user = localStorage.getItem('user');
    return user !== null;
  }

  async recoveryPassword(email: RecoveryPasswordInterface) {
    try {
      const { data, status } = await httpAuthProvider.post("v1/account/reset-password", email);
      if (status != 200) return null;
      return data;
    } catch (error) {
      return null;
    }
  }

  async resetPassword(newPassword: ResetPasswordInterface) {
    try {
      const { data, status } = await httpAuthProvider.post("v1/account/new-password", newPassword);
      if (status != 200) return null;
      return data;
    } catch (error) {
      return null;
    }
  }

}

export default new AuthService();