import { ReactNode } from "react";
import AdminDefaultLayout from "../../../../components/Layouts/AdminDefaultLayout";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
   <AdminDefaultLayout>
      <main className="flex-1 p-6">{children}</main>
    </AdminDefaultLayout>
  );
}
