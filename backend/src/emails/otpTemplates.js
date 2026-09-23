export function createOtpEmailTemplate(otp, name) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - Chatify</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #292524; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fdf6ef;">
    <div style="background: linear-gradient(135deg, #f97316, #fbbf24); padding: 30px; text-align: center; border-radius: 16px 16px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">Chatify Verification</h1>
    </div>
    <div style="background-color: #ffffff; padding: 35px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(249, 115, 22, 0.08); border: 1px solid #fed7aa; border-top: none;">
      <p style="font-size: 16px; color: #44403c;">Hello <strong>${name || "there"}</strong>,</p>
      <p style="color: #78716c; font-size: 14px;">Thank you for registering with Chatify. Please use the following 6-digit verification code to complete your registration:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <div style="display: inline-block; background: #fff7ed; border: 2px dashed #f97316; padding: 16px 36px; border-radius: 12px;">
          <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #ea580c; font-family: monospace;">${otp}</span>
        </div>
        <p style="font-size: 12px; color: #a8a29e; margin-top: 10px;">This code will expire in 10 minutes.</p>
      </div>

      <p style="font-size: 13px; color: #78716c;">If you didn't request this email, you can safely ignore it.</p>
      
      <hr style="border: none; border-top: 1px solid #ffedd5; margin: 25px 0;" />
      <p style="margin-bottom: 0; font-size: 13px; color: #a8a29e; text-align: center;">Best regards,<br><strong>The Chatify Team</strong></p>
    </div>
  </body>
  </html>
  `;
}
