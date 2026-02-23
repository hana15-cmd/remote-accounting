export type InvoiceStatus = "Paid" | "Pending";

export type Invoice = {
  id: number;
  client: string;
  amount: number;
  status: InvoiceStatus;
  date: string;
  invoiceNumber: string;
};