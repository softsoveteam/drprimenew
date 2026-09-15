"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUserRegister } from "@/hooks/useUserAuth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";

const registerSchema = z
  .object({
    name: z.string().min(2, "Full name must be at least 2 characters").max(255, "Name too long"),
    email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    password_confirmation: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export default function UserRegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const registerMutation = useUserRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = (data) => {
    registerMutation.mutate(data);
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 bg-[#f8f5ed] flex flex-col justify-center items-center relative overflow-hidden">
      {/* Decorative Glow Elements */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#1d1c50]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#c9b896]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#1d1c50]/60 hover:text-[#1d1c50] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dr.Prime Home
        </Link>

        {/* Card Container */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-[#1d1c50]/5 border border-[#1d1c50]/10">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-4">
              <img
                src="/assets/logo-dark.png"
                alt="Dr.Prime Pillow Logo"
                className="h-12 w-auto mx-auto object-contain"
              />
            </Link>
            <h1 className="text-3xl font-bold text-[#1d1c50] tracking-tight font-serif">
              Create Account
            </h1>
            <p className="text-sm text-[#4a4a6a] mt-2">
              Join Dr.Prime for a better sleep experience
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold text-[#1d1c50] uppercase tracking-wider">
                Full Name
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  icon={User}
                  {...register("name")}
                  className="h-12 bg-[#f8f5ed]/50 border-[#1d1c50]/15 focus-visible:ring-[#1d1c50] focus-visible:border-[#1d1c50] text-[#1d1c50] rounded-xl placeholder:text-[#4a4a6a]/40"
                />
              </div>
              {errors.name && (
                <p className="text-xs font-medium text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-[#1d1c50] uppercase tracking-wider">
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  icon={Mail}
                  {...register("email")}
                  className="h-12 bg-[#f8f5ed]/50 border-[#1d1c50]/15 focus-visible:ring-[#1d1c50] focus-visible:border-[#1d1c50] text-[#1d1c50] rounded-xl placeholder:text-[#4a4a6a]/40"
                />
              </div>
              {errors.email && (
                <p className="text-xs font-medium text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold text-[#1d1c50] uppercase tracking-wider">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  icon={Lock}
                  {...register("password")}
                  className="h-12 bg-[#f8f5ed]/50 border-[#1d1c50]/15 focus-visible:ring-[#1d1c50] focus-visible:border-[#1d1c50] text-[#1d1c50] rounded-xl pr-10 placeholder:text-[#4a4a6a]/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a4a6a]/60 hover:text-[#1d1c50] transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-medium text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <Label htmlFor="password_confirmation" className="text-xs font-semibold text-[#1d1c50] uppercase tracking-wider">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  icon={Lock}
                  {...register("password_confirmation")}
                  className="h-12 bg-[#f8f5ed]/50 border-[#1d1c50]/15 focus-visible:ring-[#1d1c50] focus-visible:border-[#1d1c50] text-[#1d1c50] rounded-xl pr-10 placeholder:text-[#4a4a6a]/40"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a4a6a]/60 hover:text-[#1d1c50] transition-colors p-1"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password_confirmation && (
                <p className="text-xs font-medium text-red-500 mt-1">{errors.password_confirmation.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full h-12 bg-[#1d1c50] hover:bg-[#1d1c50]/90 text-white font-semibold rounded-xl text-base transition-all shadow-md shadow-[#1d1c50]/20 flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-[#c9b896]" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Register</span>
              )}
            </Button>
          </form>

          {/* Footer Note */}
          <div className="mt-8 text-center border-t border-[#1d1c50]/10 pt-6">
            <p className="text-sm text-[#4a4a6a]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#1d1c50] hover:text-[#c9b896] transition-colors underline underline-offset-4"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
