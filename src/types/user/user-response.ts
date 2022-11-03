import { UserData } from '../interfaces/user/user-data';
export type UserResponse = Omit<
  UserData,
  'role' | 'hashedPassword' | 'createdAt' | 'updatedAt' | 'email'
> & {
  createdAt?: UserData['createdAt'];
  updatedAt?: UserData['updatedAt'];
  email?: UserData['email'];
};
