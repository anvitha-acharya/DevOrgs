import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  name: string;
  description?: string;
  project: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  status: 'todo' | 'in progress' | 'done';
  dueDate?: Date;
  createdAt: Date;
}

const TaskSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'todo', enum: ['todo', 'in progress', 'done'] },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model<ITask>('Task', TaskSchema);

export default Task;