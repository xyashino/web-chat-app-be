import { UserRoleEnum } from '../../user/user-role.enum';
export interface UserData {
  id: string;
  username: string;
  email: string;
  name?: string;
  surname?: string;
  hashedPassword: string;
  role?: UserRoleEnum;
  createdAt: Date;
  updatedAt: Date | null;
}
