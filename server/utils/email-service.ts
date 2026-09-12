import { zeptoEmailService } from './zepto-email-service';
import { type User } from '@shared/schema';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

// Send email using Zepto Mail service
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const success = await zeptoEmailService.sendEmail({
      to: options.to,
      subject: options.subject,
      htmlContent: options.html,
      textContent: options.text
    });
    
    return success;
  } catch (error) {
    console.error('Error sending email:', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}

// Password reset email
export async function sendPasswordResetEmail(user: User, resetToken: string): Promise<boolean> {
  return zeptoEmailService.sendPasswordResetEmail(user, resetToken);
}

// Order confirmation email to customer
export async function sendOrderConfirmationEmail(order: any, customer: User): Promise<boolean> {
  return zeptoEmailService.sendOrderConfirmationEmail(order, customer);
}

// Order status update email to customer
export async function sendOrderStatusUpdateEmail(order: any, customer: User): Promise<boolean> {
  return zeptoEmailService.sendOrderStatusUpdateEmail(order, customer);
}

// Order notification email to farmer
export async function sendOrderNotificationToFarmer(order: any, farmer: User): Promise<boolean> {
  return zeptoEmailService.sendOrderNotificationToFarmer(order, farmer);
}

// Welcome email for new users
export async function sendWelcomeEmail(user: User): Promise<boolean> {
  return zeptoEmailService.sendWelcomeEmail(user);
}

// Booking confirmation email to customer
export async function sendBookingConfirmationEmail(booking: any, event: any, customer: User, dmInfo?: { name: string; phone?: string; email?: string } | null): Promise<boolean> {
  return zeptoEmailService.sendBookingConfirmationEmail(booking, event, customer, dmInfo);
}

// Booking notification email to farmer
export async function sendBookingNotificationToFarmer(booking: any, event: any, farmer: User, customerName: string): Promise<boolean> {
  return zeptoEmailService.sendBookingNotificationToFarmer(booking, event, farmer, customerName);
}

// BIB Quote notification to farmer
export async function sendQuoteNotificationToFarmer(quote: any, product: any, farmer: User, customerName: string): Promise<boolean> {
  return zeptoEmailService.sendQuoteNotificationToFarmer(quote, product, farmer, customerName);
}

// Quote submission confirmation to customer
export async function sendQuoteSubmissionConfirmation(quote: any, product: any, customer: User): Promise<boolean> {
  return zeptoEmailService.sendQuoteSubmissionConfirmation(quote, product, customer);
}

// Quote accepted notification to customer (prompting payment)
export async function sendQuoteAcceptedEmail(quote: any, product: any, customer: User, farmerName: string): Promise<boolean> {
  return zeptoEmailService.sendQuoteAcceptedEmail(quote, product, customer, farmerName);
}

// Booking notification to DM
export async function sendBookingNotificationToDM(booking: any, event: any, dm: User, customerName: string, farmerName: string): Promise<boolean> {
  return zeptoEmailService.sendBookingNotificationToDM(booking, event, dm, customerName, farmerName);
}

// Order notification to DM
export async function sendOrderNotificationToDM(order: any, dm: User, customerName: string, farmerName: string): Promise<boolean> {
  return zeptoEmailService.sendOrderNotificationToDM(order, dm, customerName, farmerName);
}