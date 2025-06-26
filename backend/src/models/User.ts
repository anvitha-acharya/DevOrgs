// models/User.ts (Simple version matching your original)
import mongoose from 'mongoose';

// Define a TypeScript interface for the User document
export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password?: string; // Password might not be selected sometimes
  role: 'student' | 'teacher' | 'admin'; // Example roles, adjust as needed
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: {
    type: String,
    required: true 
  },
  role: {
    type: String,
    default: 'student' 
  },
  isVerified: {
    type: Boolean, 
    default: false 
  },
}, { timestamps: true });

export default mongoose.model('User', userSchema);