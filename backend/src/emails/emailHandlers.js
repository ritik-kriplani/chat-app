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

  console.log(`\n==========================================`);
  console.log(`[SEND_OTP_EMAIL STARTED] Target Email: ${email} | Code: ${otp}`);
  console.log(`==========================================\n`);

  // 1. Try Resend API first (fast HTTP call)
  if (resendClient) {
    try {
      console.log(`[RESEND] Attempting to send OTP email via Resend to ${email}...`);
      const resendRes = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: `Your Chatify Verification Code: ${otp}`,
        html,
      });
      if (resendRes.error) {
        console.error(`[RESEND ERROR RESPONSE]`, resendRes.error);
      } else {
        console.log(`[RESEND SUCCESS] OTP email delivered to ${email} (ID: ${resendRes.data?.id})`);
        sent = true;
      }
    } catch (err) {
      console.error(`[RESEND EXCEPTION] Failed to send via Resend:`, err.message);
    }
  } else {
    console.log(`[RESEND SKIPPED] RESEND_API_KEY is not configured.`);
  }

  // 2. Try Nodemailer SMTP fallback if Resend was not configured/sent
  if (!sent) {
    console.log(`[SMTP] Attempting Nodemailer SMTP fallback for ${email}...`);
    const mailer = await getTransporter();
    if (mailer) {
      try {
        const info = await mailer.sendMail({
          from: `"${sender.name}" <${senderAddress}>`,
          to: email,
          subject: `Your Chatify Verification Code: ${otp}`,
          html,
        });
        console.log(`[SMTP SUCCESS] Real OTP verification code delivered to ${email} (Message ID: ${info.messageId})`);
        sent = true;
      } catch (err) {
        console.error(`[SMTP ERROR] Failed to send via SMTP:`, err.message);
      }
    } else {
      console.log(`[SMTP SKIPPED] SMTP_USER/SMTP_PASS are not configured.`);
    }
  }

  if (!sent) {
    console.warn(`[WARNING] Email dispatch failed for ${email}. Check SMTP/Resend settings in .env.`);
  }
};
