"use client";

import { useState, useEffect } from "react";
import SignInButton from "@/components/authentication/signin-button";
import { GalleryVerticalEnd } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

const Signin = () => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  });

  const isDark = resolvedTheme === "dark" || theme === "dark";

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Left Side - Login Section */}
      <div className="flex flex-col justify-center px-6 md:px-10">
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <Link href="/" aria-label="Go to homepage">
            <div className="flex h-6 w-6 items-center justify-center rounded-md border">
              <GalleryVerticalEnd className="size-4" />
            </div>
          </Link>
          <span className="text-lg font-medium">CloudCast</span>
        </div>

        <div className="max-w-sm mx-auto w-full text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your institutional email (<b>@neu.edu.ph</b>) to login to your
            account
          </p>
          <div className="mt-6">
            <SignInButton />
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            By signing in, you agree to our{" "}
            <Link
              href="/terms"
              className="underline cursor-pointer"
              aria-label="View Terms of Service"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline cursor-pointer"
              aria-label="View Privacy Policy"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Right Side - Dynamic Gradient Background */}
      <div
        className={`hidden lg:flex min-h-screen transition-all duration-300 ${
          !mounted
            ? "bg-gray-200"
            : isDark
            ? "bg-gradient-to-r from-[#1e3a8a] to-[#0f172a]"
            : "bg-gradient-to-r from-[#3b82f6] to-[#1e3a8a]"
        }`}
        aria-hidden="true"
      ></div>
    </main>
  );
};

export default Signin;
