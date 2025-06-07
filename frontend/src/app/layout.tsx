"use client";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React from "react";
import Spinner from "@/components/Spinner";
import { AuthProvider, useAuth } from "../service/authContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";




function AppWithAuth({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  return (
    <>
      {/* ToastContainer moved outside of loading check */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ zIndex: 9999 }} // Ensure high z-index
      />
      {loading ? <Spinner /> : children}
    </>
  );
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
