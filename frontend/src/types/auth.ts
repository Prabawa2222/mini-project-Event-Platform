export type UserRole = "user" | "organizer";

export interface LoginFormValuse {
  email: string;
  password: string;
  role: UserRole;
}
