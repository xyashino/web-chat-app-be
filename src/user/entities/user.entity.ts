import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../../types/user/user-role';
import { UserData } from '../../types/interfaces/user/user-data';

@Entity()
export class User extends BaseEntity implements UserData {
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
    nullable: true,
    default: null,
  })
  currentTokenId: string | null;
  @Column({
    type: 'tinyint',
    unsigned: true,
    default: UserRole.User,
  })
  role: UserRole;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @Column({ type: 'timestamp', nullable: true, default: null })
  updatedAt: Date | null;
}
