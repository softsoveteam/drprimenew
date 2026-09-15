"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useAdminStore } from "@/lib/store/useAdminStore";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

// Form Validation Schema via Zod
const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/auth-cp/dashboard";

  const { isAuthenticated, token, setAuth } = useAdminStore();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  // Redirect if already logged in
  useEffect(() => {
    const storedToken =
      token || (typeof window !== "undefined" ? localStorage.getItem("admin_token") : null);
    if (storedToken) {
      router.replace(redirectUrl);
    }
  }, [token, isAuthenticated, router, redirectUrl]);

  // React Hook Form Setup with Zod Resolver and onTouched mode
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // TanStack Query Mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      setErrorMessage("");
      return await api.post("/admin/login", credentials);
    },
    onSuccess: (res) => {
      const userData = res?.data?.user || res?.user;
      const authToken = res?.data?.token || res?.token;
      if (!authToken) throw new Error("Authentication token not received from server.");
      setAuth(userData, authToken);
      router.replace(redirectUrl);
    },
    onError: (error) => {
      setErrorMessage(
        error?.message || "Invalid credentials or unauthorized account. Please try again."
      );
    },
  });

  const onValidSubmit = (values) => {
    loginMutation.mutate(values);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(onValidSubmit, (fieldErrors) => {
      // Form validation failed - errors are now populated in state
      console.warn("Form validation errors:", fieldErrors);
    })(e);
  };

  const emailField = register("email");
  const passwordField = register("password");

  return (
    <div className="w-full max-w-[420px] mx-auto px-4">
      {/* Logo & Branding */}
      <div className="flex flex-col items-center text-center mb-10">
        <div
          style={{
            background: "linear-gradient(135deg, #1d1c50 0%, #2d2c7a 100%)",
            boxShadow: "0 8px 32px rgba(29,28,80,0.25)",
          }}
          className="flex items-center justify-center h-[68px] w-[68px] rounded-[20px] mb-5"
        >
          <ShieldCheck className="h-9 w-9 text-white" strokeWidth={1.8} />
        </div>
        <h1 className="text-[28px] font-bold text-slate-900 tracking-tight leading-tight">
          Dr.Prime Control Panel
        </h1>
        <p className="text-sm text-slate-500 mt-1.5 font-normal">
          Authorized administrator access only
        </p>
      </div>

      {/* Card */}
      <div
        style={{
          boxShadow: "0 4px 40px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        }}
        className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden"
      >
        {/* Card Top Bar */}
        <div
          style={{ background: "linear-gradient(90deg, #1d1c50 0%, #2d2c7a 100%)" }}
          className="h-1.5 w-full"
        />

        <div className="px-8 pt-7 pb-8">
          <div className="mb-7">
            <h2 className="text-[18px] font-bold text-slate-900">Sign In</h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Enter your credentials to access the admin dashboard
            </p>
          </div>

          {/* Server Error Alert */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 animate-in fade-in-50">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-500" />
              <p className="text-xs font-medium text-red-700 leading-relaxed">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-5" noValidate>
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-700"
              >
                Email Address
              </label>
              <div
                style={{
                  borderColor: errors.email
                    ? "#ef4444"
                    : focusedField === "email"
                    ? "#1d1c50"
                    : "#e2e8f0",
                  backgroundColor: errors.email ? "#fef2f2" : "#f8fafc",
                  boxShadow:
                    focusedField === "email" && !errors.email
                      ? "0 0 0 3px rgba(29,28,80,0.08)"
                      : errors.email
                      ? "0 0 0 3px rgba(239,68,68,0.12)"
                      : "none",
                  transition: "all 0.15s ease-in-out",
                }}
                className="flex items-center gap-3 border rounded-xl px-3.5 h-11"
              >
                <Mail
                  className="h-4 w-4 shrink-0"
                  style={{
                    color: errors.email ? "#ef4444" : focusedField === "email" ? "#1d1c50" : "#94a3b8",
                  }}
                />
                <input
                  id="email"
                  type="email"
                  placeholder="admin@gmail.com"
                  autoComplete="email"
                  {...emailField}
                  onFocus={() => setFocusedField("email")}
                  onBlur={(e) => {
                    emailField.onBlur(e);
                    setFocusedField(null);
                  }}
                  className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none border-none min-w-0"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 font-medium flex items-center gap-1.5 mt-1 animate-in fade-in-50">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />
                  <span>{errors.email.message}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-700"
              >
                Password
              </label>
              <div
                style={{
                  borderColor: errors.password
                    ? "#ef4444"
                    : focusedField === "password"
                    ? "#1d1c50"
                    : "#e2e8f0",
                  backgroundColor: errors.password ? "#fef2f2" : "#f8fafc",
                  boxShadow:
                    focusedField === "password" && !errors.password
                      ? "0 0 0 3px rgba(29,28,80,0.08)"
                      : errors.password
                      ? "0 0 0 3px rgba(239,68,68,0.12)"
                      : "none",
                  transition: "all 0.15s ease-in-out",
                }}
                className="flex items-center gap-3 border rounded-xl px-3.5 h-11"
              >
                <Lock
                  className="h-4 w-4 shrink-0"
                  style={{
                    color: errors.password ? "#ef4444" : focusedField === "password" ? "#1d1c50" : "#94a3b8",
                  }}
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  {...passwordField}
                  onFocus={() => setFocusedField("password")}
                  onBlur={(e) => {
                    passwordField.onBlur(e);
                    setFocusedField(null);
                  }}
                  className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none border-none min-w-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 font-medium flex items-center gap-1.5 mt-1 animate-in fade-in-50">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />
                  <span>{errors.password.message}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={loginMutation.isPending}
                style={{
                  background: loginMutation.isPending
                    ? "#4b4a8a"
                    : "linear-gradient(135deg, #1d1c50 0%, #2d2c7a 100%)",
                  boxShadow: loginMutation.isPending
                    ? "none"
                    : "0 4px 16px rgba(29,28,80,0.3)",
                  transition: "all 0.2s ease",
                }}
                className="w-full h-11 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.99]"
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-6 text-xs text-slate-400">
        Dr.Prime Store Administration &bull; Secure Access Portal
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div
      style={{
        background: "radial-gradient(ellipse at 60% 0%, #eef2ff 0%, #f8fafc 50%, #f1f5f9 100%)",
        minHeight: "100vh",
      }}
      className="flex items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Decorative blobs */}
      <div
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
          width: "600px",
          height: "600px",
          top: "-200px",
          right: "-150px",
        }}
        className="absolute rounded-full pointer-events-none"
      />
      <div
        style={{
          background: "radial-gradient(circle, rgba(29,28,80,0.06) 0%, transparent 70%)",
          width: "500px",
          height: "500px",
          bottom: "-200px",
          left: "-100px",
        }}
        className="absolute rounded-full pointer-events-none"
      />

      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-3 text-slate-600">
            <Loader2 className="h-8 w-8 animate-spin text-[#1d1c50]" />
            <p className="text-sm font-medium">Loading Control Panel...</p>
          </div>
        }
      >
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
