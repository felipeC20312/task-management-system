import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import {User} from './user.entity';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;

  @ManyToOne(() => User)
  user: User;

  @Column({name: 'expires_at'})
  expiresAt: Date;

  @Column({default: false})
  revoked: boolean;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;
}
