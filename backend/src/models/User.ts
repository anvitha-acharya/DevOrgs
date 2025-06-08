// models/User.ts (Simple version matching your original)
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
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