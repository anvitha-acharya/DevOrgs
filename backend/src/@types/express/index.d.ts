import { Request } from 'express';
import { IUser } from '../../models/User'; // Import the IUser interface

declare module 'express' {
  export interface Request {
    user?: IUser; // Use the IUser interface as the type for the user property
  }
}