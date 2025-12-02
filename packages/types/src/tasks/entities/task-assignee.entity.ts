import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Task } from "./task.entity";

@Entity("task_assignees")
export class TaskAssignee {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "task_id" })
  taskId!: string;

  @Column({ name: "user_id" })
  userId!: string;

  @ManyToOne(() => Task, (task) => task.assignees, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "task_id" })
  task!: Task;

  @CreateDateColumn({ name: "assigned_at" })
  assignedAt!: Date;
}
