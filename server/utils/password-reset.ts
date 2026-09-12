import crypto from 'crypto';
import { storage } from '../storage';
import { sendPasswordResetEmail } from './email-service';

// Generate a random token for password reset
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Set a reset token for a user with expiry time (1 hour from now)
export async function setPasswordResetToken(email: string): Promise<string | null> {
  try {
    // Find the user by email
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return null;
    }
    
    // Generate token and expiry
    const resetToken = generateResetToken();
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // 1 hour expiry
    
    // Update user with reset token and expiry
    await storage.updateUser(user.id, {
      resetToken,
      resetTokenExpiry,
    });
    
    // Send password reset email
    const emailSent = await sendPasswordResetEmail(user, resetToken);
    
    if (!emailSent) {
      console.error('Failed to send password reset email to:', email);
    }
    
    return resetToken;
  } catch (error) {
    console.error('Error setting password reset token:', error);
    return null;
  }
}

// Verify a reset token and return the user if valid
export async function verifyResetToken(token: string): Promise<any> {
  try {
    // Find user with this token
    const user = await storage.getUserByResetToken(token);
    
    if (!user) {
      return null;
    }
    
    // Check if token has expired
    const now = new Date();
    if (!user.resetTokenExpiry || new Date(user.resetTokenExpiry) < now) {
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Error verifying reset token:', error);
    return null;
  }
}

// Clear reset token after password reset
export async function clearResetToken(userId: number): Promise<boolean> {
  try {
    await storage.updateUser(userId, {
      resetToken: null,
      resetTokenExpiry: null,
    });
    return true;
  } catch (error) {
    console.error('Error clearing reset token:', error);
    return false;
  }
}