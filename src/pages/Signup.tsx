import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { CheckCircle2 } from "lucide-react";
import { sendAdminNotification } from "../utils/email";
import { COUNTRIES } from "../contexts/CountryContext";

export function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("type") === "wholesale" ? "wholesale" : "general";
  const [activeTab, setActiveTab] = useState<"general" | "wholesale">(defaultTab);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneCode: "+1",
    phone: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    country: ""
  });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);

  const isPasswordMismatch = Boolean(
    (formData.confirmPassword || submitted) &&
    formData.password !== "" &&
    formData.password !== formData.confirmPassword
  );

  // Load existing accounts dynamically
  const hasStoredAccounts = localStorage.getItem("allAccounts") !== null;
  const savedAccounts = hasStoredAccounts ? JSON.parse(localStorage.getItem("allAccounts") || "[]") : [];
  const defaultAccounts = [
    { email: "jane.doe@example.com", phone: "+1 555-0192" }, 
    { email: "retail_shop@b2b.com", phone: "+1 555-0193" }, 
    { email: "info@clicos.co.kr", phone: "+82 10-1234-5678" },
    { email: "wholesale@clicos.co.kr", phone: "+82 10-9876-5432" }
  ];
  const allAccountsToMerge = hasStoredAccounts ? savedAccounts : defaultAccounts;

  const isEmailTaken = Boolean(
    formData.email.trim() &&
    allAccountsToMerge.some((a: any) => a.email && a.email.trim().toLowerCase() === formData.email.trim().toLowerCase())
  );

  const cleanDigits = (val: string) => val.replace(/\D/g, "");

  const isPhoneTaken = Boolean(
    formData.phone.trim() &&
    allAccountsToMerge.some((a: any) => {
      if (!a.phone) return false;
      const existingDigits = cleanDigits(a.phone);
      const inputPhoneDigits = cleanDigits(formData.phone);
      const fullInputDigits = cleanDigits(formData.phoneCode + formData.phone);
      
      if (!existingDigits || !inputPhoneDigits) return false;

      return (
        existingDigits === inputPhoneDigits ||
        existingDigits === fullInputDigits ||
        (inputPhoneDigits.length >= 7 && existingDigits.endsWith(inputPhoneDigits)) ||
        (existingDigits.length >= 7 && inputPhoneDigits.endsWith(existingDigits))
      );
    })
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(""); // Clear errors on change
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setError("");

    if (isEmailTaken) {
      setError("An account with this email address already exists.");
      return;
    }

    if (isPhoneTaken) {
      setError("An account with this phone number already exists.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Account creation failed.");
      return;
    }

    // Success state
    const saved = localStorage.getItem("allAccounts");
    const accounts = saved ? JSON.parse(saved) : [
      { id: "USR-001", name: "Jane Doe", email: "jane.doe@example.com", password: "password123", type: "Retail", joined: "Jan 12, 2026", status: "Active" },
      { id: "USR-002", name: "John Smith", email: "retail_shop@b2b.com", password: "password123", type: "Wholesale", joined: "Feb 05, 2026", status: "Active" },
      { id: "USR-003", name: "Admin Setup", email: "info@clicos.com", password: "adminpassword", type: "Admin", joined: "Dec 01, 2025", status: "Active" },
    ];
    
    const newAccount = {
      id: `USR-${Math.floor(Math.random() * 900 + 100)}`,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      password: formData.password,
      phone: `${formData.phoneCode} ${formData.phone}`,
      type: activeTab === "general" ? "Retail" : "Wholesale",
      country: formData.country,
      joined: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: "Active"
    };
    
    const updatedAccounts = [...accounts, newAccount];
    localStorage.setItem("allAccounts", JSON.stringify(updatedAccounts));

    sendAdminNotification("New Account Registration", newAccount);

    setSuccess(true);
  };

  if (success) {
    return (
      <div className="bg-white min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary-50/50 to-white">
        <div className="w-full max-w-lg space-y-8 glass p-10 sm:p-14 rounded-3xl text-center shadow-xl border border-primary-100/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-primary-500"></div>
          
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 mt-4 mb-8">
            <CheckCircle2 className="h-10 w-10 text-green-500" aria-hidden="true" />
          </div>
          
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 font-serif">
            Welcome to CLICOS!
          </h2>
          
          <div className="space-y-4">
            <p className="text-base text-gray-600">
              Your account has been successfully created.
            </p>
            {activeTab === "wholesale" && (
              <p className="text-sm text-primary-700 bg-primary-50 p-4 rounded-xl border border-primary-100">
                Your wholesale partner application is under review. Our B2B team will contact you shortly if additional details are needed.
              </p>
            )}
          </div>
          
          <div className="pt-6">
            <Button size="lg" className="w-full sm:w-auto px-12" onClick={() => navigate("/login")}>
              Proceed to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 glass p-8 rounded-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 font-serif">
            Create an account
          </h2>
        </div>

        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${
              activeTab === "general"
                ? "border-b-2 border-primary-600 text-primary-800"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("general")}
          >
            Shop
          </button>
          <button
            className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${
              activeTab === "wholesale"
                ? "border-b-2 border-primary-600 text-primary-800"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("wholesale")}
          >
            Wholesale
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            {activeTab === "wholesale" && (
              <div>
                <label htmlFor="company-name" className="sr-only">Company Name</label>
                <Input
                  id="company-name"
                  name="companyName"
                  type="text"
                  required
                  placeholder="Company Name"
                  value={formData.companyName}
                  onChange={handleChange}
                />
              </div>
            )}
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="first-name" className="sr-only">First Name</label>
                <Input
                  id="first-name"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="last-name" className="sr-only">Last Name</label>
                <Input
                  id="last-name"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                error={isEmailTaken ? "An account with this email address already exists." : undefined}
              />
            </div>
            <div>
              <label htmlFor="phone" className="sr-only">Phone Number</label>
              <div className="flex gap-2">
                <select
                  name="phoneCode"
                  value={formData.phoneCode}
                  onChange={handleChange}
                  className={`w-[110px] flex h-10 rounded-md border bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow ${
                    isPhoneTaken ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.dialCode}>{c.flag} {c.dialCode}</option>
                  ))}
                </select>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  error={isPhoneTaken ? "An account with this phone number already exists." : undefined}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <label htmlFor="country" className="sr-only">Country</label>
              <select
                id="country"
                name="country"
                required
                value={formData.country}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-shadow"
              >
                <option value="" disabled>Select your country</option>
                {COUNTRIES.map(c => (
                  <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
              <Input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={isPasswordMismatch ? "Passwords do not match." : undefined}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full justify-center"
              disabled={isPasswordMismatch || isEmailTaken || isPhoneTaken}
            >
              Sign up as {activeTab === "general" ? "Customer" : "Wholesale Partner"}
            </Button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              Already have an account?{" "}
              <Link to={activeTab === "wholesale" ? "/login?type=wholesale" : "/login"} className="font-semibold text-primary-600 hover:text-primary-800">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
