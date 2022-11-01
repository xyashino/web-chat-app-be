import { UserData } from '../interfaces/user/user-data';
export type UserResponse = Omit<UserData, 'role' | 'hashedPassword'>;
