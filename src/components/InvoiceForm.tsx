import { useState } from "react";
import type { InvoiceStatus } from "../types/invoice";

type Props = {
  onAdd: (data: {
    client: string;
    amount: number;
    status: InvoiceStatus;
    date: string;
  }) => void;
};

export default function InvoiceForm({ onAdd }: Props) {
  const [form, setForm] = useState({
    client: "",
    amount: "",
    status: "Pending" as InvoiceStatus,
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = () => {
    if (!form.client || !form.amount) return;

    onAdd({
      client: form.client,
      amount: Number(form.amount),
      status: form.status,
      date: form.date,
    });

    setForm({
      client: "",
      amount: "",
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <div className="mb-6 bg-navy-dark p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-3">Add Invoice</h2>
      <div className="flex gap-4 flex-wrap">
        <input
          placeholder="Client"
          value={form.client}
          onChange={(e) =>
            setForm({ ...form, client: e.target.value })
          }
          className="input"
        />
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) =>
            setForm({ ...form, amount: e.target.value })
          }
          className="input"
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 rounded"
        >
          Add
        </button>
      </div>
    </div>
  );
}