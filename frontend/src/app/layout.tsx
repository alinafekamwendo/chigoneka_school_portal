"use client";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React from "react";
import Loader from "@/components/common/Loader";
import { AuthProvider, useAuth } from "../service/authContext";
import { Toaster } from "@/components/ui/toaster";

function AppWithAuth({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  return <>{loading ? <Loader /> : children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <AuthProvider>
          <AppWithAuth>
          <Toaster />  
            {children}
          </AppWithAuth>
        </AuthProvider>
      </body>
    </html>
  );
}
