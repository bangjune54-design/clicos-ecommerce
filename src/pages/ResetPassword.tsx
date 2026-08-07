import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { CheckCircle2, Lock, ArrowLeft, KeyRound } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  
  const emailParam = searchParams.get("email") || "";
  const tokenParam = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please retype carefully.");
      return;
    }

    setIsSubmitting(true);

    const cleanEmail = emailParam.trim().toLowerCase();

    // Load registered accounts
    const savedAccountsString = localStorage.getItem("allAccounts");
    let allAccounts: any[] = [];
    if (savedAccountsString) {
      try {
        allAccounts = JSON.parse(savedAccountsString);
      } catch {
        allAccounts = [];
      }
    }

    const accountIndex = allAccounts.findIndex(
      (a: any) => a.email && a.email.trim().toLowerCase() === cleanEmail
    );

    if (accountIndex !== -1) {
      allAccounts[accountIndex].password = newPassword;
      localStorage.setItem("allAccounts", JSON.stringify(allAccounts));
    } else {
      // Create or update default account entry
      allAccounts.push({
        id: `USR-${Math.floor(100 + Math.random() * 900)}`,
        name: cleanEmail.split("@")[0],
        email: cleanEmail,
        password: newPassword,
        type: "Retail",
        status: "Active"
      });
      localStorage.setItem("allAccounts", JSON.stringify(allAccounts));
    }

    // Clean up reset token
    localStorage.removeItem(`resetToken_${cleanEmail}`);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 500);
  };

  if (isSuccess) {
    return (
      <div className="bg-white min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary-50/50 to-white">
        <div className="w-full max-w-md space-y-6 glass p-8 sm:p-10 rounded-3xl text-center shadow-xl border border-primary-100/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mt-2 mb-4">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
            Password Updated!
          </h2>

          <p className="text-sm text-gray-600 leading-relaxed font-medium">
            Your password for <strong className="text-gray-900">{emailParam}</strong> has been successfully updated. You can now log in using your new password.
          </p>

          <div className="pt-4 space-y-3">
            <Button
              onClick={() => navigate("/login")}
              className="w-full justify-center py-3 text-sm font-bold rounded-xl bg-primary-800 hover:bg-primary-900 shadow-md"
            >
              Sign In with New Password
            </Button>
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
            <KeyRound className="h-7 w-7" />
          </div>
          <h2 className="text-center text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 font-serif">
            Create New Password
          </h2>
          <p className="mt-2 text-center text-xs sm:text-sm text-gray-500 font-medium">
            Enter a new password for <strong className="text-gray-900">{emailParam || "your account"}</strong>.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs sm:text-sm font-semibold">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="new-password" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                New Password
              </label>
              <Input
                id="new-password"
                name="new-password"
                type="password"
                required
                placeholder="Enter new password (min. 6 characters)"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (error) setError("");
                }}
                className="w-full rounded-xl py-3 px-4 text-sm"
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Confirm New Password
              </label>
              <Input
                id="confirm-password"
                name="confirm-password"
                type="password"
                required
                placeholder="Retype new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError("");
                }}
                className="w-full rounded-xl py-3 px-4 text-sm"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full justify-center py-3 text-sm font-bold rounded-xl bg-primary-800 hover:bg-primary-900 shadow-md"
            >
              {isSubmitting ? "Updating Password..." : "Update Password"}
            </Button>
          </div>

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Cancel and Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
