import nodemailer from "nodemailer";

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    debug: true,
    logger: true,
  });
};

export async function sendEmail(to, subject, websiteName, websiteUrl) {
  const transporter = createTransporter();

  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4a4a4a;">Congratulations! Your Website is Now Published</h2>
        <p>Dear Publisher,</p>
        <p>We're excited to inform you that your website, <strong>${websiteName}</strong>, has been successfully published and is now live!</p>
        <p>You can view your website at: <a href="https://www.getsweven.com/publishers-dashboard" style="color: #0066cc;">${websiteUrl}</a></p>
        <h3 style="color: #4a4a4a;">Next Steps:</h3>
        <ul>
          <li>Review your website to ensure all content is displaying correctly</li>
          <li>Start promoting your website to your audience</li>
          <li>Consider adding more content or features to enhance user engagement</li>
        </ul>
        <p>If you need any assistance or have any questions, please don't hesitate to contact our support team.</p>
        <p>Thank you for choosing our platform for your publishing needs!</p>
        <p>Best regards,<br>The Sweven Support Team</p>
      </body>
    </html>
  `;

  try {
    console.log("Attempting to send email to:", to);
    console.log("SMTP Configuration:", {
      service: "gmail",
      user: process.env.GMAIL_USER,
      pass: "********", // masked for security
    });

    const info = await transporter.sendMail({
      from: `"Sweven Support" <${process.env.GMAIL_USER}>`,
      to: to,
      subject: subject,
      html: htmlContent,
    });

    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    if (error.response) {
      console.error("SMTP Response:", error.response);
    }
    throw error;
  } finally {
    transporter.close();
  }
}

export async function testEmailService() {
  try {
    await sendEmail(
      "test@example.com",
      "Your Website Has Been Published!",
      "My Awesome Blog",
      "https://myawesomeblog.com"
    );
    console.log("Test email sent successfully");
  } catch (error) {
    console.error("Test email failed:", error);
  }
}
