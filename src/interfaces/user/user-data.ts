import { UserRole } from '../../types/user/user-role';
export interface UserData {
  id: string;
  username: string;
  email: string;
  name?: string;
  surname?: string;
  hashedPassword: string;
  role: UserRole;
}
