export interface IUser {
  name?: string;
  nickname?: string;
  email?: string;
  role?: string;
  id?: number;
  contractorId?: number;
  profileId?: number;
}

export interface IAuthContextData extends IUser {
  isAuthenticated: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signInWithToken: (token: string) => Promise<void>;
  signInWithRefreshToken: (refreshToken: string) => Promise<void>;
  signOut: () => void;
  user?: IUser | null;
}

export interface IAuthProvider {
  children: JSX.Element;
}
