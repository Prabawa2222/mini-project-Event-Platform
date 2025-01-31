export interface IUser {
  id?: string;
  email: string;
  password: string;
  name?: string;
  role?: "user" | "organizer" | "admin";
}

export interface ILoginResponse {
  token: string;
  user: IUser;
}

export interface IAuthError {
  message: string;
  field?: string;
}

export enum UserRole {
  CUSTOMER = "CUSTOMER",
  ORGANIZER = "ORGANIZER",
}
