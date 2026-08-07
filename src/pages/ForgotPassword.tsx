import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { CheckCircle2, ArrowLeft, Mail, ExternalLink, ShieldCheck } from "lucide-react";
import { sendAdminNotification } from "../utils/email";
import { useLanguage } from "../contexts/LanguageContext";

export function ForgotPassword() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [resetToken, setResetToken] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError("Please enter your account email address.");
      setIsSubmitting(false);
      return;
    }

    // Load registered accounts or initialize defaults
    const savedAccountsString = localStorage.getItem("allAccounts");
    let allAccounts: any[] = [];
    if (savedAccountsString) {
      try {
        allAccounts = JSON.parse(savedAccountsString);
      } catch {
        allAccounts = [];
      }
    }
    
    if (!allAccounts || allAccounts.length === 0) {
      allAccounts = [
        { id: "USR-001", name: "Jane Doe", email: "jane.doe@example.com", password: "password123", type: "Retail", status: "Active" },
        { id: "USR-002", name: "John Smith", email: "retail_shop@b2b.com", password: "password123", type: "Wholesale", status: "Active" },
        { id: "USR-003", name: "Kosmera Admin", email: "info@kosmera.co.kr", password: "adminpassword", type: "Admin", status: "Active" },
        { id: "USR-004", name: "Kosmera Wholesale Admin", email: "wholesale@kosmera.co.kr", password: "adminpassword", type: "Admin", status: "Active" },
        { id: "USR-005", name: "Kosmera Main Admin", email: "admin@kosmera.co.kr", password: "adminpassword", type: "Admin", status: "Active" },
      ];
      localStorage.setItem("allAccounts", JSON.stringify(allAccounts));
    }

    const targetAccount = allAccounts.find(
      (a: any) => a.email && a.email.trim().toLowerCase() === cleanEmail
    );

    if (!targetAccount) {
      setError("No registered account found with this email address. Please check spelling or sign up.");
      setIsSubmitting(false);
      return;
    }

    // Generate unique reset token and store in localStorage
    const token = `ksm_${Math.floor(10000000 + Math.random() * 90000000)}`;
    localStorage.setItem(`resetToken_${cleanEmail}`, token);
    setResetToken(token);

    // Send email dispatch simulation from info@kosmera.co.kr
    sendAdminNotification("Password Reset Instructions Sent", {
      from: "info@kosmera.co.kr",
      to: cleanEmail,
      subject: "[KOSMERA] Reset Your Account Password",
      resetLink: `${window.location.origin}/reset-password?email=${encodeURIComponent(cleanEmail)}&token=${token}`
    });

    setTimeout(() => {
      setSentSuccess(true);
      setIsSubmitting(false);
    }, 500);
  };

  const resetUrl = `/reset-password?email=${encodeURIComponent(email.trim().toLowerCase())}&token=${resetToken}`;

  if (sentSuccess) {
    return (
      <div className="bg-white min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary-50/50 to-white">
        <div className="w-full max-w-lg space-y-6 glass p-8 sm:p-10 rounded-3xl shadow-2xl border border-primary-100/60 relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-600 to-accent"></div>

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mt-2 mb-4">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
            Password Reset Email Sent!
          </h2>

          <p className="text-sm text-gray-600 leading-relaxed font-medium">
            An email containing a secure password change link has been sent from <span className="font-bold text-primary-900">info@kosmera.co.kr</span> to <span className="font-bold text-gray-900">{email}</span>.
          </p>

          {/* Simulated Email Message Preview Box */}
          <div className="bg-primary-50/60 border border-primary-200 p-5 rounded-2xl text-left space-y-3 my-4">
            <div className="flex items-center justify-between border-b border-primary-200/60 pb-2">
              <span className="text-xs font-bold text-primary-900 flex items-center gap-1.5 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-primary-700" /> Dispatch Notification
              </span>
              <span className="text-[11px] text-gray-500 font-semibold">From: info@kosmera.co.kr</span>
            </div>
            
            <div className="text-xs text-gray-700 space-y-1 font-medium">
              <p><strong className="text-gray-900">To:</strong> {email}</p>
              <p><strong className="text-gray-900">Subject:</strong> [KOSMERA] Reset Your Account Password</p>
            </div>

            <div className="pt-2 text-center">
              <p className="text-xs text-gray-600 font-medium mb-3">
                Click the button below to change your account password:
              </p>
              <Button
                onClick={() => navigate(resetUrl)}
                className="w-full justify-center gap-2 bg-primary-800 hover:bg-primary-900 text-white font-bold py-3 text-sm rounded-xl shadow-md"
              >
                <ExternalLink className="w-4 h-4" /> Change Password Now
              </Button>
            </div>
          </div>

          <div className="pt-2 flex flex-col items-center gap-3">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Login Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary-50/30 to-white">
      <div className="w-full max-w-md space-y-8 glass p-8 sm:p-10 rounded-3xl shadow-xl border border-primary-100/50">
        <div>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary-800 mb-4">
            <Mail className="h-7 w-7" />
          </div>
          <h2 className="text-center text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 font-serif">
            Forgot Your Password?
          </h2>
          <p className="mt-2 text-center text-xs sm:text-sm text-gray-500 font-medium">
            Type in your account email below. We will send a secure password change link from <strong className="text-gray-800">info@kosmera.co.kr</strong>.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs sm:text-sm font-semibold">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="reset-email" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Account Email Address
            </label>
            <Input
              id="reset-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="e.g. user@domain.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              className="w-full rounded-xl py-3 px-4 text-sm"
            />
          </div>

          <div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full justify-center py-3 text-sm font-bold rounded-xl bg-primary-800 hover:bg-primary-900 shadow-md"
            >
              {isSubmitting ? "Sending Link..." : "Send Password Reset Link"}
            </Button>
          </div>

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
