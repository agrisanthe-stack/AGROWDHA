import { User } from "@shared/schema";
import { Session } from "express-session";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

declare module "express-session" {
  interface SessionData {
    user?: User;
  }
}