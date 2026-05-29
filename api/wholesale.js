/* global process */
import nodemailer from "nodemailer";

// =========================================================================
// SMTP / EMAIL SETTINGS CONFIGURATION FOR WHOLESALE SUBMISSIONS
// =========================================================================
// This serverless API endpoint routes wholesale quote/order requests
// directly to: info@clicos.co.kr AND wholesales@clicos.co.kr.
//
// Requires SMTP host configuration in environment variables.
// =========================================================================

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const { firstName, lastName, email, phone, company, country, businessType, selectedItemsList, message } = req.body;

  // Safeguard backend validation
  if (!firstName || !firstName.trim() || !lastName || !lastName.trim()) {
    return res.status(400).json({ message: "First name and last name are required." });
  }
  if (!email || !email.trim()) {
    return res.status(400).json({ message: "Email is required." });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ message: "Please enter a valid email address." });
  }
  if (!company || !company.trim()) {
    return res.status(400).json({ message: "Company name is required." });
  }

  // Set up standard SMTP transport using process.env
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const name = `${firstName.trim()} ${lastName.trim()}`;

  // Build high-readability text list for email
  const emailText = `New Wholesale Order Inquiry from CLICOS Website

Partner Information:
Name: ${name}
Company: ${company.trim()}
Work Email: ${email.trim()}
Phone Number: ${phone || "N/A"}
Country: ${country || "N/A"}
Business Type: ${businessType || "N/A"}

Selected B2B Items:
${selectedItemsList || "No specific items selected."}

Additional message / anticipated volume details:
${(message || "").trim() || "N/A"}`;

  const mailOptions = {
    from: `"${name}" <${process.env.SMTP_USER || "mailer@clicos.co.kr"}>`, // Authorized account
    replyTo: email.trim(), // Allows admin to click reply and email the customer directly
    to: "info@clicos.co.kr, wholesales@clicos.co.kr", // Both mandated email destinations
    subject: `New Wholesale Order Quote Request from ${company.trim()}`,
    text: emailText
  };

  try {
    // Send email using SMTP
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Your wholesale order has been submitted successfully." });
  } catch (error) {
    console.error("Nodemailer wholesale transport error:", error);
    return res.status(500).json({ 
      message: "Something went wrong sending the email. Please try again later.",
      debug: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
