import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { restoreCartForAccount } from "../utils/cart";

export function Login() {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("type") === "wholesale" ? "wholesale" : "general";
  const [activeTab, setActiveTab] = useState<"general" | "wholesale">(defaultTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const cleanEmail = email.trim().toLowerCase();

    // Load registered accounts or initialize default accounts
    const savedAccountsString = localStorage.getItem("allAccounts");
    let allAccounts: any[] = [];
    if (savedAccountsString) {
      allAccounts = JSON.parse(savedAccountsString);
    } else {
      allAccounts = [
        { id: "USR-001", name: "Jane Doe", email: "jane.doe@example.com", password: "password123", type: "Retail", status: "Active" },
        { id: "USR-002", name: "John Smith", email: "retail_shop@b2b.com", password: "password123", type: "Wholesale", status: "Active" },
        { id: "USR-003", name: "Admin Setup", email: "info@clicos.com", password: "adminpassword", type: "Admin", status: "Active" },
        { id: "USR-004", name: "Wholesale Admin", email: "wholesale@clicos.com", password: "adminpassword", type: "Admin", status: "Active" },
      ];
      localStorage.setItem("allAccounts", JSON.stringify(allAccounts));
    }

    // Look up the registered account
    const account = allAccounts.find(
      (a: any) => a.email?.toLowerCase() === cleanEmail
    );
    
    // Account must exist
    if (!account) {
      setError("Invalid account email or password. Please check your credentials or register a new account.");
      return;
    }

    // Password must match if stored
    if (account.password && account.password !== password) {
      setError("Invalid account email or password. Please try again.");
      return;
    }

    // Role portal tab validation
    if (activeTab === "wholesale" && account.type === "Retail") {
      setError("Retail accounts cannot log in through the wholesale portal.");
      return;
    }
    if (activeTab === "general" && account.type === "Wholesale") {
      setError("Wholesale accounts cannot log in through the retail portal.");
      return;
    }
    
    const firstName = account?.name?.split(" ")[0] || "";
    let finalUserType = activeTab === "wholesale" ? "wholesale" : "retail";
    if (account && account.type) {
      finalUserType = account.type.toLowerCase();
    }

    // Persist session
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userType", finalUserType);
    localStorage.setItem("userEmail", cleanEmail);
    if (firstName) localStorage.setItem("userFirstName", firstName);

    // Restore this account's previously saved cart (not wipe it)
    restoreCartForAccount(cleanEmail);

    window.dispatchEvent(new Event("storage"));

    // Show success feedback
    window.dispatchEvent(new CustomEvent("show-toast", { detail: { message: "Successfully logged in!" } }));

    if (cleanEmail === "info@clicos.com" || cleanEmail === "wholesale@clicos.com") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };


  return (
    <div className="bg-white min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 glass p-8 rounded-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 font-serif">
            Sign in to your account
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

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 text-red-800 p-4 rounded-md text-sm font-medium">
              {error}
            </div>
          )}
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="#" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full justify-center">
              Sign in as {activeTab === "general" ? "Customer" : "Wholesale Partner"}
            </Button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              {activeTab === "wholesale" ? "Don't have a wholesale account?" : "Don't have an account?"}{" "}
              <Link 
                to={activeTab === "wholesale" ? "/signup?type=wholesale" : "/signup"} 
                className="font-semibold text-primary-600 hover:text-primary-800"
              >
                Apply here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
