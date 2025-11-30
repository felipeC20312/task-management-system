import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import {TaskStatus} from '../enums/task-status.enum';
import {TaskPriority} from '../enums/task-priority.enum';
import {TaskAssignee} from './task-assignee.entity';
import {Comment} from '../../comments/entities/comment.entity';
import {TaskHistory} from './task-history.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({type: 'timestamp'})
  deadline: Date;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @Column({name: 'created_by'})
  createdBy: string; // User ID from auth service

  @OneToMany(() => TaskAssignee, (assignee) => assignee.task, {
    cascade: true,
  })
  assignees: TaskAssignee[];

  @OneToMany(() => Comment, (comment) => comment.task)
  comments: Comment[];

  @OneToMany(() => TaskHistory, (history) => history.task)
  history: TaskHistory[];

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt: Date;
}
