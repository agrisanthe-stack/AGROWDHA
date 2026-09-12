import { type User } from "@shared/schema";

interface EmailTemplate {
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
}

class ZeptoEmailService {
  private config: {
    apiKey: string;
    fromEmail: string;
    mailAgentAlias: string;
  };

  constructor() {
    // Use environment variables for secure configuration
    this.config = {
      apiKey: process.env.ZEPTO_API_KEY || "",
      fromEmail: process.env.ZEPTO_FROM_EMAIL || "admin@farmersanthe.com",
      mailAgentAlias: process.env.ZEPTO_MAIL_AGENT_ALIAS || "",
    };

    if (!this.config.apiKey) {
      console.warn("ZEPTO_API_KEY not configured - emails will not be sent");
    }
  }

  async sendEmail(template: EmailTemplate): Promise<boolean> {
    try {
      const requestBody = {
        from: {
          address: this.config.fromEmail,
          name: "Santhe Marketplace",
        },
        to: [
          {
            email_address: {
              address: template.to,
              name: "User",
            },
          },
        ],
        subject: template.subject,
        htmlbody: template.htmlContent,
      };

      const response = await fetch("https://api.zeptomail.in/v1.1/email", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: this.config.apiKey.startsWith("Zoho-enczapikey")
            ? this.config.apiKey
            : `Zoho-enczapikey ${this.config.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("===== ZEPTO REST API ERROR =====");
        console.error("Status:", response.status);
        console.error("Error Response:", errorText);
        console.error("From Address:", this.config.fromEmail);
        console.error(
          `Failed to send "${template.subject}" to: ${template.to}`,
        );
        console.error("===============================");
        return false;
      }

      await response.json();
      return true;
    } catch (error) {
      console.error("Failed to send email via Zepto REST API:", error);
      return false;
    }
  }

  async sendPasswordResetEmail(
    user: User,
    resetToken: string,
  ): Promise<boolean> {
    const resetUrl = `https://farmersanthe.com/reset-password?token=${resetToken}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - Santhe Marketplace</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center; }
          .logo { color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; }
          .content { padding: 40px 30px; }
          .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">🌱 Santhe</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Fresh from Farm to Table</p>
          </div>
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Reset Your Password</h2>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Hello ${user.username || user.email},
            </p>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
              We received a request to reset your password for your Santhe marketplace account. Click the button below to create a new password:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 30px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <span style="word-break: break-all; color: #3b82f6;">${resetUrl}</span>
            </p>
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 20px;">
              This link will expire in 1 hour for security reasons. If you didn't request this password reset, please ignore this email.
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Santhe Marketplace. Connecting farmers with fresh food lovers.</p>
            <p> Vijaynagar, Bengaluru, Karnataka 560040</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: user.email,
      subject: "Reset Your Santhe Marketplace Password",
      htmlContent,
      textContent: `Reset your password: ${resetUrl}`,
    });
  }

  async sendOrderConfirmationEmail(
    order: any,
    customer: User,
  ): Promise<boolean> {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - Santhe Marketplace</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center; }
          .logo { color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; }
          .content { padding: 40px 30px; }
          .order-details { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">🌱 Santhe</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Fresh from Farm to Table</p>
          </div>
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Order Confirmation</h2>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Hello ${customer.username || customer.email},
            </p>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
              Thank you for your order! We've received your order and it's being processed.
            </p>
            <div class="order-details">
              <h3 style="color: #1f2937; margin-top: 0;">Order Details</h3>
              <p><strong>Order ID:</strong> #${order.id}</p>
              <p><strong>Total:</strong> ₹${order.total}</p>
              <p><strong>Status:</strong> ${order.status}</p>
            </div>
            <p style="color: #4b5563; line-height: 1.6;">
              You'll receive another email when your order is ready for delivery. Thank you for supporting local farmers!
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Santhe Marketplace. Connecting farmers with fresh food lovers.</p>
            <p> Vijaynagar, Bengaluru, Karnataka 560040</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: customer.email,
      subject: `Order Confirmation #${order.id} - Santhe Marketplace`,
      htmlContent,
      textContent: `Order #${order.id} confirmed. Total: ₹${order.total}`,
    });
  }

  async sendOrderStatusUpdateEmail(
    order: any,
    customer: User,
  ): Promise<boolean> {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Update - Santhe Marketplace</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center; }
          .logo { color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; }
          .content { padding: 40px 30px; }
          .status-update { background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">🌱 Santhe</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Fresh from Farm to Table</p>
          </div>
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Order Status Update</h2>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Hello ${customer.username || customer.email},
            </p>
            <div class="status-update">
              <h3 style="color: #1f2937; margin-top: 0;">Order #${order.id}</h3>
              <p><strong>New Status:</strong> ${order.status}</p>
              <p><strong>Total:</strong> ₹${order.total}</p>
            </div>
            <p style="color: #4b5563; line-height: 1.6;">
              Thank you for choosing Santhe marketplace for your fresh produce needs!
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Santhe Marketplace. Connecting farmers with fresh food lovers.</p>
            <p> Vijaynagar, Bengaluru, Karnataka 560040</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: customer.email,
      subject: `Order #${order.id} Status Update - Santhe Marketplace`,
      htmlContent,
      textContent: `Order #${order.id} status: ${order.status}`,
    });
  }

  async sendOrderNotificationToFarmer(
    order: any,
    farmer: User,
  ): Promise<boolean> {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Order - Santhe Marketplace</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center; }
          .logo { color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; }
          .content { padding: 40px 30px; }
          .order-alert { background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">🌱 Santhe</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Fresh from Farm to Table</p>
          </div>
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 20px;">New Order Received!</h2>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Hello ${farmer.username || farmer.email},
            </p>
            <div class="order-alert">
              <h3 style="color: #1f2937; margin-top: 0;">Order #${order.id}</h3>
              <p><strong>Customer:</strong> ${order.customerName}</p>
              <p><strong>Total:</strong> ₹${order.total}</p>
              <p><strong>Status:</strong> ${order.status}</p>
            </div>
            <p style="color: #4b5563; line-height: 1.6;">
              Please log in to your dashboard to view the complete order details and update the status when ready.
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Santhe Marketplace. Connecting farmers with fresh food lovers.</p>
            <p> Vijaynagar, Bengaluru, Karnataka 560040</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: farmer.email,
      subject: `New Order #${order.id} - Santhe Marketplace`,
      htmlContent,
      textContent: `New order #${order.id} from ${order.customerName}. Total: ₹${order.total}`,
    });
  }

  // Welcome email for new users
  async sendWelcomeEmail(user: User): Promise<boolean> {
    const loginUrl = "https://farmersanthe.com/login";
    const roleMessage =
      user.role === "farmer"
        ? "Start listing your fresh produce and connect with customers across Karnataka!"
        : "Explore fresh produce directly from local farmers!";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Santhe Marketplace</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center; }
          .logo { color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; }
          .content { padding: 40px 30px; }
          .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .features { background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">🌱 Santhe</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Fresh from Farm to Table</p>
          </div>
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Welcome to Santhe! 🎉</h2>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Hello ${user.username || user.email},
            </p>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Thank you for joining Santhe Marketplace! ${roleMessage}
            </p>
            <div class="features">
              <h3 style="color: #1f2937; margin-top: 0;">What you can do:</h3>
              <ul style="color: #4b5563; line-height: 1.8;">
                ${
                  user.role === "farmer"
                    ? `
                <li>List your fresh produce and set your prices</li>
                <li>Manage orders and track sales</li>
                <li>Get AI-powered ZBNF farming recommendations</li>
                <li>Host farm events and experiences</li>
                `
                    : `
                <li>Browse fresh produce from local farmers</li>
                <li>Place orders for home delivery</li>
                <li>Submit bulk quotes for wholesale purchases</li>
                <li>Book exciting farm experiences</li>
                `
                }
              </ul>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${loginUrl}" class="button">Get Started</a>
            </div>
          </div>
          <div class="footer">
            <p>© 2024 Santhe Marketplace. Connecting farmers with fresh food lovers.</p>
            <p> Vijaynagar, Bengaluru, Karnataka 560040</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: user.email,
      subject: "Welcome to Santhe Marketplace! 🌱",
      htmlContent,
      textContent: `Welcome to Santhe Marketplace, ${user.username}! ${roleMessage}`,
    });
  }

  // Booking confirmation for customer
  async sendBookingConfirmationEmail(
    booking: any,
    event: any,
    customer: User,
    dmInfo?: {
      name: string;
      phone?: string;
      email?: string;
      address?: string;
    } | null,
  ): Promise<boolean> {
    const bookingUrl = `https://farmersanthe.com/dashboard/events`;

    const dmContactSection = dmInfo
      ? `
            <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
              <h3 style="color: #1e40af; margin-top: 0;">📞 Your Event Coordinator</h3>
              <p style="color: #1e3a8a; margin-bottom: 5px;"><strong>Name:</strong> ${dmInfo.name}</p>
              ${dmInfo.phone ? `<p style="color: #1e3a8a; margin-bottom: 5px;"><strong>Phone:</strong> <a href="tel:${dmInfo.phone}" style="color: #2563eb;">${dmInfo.phone}</a></p>` : ""}
              ${dmInfo.email ? `<p style="color: #1e3a8a; margin-bottom: 5px;"><strong>Email:</strong> <a href="mailto:${dmInfo.email}" style="color: #2563eb;">${dmInfo.email}</a></p>` : ""}
              ${dmInfo.address ? `<p style="color: #1e3a8a; margin-bottom: 5px;"><strong>Address:</strong> ${dmInfo.address}</p>` : ""}
              <p style="color: #6b7280; font-size: 13px; margin-top: 10px;">
                Contact your event coordinator for any questions about the event, directions, or special requirements.
              </p>
            </div>`
      : "";

    const guestsText = `${booking.adultSeats || booking.numberOfGuests || 1} Adult(s)${booking.childSeats > 0 ? `, ${booking.childSeats} Child(ren)` : ""}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation - Santhe Marketplace</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center; }
          .logo { color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; }
          .content { padding: 40px 30px; }
          .booking-details { background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e; }
          .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">🌱 Santhe</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Farm Events & Experiences</p>
          </div>
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Booking Confirmed! 🎉</h2>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Hello ${customer.name || customer.username || customer.email},
            </p>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Your booking for the farm event has been confirmed. Get ready for an amazing experience!
            </p>
            <div class="booking-details">
              <h3 style="color: #1f2937; margin-top: 0;">Booking Details</h3>
              <p><strong>Event:</strong> ${event.title}</p>
              <p><strong>Booking ID:</strong> #${booking.id}</p>
              <p><strong>Date:</strong> ${booking.bookingDate}</p>
              <p><strong>Guests:</strong> ${guestsText}</p>
              <p><strong>Location:</strong> ${event.location}</p>
              <p><strong>Total Paid:</strong> ₹${booking.totalAmount}</p>
            </div>
            ${dmContactSection}
            <div style="text-align: center; margin: 30px 0;">
              <a href="${bookingUrl}" class="button">View My Bookings</a>
            </div>
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              Please arrive 15 minutes before the event start time. If you need to cancel, please do so at least 24 hours in advance.
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Santhe Marketplace. Connecting farmers with fresh food lovers.</p>
            <p> Vijaynagar, Bengaluru, Karnataka 560040</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const dmTextInfo = dmInfo
      ? ` Event Coordinator: ${dmInfo.name}${dmInfo.phone ? `, Phone: ${dmInfo.phone}` : ""}${dmInfo.email ? `, Email: ${dmInfo.email}` : ""}`
      : "";

    return this.sendEmail({
      to: customer.email,
      subject: `Booking Confirmed - ${event.title} | Santhe`,
      htmlContent,
      textContent: `Your booking #${booking.id} for ${event.title} on ${booking.bookingDate} is confirmed. Total: ₹${booking.totalAmount}.${dmTextInfo}`,
    });
  }

  // Booking notification for farmer
  async sendBookingNotificationToFarmer(
    booking: any,
    event: any,
    farmer: User,
    customerName: string,
  ): Promise<boolean> {
    const dashboardUrl = "https://farmersanthe.com/farmer/events";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Event Booking - Santhe Marketplace</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center; }
          .logo { color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; }
          .content { padding: 40px 30px; }
          .booking-alert { background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
          .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">🌱 Santhe</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Farm Events & Experiences</p>
          </div>
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 20px;">New Booking Received! 🎉</h2>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Hello ${farmer.username || farmer.email},
            </p>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Great news! Someone has booked your farm event.
            </p>
            <div class="booking-alert">
              <h3 style="color: #1f2937; margin-top: 0;">Booking Details</h3>
              <p><strong>Event:</strong> ${event.title}</p>
              <p><strong>Customer:</strong> ${customerName}</p>
              <p><strong>Booking ID:</strong> #${booking.id}</p>
              <p><strong>Date:</strong> ${booking.bookingDate}</p>
              <p><strong>Number of Guests:</strong> ${booking.numberOfGuests}</p>
              <p><strong>Amount:</strong> ₹${booking.totalAmount}</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${dashboardUrl}" class="button">View Dashboard</a>
            </div>
          </div>
          <div class="footer">
            <p>© 2024 Santhe Marketplace. Connecting farmers with fresh food lovers.</p>
            <p> Vijaynagar, Bengaluru, Karnataka 560040</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: farmer.email,
      subject: `New Booking for ${event.title} | Santhe`,
      htmlContent,
      textContent: `New booking #${booking.id} from ${customerName} for ${event.title} on ${booking.bookingDate}. Guests: ${booking.numberOfGuests}, Amount: ₹${booking.totalAmount}`,
    });
  }

  // BIB Quote submission notification to farmer
  async sendQuoteNotificationToFarmer(
    quote: any,
    product: any,
    farmer: User,
    customerName: string,
  ): Promise<boolean> {
    const dashboardUrl = "https://farmersanthe.com/farmer/quotes";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New BIB Quote Request - Santhe Marketplace</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center; }
          .logo { color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; }
          .content { padding: 40px 30px; }
          .quote-details { background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
          .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">📦 Santhe BIB</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Buy in Bulk</p>
          </div>
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 20px;">New Quote Request! 💰</h2>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Hello ${farmer.username || farmer.email},
            </p>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              You've received a new bulk purchase quote request for your product.
            </p>
            <div class="quote-details">
              <h3 style="color: #1f2937; margin-top: 0;">Quote Details</h3>
              <p><strong>Product:</strong> ${product.name}</p>
              <p><strong>Quote ID:</strong> #${quote.id}</p>
              <p><strong>Customer:</strong> ${customerName}</p>
              <p><strong>Quantity:</strong> ${quote.quantity} ${product.unit || "units"}</p>
              <p><strong>Offered Price:</strong> ₹${quote.quotedPrice}</p>
              ${quote.notes ? `<p><strong>Notes:</strong> ${quote.notes}</p>` : ""}
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${dashboardUrl}" class="button">Review Quote</a>
            </div>
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              Log in to your dashboard to accept or reject this quote.
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Santhe Marketplace. Connecting farmers with fresh food lovers.</p>
            <p> Vijaynagar, Bengaluru, Karnataka 560040</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: farmer.email,
      subject: `New BIB Quote Request for ${product.name} | Santhe`,
      htmlContent,
      textContent: `New bulk quote #${quote.id} from ${customerName} for ${product.name}. Quantity: ${quote.quantity}, Offered: ₹${quote.quotedPrice}`,
    });
  }

  // Quote submission confirmation to customer
  async sendQuoteSubmissionConfirmation(
    quote: any,
    product: any,
    customer: User,
  ): Promise<boolean> {
    const quotesUrl = "https://farmersanthe.com/customer/quotes";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Quote Submitted - Santhe Marketplace</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center; }
          .logo { color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; }
          .content { padding: 40px 30px; }
          .quote-details { background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
          .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">📦 Santhe BIB</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Buy in Bulk</p>
          </div>
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Quote Submitted! ✅</h2>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Hello ${customer.username || customer.email},
            </p>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Your bulk purchase quote has been submitted successfully. The farmer will review and respond soon.
            </p>
            <div class="quote-details">
              <h3 style="color: #1f2937; margin-top: 0;">Quote Details</h3>
              <p><strong>Product:</strong> ${product.name}</p>
              <p><strong>Quote ID:</strong> #${quote.id}</p>
              <p><strong>Quantity:</strong> ${quote.quantity} ${product.unit || "units"}</p>
              <p><strong>Your Offer:</strong> ₹${quote.quotedPrice}</p>
              <p><strong>Status:</strong> Pending</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${quotesUrl}" class="button">Track My Quotes</a>
            </div>
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              You'll receive an email when the farmer responds to your quote.
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Santhe Marketplace. Connecting farmers with fresh food lovers.</p>
            <p> Vijaynagar, Bengaluru, Karnataka 560040</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: customer.email,
      subject: `Quote Submitted for ${product.name} | Santhe`,
      htmlContent,
      textContent: `Your quote #${quote.id} for ${product.name} has been submitted. Quantity: ${quote.quantity}, Offered: ₹${quote.quotedPrice}`,
    });
  }

  // Quote accepted notification to customer - prompting payment
  async sendQuoteAcceptedEmail(
    quote: any,
    product: any,
    customer: User,
    farmerName: string,
  ): Promise<boolean> {
    const paymentUrl = `https://farmersanthe.com/quote-checkout/${quote.id}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Quote Accepted - Make Payment | Santhe Marketplace</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; }
          .logo { color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; }
          .content { padding: 40px 30px; }
          .quote-details { background-color: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
          .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .urgent-box { background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #f59e0b; text-align: center; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">🎉 Quote Accepted!</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Great news from Santhe BIB</p>
          </div>
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Your Quote Has Been Accepted! ✅</h2>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Hello ${customer.username || customer.email},
            </p>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Great news! <strong>${farmerName}</strong> has accepted your bulk purchase quote. Please complete the payment to finalize your order.
            </p>
            <div class="quote-details">
              <h3 style="color: #1f2937; margin-top: 0;">Accepted Quote Details</h3>
              <p><strong>Product:</strong> ${product.name}</p>
              <p><strong>Quote ID:</strong> #${quote.id}</p>
              <p><strong>Quantity:</strong> ${quote.quantity} ${product.unit || "units"}</p>
              <p><strong>Agreed Price:</strong> ₹${quote.quotedPrice}</p>
              <p><strong>Farmer:</strong> ${farmerName}</p>
              <p><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">Accepted</span></p>
            </div>
            <div class="urgent-box">
              <p style="margin: 0; color: #92400e; font-weight: 600;">
                ⏰ Please complete payment soon to secure your order!
              </p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${paymentUrl}" class="button">Pay Now & Complete Order</a>
            </div>
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              If you have any questions, please contact us at support@farmersanthe.com
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Santhe Marketplace. Connecting farmers with fresh food lovers.</p>
            <p> Vijaynagar, Bengaluru, Karnataka 560040</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: customer.email,
      subject: `Your Quote Accepted! Complete Payment for ${product.name} | Santhe`,
      htmlContent,
      textContent: `Great news! Your quote #${quote.id} for ${product.name} has been accepted by ${farmerName}. Please complete payment to finalize your order.`,
    });
  }

  // Notification to DM about new booking in their district
  async sendBookingNotificationToDM(
    booking: any,
    event: any,
    dm: User,
    customerName: string,
    farmerName: string,
  ): Promise<boolean> {
    const dashboardUrl = "https://farmersanthe.com/dm/dashboard";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Booking in Your District - Santhe Marketplace</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 30px; text-align: center; }
          .logo { color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; }
          .content { padding: 40px 30px; }
          .booking-info { background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
          .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">🌱 Santhe DM</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">District Manager Update</p>
          </div>
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 20px;">New Event Booking in Your District</h2>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Hello ${dm.username || dm.email},
            </p>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              A new event booking has been made in your district.
            </p>
            <div class="booking-info">
              <h3 style="color: #1f2937; margin-top: 0;">Booking Details</h3>
              <p><strong>Event:</strong> ${event.title}</p>
              <p><strong>Farmer:</strong> ${farmerName}</p>
              <p><strong>Customer:</strong> ${customerName}</p>
              <p><strong>Booking ID:</strong> #${booking.id}</p>
              <p><strong>Date:</strong> ${booking.bookingDate}</p>
              <p><strong>Guests:</strong> ${booking.numberOfGuests}</p>
              <p><strong>Amount:</strong> ₹${booking.totalAmount}</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${dashboardUrl}" class="button">View Dashboard</a>
            </div>
          </div>
          <div class="footer">
            <p>© 2024 Santhe Marketplace. Connecting farmers with fresh food lovers.</p>
            <p> Vijaynagar, Bengaluru, Karnataka 560040</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: dm.email,
      subject: `New Event Booking - ${event.title} | Santhe DM`,
      htmlContent,
      textContent: `New booking in your district: ${event.title} by ${farmerName}. Customer: ${customerName}, Date: ${booking.bookingDate}, Amount: ₹${booking.totalAmount}`,
    });
  }

  // Order notification to DM
  async sendOrderNotificationToDM(
    order: any,
    dm: User,
    customerName: string,
    farmerName: string,
  ): Promise<boolean> {
    const dashboardUrl = "https://farmersanthe.com/dm/dashboard";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Order in Your District - Santhe Marketplace</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 30px; text-align: center; }
          .logo { color: #ffffff; font-size: 28px; font-weight: bold; margin: 0; }
          .content { padding: 40px 30px; }
          .order-info { background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
          .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">🌱 Santhe DM</h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">District Manager Update</p>
          </div>
          <div class="content">
            <h2 style="color: #1f2937; margin-bottom: 20px;">New Order in Your District</h2>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Hello ${dm.username || dm.email},
            </p>
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              A new order has been placed in your district.
            </p>
            <div class="order-info">
              <h3 style="color: #1f2937; margin-top: 0;">Order Details</h3>
              <p><strong>Order ID:</strong> #${order.id}</p>
              <p><strong>Farmer:</strong> ${farmerName}</p>
              <p><strong>Customer:</strong> ${customerName}</p>
              <p><strong>Total:</strong> ₹${order.total}</p>
              <p><strong>Status:</strong> ${order.status}</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${dashboardUrl}" class="button">View Dashboard</a>
            </div>
          </div>
          <div class="footer">
            <p>© 2024 Santhe Marketplace. Connecting farmers with fresh food lovers.</p>
            <p> Vijaynagar, Bengaluru, Karnataka 560040</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: dm.email,
      subject: `New Order #${order.id} in Your District | Santhe DM`,
      htmlContent,
      textContent: `New order in your district: #${order.id}. Farmer: ${farmerName}, Customer: ${customerName}, Total: ₹${order.total}`,
    });
  }
}

export const zeptoEmailService = new ZeptoEmailService();
