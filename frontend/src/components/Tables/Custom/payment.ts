// types/payment.ts or similar
export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
  clientName: string;
  // Add other fields as per your table columns in the screenshots (e.g., date, currency)
};
