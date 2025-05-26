"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "@/service/authContext";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default function SigninWithPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login ,user} = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate input
    try {
      loginSchema.parse({ email, password });
      setValidationErrors({});
    } catch (err) {
      setIsLoading(false);
      if (err instanceof z.ZodError) {
        const errors = err.errors.reduce(
          (acc, curr) => {
            acc[curr.path[0]] = curr.message;
            return acc;
          },
          {} as Record<string, string>,
        );
        setValidationErrors(errors);
        return;
      }
    }

    // Use context login
    try {
      await login({ email, password }); // assumes username = email
      setShowSuccess(true);
      setTimeout(() => {
        router.push(redirect || "/");
        setShowSuccess(false);
      }, 1000);
    } catch (err: any) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {showSuccess && (
        <Alert
          severity="success"
          onClose={() => setShowSuccess(false)}>
          Login successful. Redirecting...
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="mb-2.5 block font-medium text-dark dark:text-white"
          >
            Email
          </label>
          <div className="relative">
            <Tooltip title="Enter your email" placement="bottom">
              <input
                type="email"
                placeholder="Enter your email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-primary bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
              />
            </Tooltip>
            {validationErrors.email && (
              <p className="text-sm text-red-500">{validationErrors.email}</p>
            )}
            <span className="absolute right-4.5 top-1/2 -translate-y-1/2">
              <EmailOutlinedIcon fontSize="small" className="text-gray-5" />
            </span>
          </div>
        </div>

        <div className="mb-5">
          <label
            htmlFor="password"
            className="mb-2.5 block font-medium text-dark dark:text-white"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-primary bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary"
            />
            <span
              className="absolute right-4.5 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <Visibility fontSize="small" className="text-gray-5" />
              ) : (
                <VisibilityOff fontSize="small" className="text-gray-5" />
              )}
            </span>
            {validationErrors.password && (
              <p className="mt-2 text-sm text-red-500">
                {validationErrors.password}
              </p>
            )}
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between gap-2 py-2">
          <label
            htmlFor="remember"
            className="flex cursor-pointer items-center text-base text-dark dark:text-white"
          >
            <input
              type="checkbox"
              name="remember"
              id="remember"
              className="mr-2"
            />
            Remember me
          </label>
          <Link
            href="/auth/forgot-password"
            className="text-base underline hover:text-primary dark:text-white"
          >
            Forgot Password?
          </Link>
        </div>

        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          className={`w-full rounded-lg bg-blue-900 p-4 font-medium text-white hover:bg-opacity-50 ${
            isLoading ? "cursor-not-allowed opacity-70" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={24} className="text-white bg-blue-950" />
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </>
  );
}
