"use client";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React from "react";
import Loader from "@/components/common/Loader";
import { AuthProvider, useAuth } from "../service/authContext";

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
          <AppWithAuth>{children}</AppWithAuth>
        </AuthProvider>
      </body>
    </html>
  );
}
