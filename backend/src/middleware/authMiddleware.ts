import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User'; // Assuming your user model is located here and is named 'User'
import asyncHandler from 'express-async-handler'; // Assuming you have express-async-handler installed

// Define interface for JWT payload
interface JwtPayload {
  id: string; // Assuming the user ID is stored as 'id' in the token payload
}

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token;

  // Placeholder logic to check for a token (e.g., in headers)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Extract token (you'll add verification here later)
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    // If no token, send an unauthorized error
    res.status(401); // Set status before throwing
    throw new Error('Not authorized, no token');
  }

  try {
    // Verify token
    // We assert process.env.JWT_SECRET exists and is a string.
    // A more robust solution would involve checking for its existence on application startup.
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    } 
    const decoded = jwt.verify(token, jwtSecret) as unknown as JwtPayload; // Use your JWT_SECRET from environment variables

    // Check if decoded is valid and has an 'id' property
    if (!decoded || typeof decoded !== 'object' || !decoded.id) {
      throw new Error('Not authorized, token payload invalid');
    }

    // Find user by ID from token payload
    // Assuming your user model has a findById method and the user ID in the token is 'id'
    req.user = await User.findById(decoded.id).select('-password'); // Exclude password
    
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, user not found');
    }

    next();
  } catch (error) {
    res.status(401); // Set status before throwing
    throw new Error('Not authorized, token failed');
  }
});