import { useState } from "react";
import { faker } from '@faker-js/faker';

export default function AccountingApp() {
  type Invoice = {
    id: number;
    client: string;
    amount: number;
    status: "Paid" | "Pending";
    date: string;
    invoiceNumber: string;
  };

  // Generate dummy data
  const generateDummyInvoices = (): Invoice[] => {
    return Array.from({ length: 15 }, (_, index) => ({
      id: index + 1,
      client: faker.company.name(),
      amount: parseFloat(faker.finance.amount({ min: 500, max: 5000, dec: 0 })),
      status: faker.helpers.arrayElement(["Paid", "Pending"]) as "Paid" | "Pending",
      date: faker.date.past({ years: 1 }).toISOString().split('T')[0],
      invoiceNumber: `INV-${String(index + 1).padStart(3, '0')}`,
    }));
  };

  const [invoices, setInvoices] = useState<Invoice[]>(generateDummyInvoices());

  const [form, setForm] = useState({ 
    client: "", 
    amount: "", 
    status: "Pending",
    date: new Date().toISOString().split('T')[0]
  });

  const handleAdd = () => {
    if (!form.client || !form.amount || !form.date) {
      alert("Please fill in all fields");
      return;
    }

    const nextInvoiceNumber = `INV-${String(invoices.length + 1).padStart(3, '0')}`;
    
    const newInvoice: Invoice = {
      id: Date.now(),
      client: form.client,
      amount: Number(form.amount),
      status: form.status as "Paid" | "Pending",
      date: form.date,
      invoiceNumber: nextInvoiceNumber,
    };
    
    setInvoices([newInvoice, ...invoices]);
    setForm({ 
      client: "", 
      amount: "", 
      status: "Pending",
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleDelete = (id: number) => {
    setInvoices(invoices.filter(inv => inv.id !== id));
  };

  const handleEdit = (id: number, field: keyof Invoice, value: string | number) => {
    setInvoices(invoices.map(inv => 
      inv.id === id ? { ...inv, [field]: value } : inv
    ));
  };

  // Calculate totals
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = invoices.filter(inv => inv.status === "Paid").reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = invoices.filter(inv => inv.status === "Pending").reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="p-6 bg-navy-light min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-2">Accounting MFE</h1>
      <p className="text-gray-300 mb-6">Manage invoices and track payments</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-navy-dark p-4 rounded-lg">
          <div className="text-gray-400 text-sm mb-1">Total Invoices</div>
          <div className="text-2xl font-bold">${totalAmount.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-1">{invoices.length} invoices</div>
        </div>
        <div className="bg-navy-dark p-4 rounded-lg">
          <div className="text-gray-400 text-sm mb-1">Paid</div>
          <div className="text-2xl font-bold text-green-400">${paidAmount.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-1">{invoices.filter(inv => inv.status === "Paid").length} invoices</div>
        </div>
        <div className="bg-navy-dark p-4 rounded-lg">
          <div className="text-gray-400 text-sm mb-1">Pending</div>
          <div className="text-2xl font-bold text-yellow-400">${pendingAmount.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-1">{invoices.filter(inv => inv.status === "Pending").length} invoices</div>
        </div>
      </div>

      {/* Add Invoice Form */}
      <div className="mb-6 bg-navy-dark p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Add New Invoice</h2>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-gray-400 mb-1">Client Name</label>
            <input
              type="text"
              placeholder="Enter client name"
              className="w-full px-3 py-2 rounded bg-navy-light text-white placeholder-gray-400 border border-gray-700 focus:border-blue-500 focus:outline-none"
              value={form.client}
              onChange={e => setForm({ ...form, client: e.target.value })}
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm text-gray-400 mb-1">Amount</label>
            <input
              type="number"
              placeholder="0.00"
              className="w-full px-3 py-2 rounded bg-navy-light text-white placeholder-gray-400 border border-gray-700 focus:border-blue-500 focus:outline-none"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm text-gray-400 mb-1">Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 rounded bg-navy-light text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm text-gray-400 mb-1">Status</label>
            <select
              className="w-full px-3 py-2 rounded bg-navy-light text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
          <button
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded transition font-semibold"
            onClick={handleAdd}
          >
            Add Invoice
          </button>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-navy-dark rounded-lg overflow-hidden">
        <table>
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Date</th>
              <th>Client</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv.id}>
                <td className="font-mono text-sm">{inv.invoiceNumber}</td>
                <td>{new Date(inv.date).toLocaleDateString()}</td>
                <td>{inv.client}</td>
                <td className="font-semibold">${inv.amount.toLocaleString()}</td>
                <td>
                  <select
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      inv.status === "Paid" 
                        ? "bg-green-900/30 text-green-400" 
                        : "bg-yellow-900/30 text-yellow-400"
                    }`}
                    value={inv.status}
                    onChange={(e) => handleEdit(inv.id, 'status', e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                </td>
                <td>
                  <button
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-sm transition"
                    onClick={() => handleDelete(inv.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}