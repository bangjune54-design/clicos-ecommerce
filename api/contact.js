/* global process */
import nodemailer from "nodemailer";

// =========================================================================
// SMTP / EMAIL SETTINGS CONFIGURATION
// =========================================================================
// To connect your email server and send messages successfully, you need to
// configure the following environment variables in your Vercel project settings
// or in your local .env file (Vite environment variables will not leak them):
//
// 1. SMTP_HOST - The hostname of your SMTP server (e.g. smtp.gmail.com, smtp.mailgun.org, etc.)
// 2. SMTP_PORT - The port number (usually 587 for TLS, or 465 for SSL)
// 3. SMTP_SECURE - Set to 'true' if using port 465 (SSL), or 'false' for port 587 (TLS/starttls)
// 4. SMTP_USER - Your SMTP authentication username/email address (e.g. mailer@clicos.co.kr)
// 5. SMTP_PASS - Your SMTP authentication password or app-specific password
//
// Vercel will automatically build and serve this file as a secure server-side
// API endpoint at '/api/contact'. No credentials will leak to the frontend.
// =========================================================================

export default async function handler(req, res) {
  // Only allow POST requests for secure data submissions
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const { name, email, message, customerType, country, subject, company } = req.body;

  // Backend validation safeguards
  if (!name || !name.trim()) {
    return res.status(400).json({ message: "Name is required." });
  }
  if (!email || !email.trim()) {
    return res.status(400).json({ message: "Email is required." });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ message: "Please enter a valid email address." });
  }
  if (!message || !message.trim()) {
    return res.status(400).json({ message: "Message is required." });
  }

  // Create standard SMTP mail transport using environment variables
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true", // true for port 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  // Construct clean, highly readable email format
  const emailText = `New Contact Form Message from CLICOS Website

Name: ${name.trim()}
Email: ${email.trim()}
Phone: N/A (Field does not exist in form)
Company: ${company || "N/A"}
Subject: ${subject || "General Inquiry"}
Customer Type: ${customerType || "N/A"}
Country: ${country || "N/A"}

Message:
${message.trim()}`;

  const mailOptions = {
    from: `"${name.trim()}" <${process.env.SMTP_USER || "mailer@clicos.co.kr"}>`, // Sent from authorized account
    replyTo: email.trim(), // Enables direct replies to the customer's input email
    to: "info@clicos.co.kr", // Mandated destination
    subject: "New Contact Form Message from CLICOS Website",
    text: emailText
  };

  try {
    // Send email using SMTP
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Your message has been sent successfully." });
  } catch (error) {
    console.error("Nodemailer SMTP transport error:", error);
    return res.status(500).json({ 
      message: "Something went wrong. Please try again later.",
      debug: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
