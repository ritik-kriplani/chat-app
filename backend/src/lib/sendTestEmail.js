import { resendClient, sender } from "./resend.js";

// Simple utility to send a test email via Resend.
// Ensure RESEND_API_KEY is set in your .env before running.

export async function sendTestEmail(to) {
  if (!resendClient) {
    console.error("Resend client not configured – check RESEND_API_KEY in .env");
    return;
  }
  try {
    const response = await resendClient.emails.send({
      from: `${sender.name} <${sender.email}>`,
      to,
      subject: "Hello from Chatify",
      html: "<p>Congrats on sending your <strong>first email</strong> via Resend!</p>",
    });
    console.log("Email sent successfully:", response);
  } catch (err) {
    console.error("Failed to send email:", err);
  }
}

// If executed directly, send an email to the address supplied as the first CLI argument.
if (import.meta.url === process.argv[1] || require.main === module) {
  const target = process.argv[2];
  if (!target) {
    console.error("Usage: node src/lib/sendTestEmail.js <recipient-email>");
    process.exit(1);
  }
  sendTestEmail(target);
}
