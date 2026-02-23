import { useState } from "react";
import type { Invoice } from "../types/invoice";
import { generateDummyInvoices } from "../data/generateInvoices";

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>(
    generateDummyInvoices()
  );

  const addInvoice = (invoice: Omit<Invoice, "id" | "invoiceNumber">) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: Date.now(),
      invoiceNumber: `INV-${String(invoices.length + 1).padStart(3, "0")}`,
    };

    setInvoices([newInvoice, ...invoices]);
  };

  const deleteInvoice = (id: number) => {
    setInvoices(invoices.filter((inv) => inv.id !== id));
  };

  const updateInvoice = (
    id: number,
    field: keyof Invoice,
    value: string | number
  ) => {
    setInvoices(
      invoices.map((inv) =>
        inv.id === id ? { ...inv, [field]: value } : inv
      )
    );
  };

  const totals = {
    total: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    paid: invoices
      .filter((i) => i.status === "Paid")
      .reduce((sum, i) => sum + i.amount, 0),
    pending: invoices
      .filter((i) => i.status === "Pending")
      .reduce((sum, i) => sum + i.amount, 0),
  };

  return {
    invoices,
    addInvoice,
    deleteInvoice,
    updateInvoice,
    totals,
  };
}