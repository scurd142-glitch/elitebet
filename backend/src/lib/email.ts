import nodemailer from "nodemailer";
import { env } from "../config/env";

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST || "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

export async function sendWelcomeEmail(email: string, fullName: string) {
  try {
    await transporter.sendMail({
      from: `"Writers Nite" <${env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Writers Nite!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #0A0A0A; padding: 30px; border-radius: 10px; border: 1px solid #FFD700;">
            <h1 style="color: #FFD700; text-align: center; margin-bottom: 20px;">Welcome to Writers Nite!</h1>
            <p style="color: #FFFFFF; font-size: 16px; line-height: 1.6;">Dear ${fullName},</p>
            <p style="color: #E2E8F0; font-size: 14px; line-height: 1.6;">
              Thank you for joining Writers Nite, Africa's premium writing platform. Your account has been created successfully.
            </p>
            <p style="color: #E2E8F0; font-size: 14px; line-height: 1.6;">
              To activate your account and start earning, please pay the registration fee of KES 200 via M-Pesa.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/activate" 
                 style="background: linear-gradient(135deg, #F97316, #FFD700); color: #000000; padding: 12px 32px; text-decoration: none; border-radius: 9999px; font-weight: 700; display: inline-block;">
                Activate Your Account
              </a>
            </div>
            <p style="color: #94A3B8; font-size: 12px; line-height: 1.6; margin-top: 30px;">
              If you have any questions, please contact us at scurd142@gmail.com
            </p>
            <hr style="border-color: #1E1E2E; margin: 20px 0;">
            <p style="color: #94A3B8; font-size: 12px; text-align: center;">
              Writers Nite by SCURDTECHS PRODUCTION LIMITED
            </p>
          </div>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    return false;
  }
}

export async function sendPaymentConfirmationEmail(email: string, fullName: string, amount: number) {
  try {
    await transporter.sendMail({
      from: `"Writers Nite" <${env.EMAIL_USER}>`,
      to: email,
      subject: "Payment Successful - Account Activated!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #0A0A0A; padding: 30px; border-radius: 10px; border: 1px solid #FFD700;">
            <h1 style="color: #FFD700; text-align: center; margin-bottom: 20px;">Payment Successful!</h1>
            <p style="color: #FFFFFF; font-size: 16px; line-height: 1.6;">Dear ${fullName},</p>
            <p style="color: #E2E8F0; font-size: 14px; line-height: 1.6;">
              Your payment of KES ${amount} has been received successfully. Your account is now activated!
            </p>
            <p style="color: #E2E8F0; font-size: 14px; line-height: 1.6;">
              You can now access all writing jobs, manage your wallet, and start earning.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard" 
                 style="background: linear-gradient(135deg, #F97316, #FFD700); color: #000000; padding: 12px 32px; text-decoration: none; border-radius: 9999px; font-weight: 700; display: inline-block;">
                Go to Dashboard
              </a>
            </div>
            <p style="color: #94A3B8; font-size: 12px; line-height: 1.6; margin-top: 30px;">
              If you have any questions, please contact us at scurd142@gmail.com
            </p>
            <hr style="border-color: #1E1E2E; margin: 20px 0;">
            <p style="color: #94A3B8; font-size: 12px; text-align: center;">
              Writers Nite by SCURDTECHS PRODUCTION LIMITED
            </p>
          </div>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Failed to send payment confirmation email:", error);
    return false;
  }
}
