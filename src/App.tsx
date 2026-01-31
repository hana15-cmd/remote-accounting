import { useState } from "react";

export default function AccountingApp() {
  type Invoice = {
    id: number;
    client: string;
    amount: number;
    status: "Paid" | "Pending";
  };

  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: 1, client: "Acme Corp", amount: 1200, status: "Pending" },
    { id: 2, client: "Beta LLC", amount: 800, status: "Paid" },
  ]);

  const [form, setForm] = useState({ client: "", amount: "", status: "Pending" });

  const handleAdd = () => {
    console.log("handleAdd called", form); // Debug log
    if (!form.client || !form.amount) {
      console.log("Validation failed"); // Debug log
      return;
    }
    const newInvoice: Invoice = {
      id: Date.now(),
      client: form.client,
      amount: Number(form.amount),
      status: form.status as "Paid" | "Pending",
    };
    console.log("Adding invoice:", newInvoice); // Debug log
    setInvoices([...invoices, newInvoice]);
    setForm({ client: "", amount: "", status: "Pending" });
  };

  const handleDelete = (id: number) => {
    setInvoices(invoices.filter(inv => inv.id !== id));
  };

  return (
    <div className="p-6 bg-navy-light min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Accounting MFE</h1>

      {/* Add Invoice Form */}
      <div className="mb-6 flex flex-wrap gap-4 items-end">
        <input
          type="text"
          placeholder="Client"
          className="px-3 py-2 rounded bg-navy-dark text-white placeholder-gray-400"
          value={form.client}
          onChange={e => setForm({ ...form, client: e.target.value })}
        />
        <input
          type="number"
          placeholder="Amount"
          className="px-3 py-2 rounded bg-navy-dark text-white placeholder-gray-400"
          value={form.amount}
          onChange={e => setForm({ ...form, amount: e.target.value })}
        />
        <select
          className="px-3 py-2 rounded bg-navy-dark text-white"
          value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value })}
        >
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
        </select>
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition"
          onClick={handleAdd}
        >
          Add Invoice
        </button>
      </div>

      {/* Invoice Table */}
      <table>
        <thead>
          <tr>
            <th>Client</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map(inv => (
            <tr key={inv.id}>
              <td>{inv.client}</td>
              <td>${inv.amount}</td>
              <td>
                <span className={inv.status === "Paid" ? "status-paid" : "status-pending"}>
                  {inv.status}
                </span>
              </td>
              <td>
                <button
                  className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-white"
                  onClick={() => handleDelete(inv.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {invoices.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-300">
                No invoices yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}