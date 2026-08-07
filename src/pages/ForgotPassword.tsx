import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { CheckCircle2, ArrowLeft, Mail } from "lucide-react";
import { sendAdminNotification } from "../utils/email";
import { useLanguage } from "../contexts/LanguageContext";

export function ForgotPassword() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState("");

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
      allAccounts = JSON.parse(savedAccountsString);
    } else {
      allAccounts = [
        { id: "USR-001", name: "Jane Doe", email: "jane.doe@example.com", password: "password123", type: "Retail", status: "Active" },
        { id: "USR-002", name: "John Smith", email: "retail_shop@b2b.com", password: "password123", type: "Wholesale", status: "Active" },
        { id: "USR-003", name: "Admin Setup", email: "info@clicos.co.kr", password: "adminpassword", type: "Admin", status: "Active" },
        { id: "USR-004", name: "Wholesale Admin", email: "wholesale@clicos.co.kr", password: "adminpassword", type: "Admin", status: "Active" },
      ];
    }

    const targetIndex = allAccounts.findIndex(
      (a: any) => a.email && a.email.trim().toLowerCase() === cleanEmail
    );

    if (targetIndex === -1) {
      setError("No account found with this email address. Please check your spelling or register a new account.");
      setIsSubmitting(false);
      return;
    }

    // Generate new temporary password
    const generatedPassword = `CLICOS-${Math.floor(100000 + Math.random() * 900000)}`;
    allAccounts[targetIndex].password = generatedPassword;
    localStorage.setItem("allAccounts", JSON.stringify(allAccounts));

    // Send email notification with new password
    sendAdminNotification("Password Reset Request", {
      email: allAccounts[targetIndex].email,
      name: allAccounts[targetIndex].name,
      newPassword: generatedPassword
    });

    setTimeout(() => {
      setNewPassword(generatedPassword);
      setSentSuccess(true);
      setIsSubmitting(false);
    }, 600);
  };

  if (sentSuccess) {
    return (
      <div className="bg-white min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary-50/50 to-white">
        <div className="w-full max-w-md space-y-8 glass p-8 sm:p-10 rounded-3xl text-center shadow-xl border border-primary-100/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-primary-500"></div>

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 mt-2 mb-6">
            <CheckCircle2 className="h-9 w-9 text-green-500" aria-hidden="true" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 font-serif">
            New Password Sent!
          </h2>

          <p className="text-sm text-gray-600 leading-relaxed">
            We have sent an email with your new password to <span className="font-bold text-gray-900">{email}</span>.
          </p>

          <div className="bg-primary-50/80 border border-primary-150 p-4 rounded-2xl text-center my-4">
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">Your New Temporary Password</span>
            <span className="text-xl font-mono font-bold text-primary-900 tracking-wider select-all">{newPassword}</span>
          </div>

          <div className="space-y-3 pt-2">
            <Button
              onClick={() => navigate("/login")}
              className="w-full justify-center"
            >
              Sign In with New Password
            </Button>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
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
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 mb-4">
            <Mail className="h-6 w-6 text-primary-600" />
          </div>
          <h2 className="text-center text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 font-serif">
            Forgot Password
          </h2>
          <p className="mt-2 text-center text-xs sm:text-sm text-gray-500">
            Enter the email address of your account below. We will send an email with your new password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs sm:text-sm font-medium">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="reset-email" className="sr-only">
              Email address
            </label>
            <Input
              id="reset-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Enter your account email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
            />
          </div>

          <Button type="submit" className="w-full justify-center" disabled={isSubmitting}>
            {isSubmitting ? "Sending Email..." : "Send New Password Email"}
          </Button>

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
