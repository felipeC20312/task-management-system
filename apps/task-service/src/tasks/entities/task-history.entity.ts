import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import {Task} from './task.entity';
import {HistoryAction} from '../enums/history-action.enum';

@Entity('task_history')
export class TaskHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({name: 'task_id'})
  taskId: string;

  @Column({name: 'user_id'})
  userId: string; // User who made the change

  @Column({
    type: 'enum',
    enum: HistoryAction,
  })
  action: HistoryAction;

  @Column('jsonb', {nullable: true})
  changes: Record<string, any>;

  @ManyToOne(() => Task, (task) => task.history, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'task_id'})
  task: Task;

  @CreateDateColumn()
  timestamp: Date;
}
