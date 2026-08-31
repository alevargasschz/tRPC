import mongoose from 'mongoose';
import { TaskDomain, TaskPriority } from '../domain/task.domain';

export interface TaskDocument extends Omit<TaskDomain, 'id'>, mongoose.Document { 
    createdAt: Date;
}

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    priority: { type: String, enum: Object.values(TaskPriority), required: true },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true, collection: 'tasks' });

export const TaskModel = mongoose.model<TaskDocument>('Task', taskSchema);