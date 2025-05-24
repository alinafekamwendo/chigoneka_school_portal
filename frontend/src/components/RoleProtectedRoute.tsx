// components/RoleProtectedRoute.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../service/authContext";
import Spinner from "./Spinner";

const RoleProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!loading) {
      const checkAuth = () => {
        if (!user) {
          router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
          return;
        }

        // if (!allowedRoles.includes(user.role)) {
        //   router.push('/unauthorized');
        //   return;
        // }
        
        setVerified(true);
      };

      checkAuth();
    }
  }, [loading, user, router, allowedRoles]);

  if (loading || !verified) {
    return <Spinner />;
  }

  return <>{children}</>;
};
export default RoleProtectedRoute;