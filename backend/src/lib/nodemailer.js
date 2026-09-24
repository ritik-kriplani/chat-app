import nodemailer from "nodemailer";
import { ENV } from "./env.js";

let transporter = null;

export const getTransporter = async () => {
  if (transporter) return transporter;

  // 1. Explicit SMTP credentials
  if (ENV.SMTP_USER && ENV.SMTP_PASS) {
    const isGmail = ENV.SMTP_HOST?.includes("gmail") || ENV.SMTP_USER?.endsWith("@gmail.com");

    if (isGmail) {
      transporter = nodemailer.createTransport({
        service: "gmail",
        pool: true,
        maxConnections: 5,
        connectionTimeout: 5000,
        greetingTimeout: 5000,
        auth: {
          user: ENV.SMTP_USER,
          pass: ENV.SMTP_PASS,
        },
      });
      console.log(`[MAILER] Configured Gmail SMTP transporter (${ENV.SMTP_USER})`);
    } else {
      transporter = nodemailer.createTransport({
        host: ENV.SMTP_HOST || "smtp.gmail.com",
        port: Number(ENV.SMTP_PORT) || 587,
        secure: ENV.SMTP_SECURE === "true" || Number(ENV.SMTP_PORT) === 465,
        pool: true,
        connectionTimeout: 5000,
        greetingTimeout: 5000,
        auth: {
          user: ENV.SMTP_USER,
          pass: ENV.SMTP_PASS,
        },
      });
      console.log(`[MAILER] Configured custom SMTP transporter (${ENV.SMTP_HOST})`);
    }
    return transporter;
  }

  // 2. If no SMTP credentials configured, return null immediately (no network lag)
  return null;
};

export const getSenderEmail = () => {
  return ENV.SMTP_USER || ENV.EMAIL_FROM || "onboarding@resend.dev";
};
