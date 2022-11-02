import { UserRole } from '../../user/user-role';
export interface UserData {
  id: string;
  username: string;
  email: string;
  name?: string;
  surname?: string;
  hashedPassword: string;
  role?: UserRole;
  createdAt: Date;
  updatedAt: Date | null;
}
