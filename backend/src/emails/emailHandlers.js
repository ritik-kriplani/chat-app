import { resendClient, sender } from "../lib/resend.js";
import { getTransporter, getSenderEmail } from "../lib/nodemailer.js";
import { createWelcomeEmailTemplate } from "../emails/emailTemplates.js";
import { createOtpEmailTemplate } from "./otpTemplates.js";

export const sendWelcomeEmail = async (email, name, clientURL) => {
  const html = createWelcomeEmailTemplate(name, clientURL);
  const senderAddress = getSenderEmail();

  const mailer = await getTransporter();
  if (mailer) {
    try {
      const info = await mailer.sendMail({
        from: `"${sender.name}" <${senderAddress}>`,
        to: email,
        subject: "Welcome to Chatify!",
        html,
      });
      console.log(`Welcome Email delivered to ${email} (Message ID: ${info.messageId})`);
      return;
    } catch (err) {
      console.error("Nodemailer Welcome Email Error:", err.message);
    }
  }

  if (resendClient) {
    try {
      await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: "Welcome to Chatify!",
        html,
      });
      console.log(`Welcome Email sent via Resend to ${email}`);
    } catch (err) {
      console.error("Resend Welcome Email Error:", err.message);
    }
  }
};

export const sendOtpEmail = async (email, name, otp) => {
  const html = createOtpEmailTemplate(otp, name);
  const senderAddress = getSenderEmail();
  let sent = false;

  console.log(`\n==========================================\n[VERIFICATION OTP FOR ${email}]: ${otp}\n==========================================\n`);

  // 1. Try Nodemailer SMTP (Gmail, Outlook, Ethereal, custom SMTP)
  const mailer = await getTransporter();
  if (mailer) {
    try {
      const info = await mailer.sendMail({
        from: `"${sender.name}" <${senderAddress}>`,
        to: email,
        subject: `Your Chatify Verification Code: ${otp}`,
        html,
      });
      console.log(`[EMAIL SENT] Real OTP verification code delivered to ${email} (ID: ${info.messageId})`);
      sent = true;
    } catch (err) {
      console.error("[MAILER ERROR] Failed to send via SMTP:", err.message);
    }
  }

  // 2. Try Resend if SMTP was not sent
  if (!sent && resendClient) {
    try {
      await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: `Your Chatify Verification Code: ${otp}`,
        html,
      });
      console.log(`[EMAIL SENT] OTP verification code delivered via Resend to ${email}`);
      sent = true;
    } catch (err) {
      console.error("[RESEND ERROR] Failed to send via Resend:", err.message);
    }
  }

  if (!sent) {
    console.warn(`[WARNING] Unable to dispatch verification email to ${email}. Check SMTP/Resend settings in .env.`);
    throw new Error("Failed to send OTP email. Please check your backend email configuration (SMTP credentials or Resend API Key in .env).");
  }
};
