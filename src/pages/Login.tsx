import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function Login() {
  const [activeTab, setActiveTab] = useState<"general" | "wholesale">("general");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful login
    navigate("/my-page");
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
                to={activeTab === "wholesale" ? "/wholesale" : "/signup"} 
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
