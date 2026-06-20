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
      from: `"EliteBet" <${env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to EliteBet!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #111111; padding: 30px; border-radius: 10px; border: 1px solid #00a651;">
            <h1 style="color: #00a651; text-align: center; margin-bottom: 20px;">Welcome to EliteBet!</h1>
            <p style="color: #ffffff; font-size: 16px; line-height: 1.6;">Dear ${fullName},</p>
            <p style="color: #888888; font-size: 14px; line-height: 1.6;">
              Thank you for joining EliteBet, Kenya's simulation betting platform. Your account has been created successfully.
            </p>
            <p style="color: #888888; font-size: 14px; line-height: 1.6;">
              Deposit via M-Pesa to load your balance and start playing.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/wallet" 
                 style="background: #00a651; color: #ffffff; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-weight: 700; display: inline-block;">
                Deposit Now
              </a>
            </div>
            <p style="color: #888888; font-size: 12px; text-align: center;">
              EliteBet — Simulation betting for entertainment only.
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
      from: `"EliteBet" <${env.EMAIL_USER}>`,
      to: email,
      subject: "Deposit Successful!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #111111; padding: 30px; border-radius: 10px; border: 1px solid #00a651;">
            <h1 style="color: #00a651; text-align: center; margin-bottom: 20px;">Deposit Successful!</h1>
            <p style="color: #ffffff; font-size: 16px; line-height: 1.6;">Dear ${fullName},</p>
            <p style="color: #888888; font-size: 14px; line-height: 1.6;">
              Your deposit of KES ${amount} has been received. Your balance has been updated.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/" 
                 style="background: #00a651; color: #ffffff; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-weight: 700; display: inline-block;">
                Start Playing
              </a>
            </div>
            <p style="color: #888888; font-size: 12px; text-align: center;">
              EliteBet — Simulation betting for entertainment only.
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
