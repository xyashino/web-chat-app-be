import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../../types/user/user-role';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    unique: true,
  })
  username: string;
  @Column({
    unique: true,
  })
  email: string;
  @Column({
    nullable: true,
    default: null,
  })
  name: string | null;
  @Column({
    nullable: true,
    default: null,
  })
  surname: string | null;
  @Column({
    length: 60,
  })
  hashedPassword: string;
  @Column({
    type: 'tinyint',
    unsigned: true,
    default: UserRole.User,
  })
  role: UserRole;
}
