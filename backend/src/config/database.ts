/**
 * @fileoverview Handles the connection to the MongoDB database using Mongoose.
 */
import mongoose from 'mongoose';
import { MONGO_URI } from './index';
import * as Logger from '../utils/logger';

/**
 * Connects to the MongoDB database.
 * The application will exit if the connection fails.
 */
export const connectDB = async () => {
  try {
    // Mongoose connection options
   
    
    await mongoose.connect(MONGO_URI);
    
    Logger.info('MongoDB connected successfully.', 'Database');

  } catch (err) {
    Logger.error('MongoDB connection error. The application will now exit.', err, 'Database');
    process.exit(1);
  }
};
