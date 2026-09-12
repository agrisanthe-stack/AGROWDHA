// Add custom type definitions for Express
import { User } from './shared/schema';
import 'express-session';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        role: string;
        [key: string]: any;
      };
    }
  }

  interface Window {
    Cashfree: any;
    Razorpay: any;
  }
}

// Extend express-session
declare module 'express-session' {
  interface SessionData {
    user?: {
      id: number;
      username: string;
      role: string;
      [key: string]: any;
    };
  }
}

export {};