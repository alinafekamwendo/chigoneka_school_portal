// app/payments/page.tsx
"use client";
import { Payment } from "./payment";
import { columns } from "./columns";
import { DataTable } from "./data-table";


  // Fetch data from your API here.
  // For demonstration, we'll use dummy data.


export default  function PaymentsPage() {
    const data = [
      {
        id: "728ed52f",
        amount: 100,
        status: "pending",
        email: "m@example.com",
        clientName: "John Doe",
      },
      {
        id: "489214sf",
        amount: 1250,
        status: "processing",
        email: "sarah@example.com",
        clientName: "Sarah Connor",
      },
      {
        id: "a1b2c3d4",
        amount: 50.75,
        status: "success",
        email: "alice@example.com",
        clientName: "Alice Wonderland",
      },
      {
        id: "e5f6g7h8",
        amount: 230.0,
        status: "failed",
        email: "bob@example.com",
        clientName: "Bob The Builder",
      },
      {
        id: "i9j0k1l2",
        amount: 899.99,
        status: "success",
        email: "charlie@example.com",
        clientName: "Charlie Chaplin",
      },
      {
        id: "m3n4o5p6",
        amount: 15.2,
        status: "pending",
        email: "diana@example.com",
        clientName: "Diana Prince",
      },
      {
        id: "q7r8s9t0",
        amount: 765.43,
        status: "processing",
        email: "eve@example.com",
        clientName: "Eve Harrington",
      },
      {
        id: "u1v2w3x4",
        amount: 32.5,
        status: "success",
        email: "frank@example.com",
        clientName: "Frank Sinatra",
      },
      {
        id: "y5z6a7b8",
        amount: 98.1,
        status: "failed",
        email: "grace@example.com",
        clientName: "Grace Kelly",
      },
      {
        id: "c9d0e1f2",
        amount: 450.0,
        status: "success",
        email: "heidi@example.com",
        clientName: "Heidi Klum",
      },
      {
        id: "c9d0e1f3",
        amount: 450.0,
        status: "success",
        email: "heid@example.com",
        clientName: "Heidi Klum",
      },
    ];

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-4 text-2xl font-bold">Payments Dashboard</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
