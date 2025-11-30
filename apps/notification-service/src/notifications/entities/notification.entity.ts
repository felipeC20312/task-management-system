import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';
import {NotificationType} from '../enums/notification-type.enum';

@Entity('notifications')
@Index(['userId', 'read'])
@Index(['userId', 'createdAt'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({name: 'user_id'})
  userId: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column()
  message: string;

  @Column({name: 'task_id', nullable: true})
  taskId: string;

  @Column({type: 'jsonb', nullable: true})
  metadata: Record<string, any>;

  @Column({default: false})
  read: boolean;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;
}
