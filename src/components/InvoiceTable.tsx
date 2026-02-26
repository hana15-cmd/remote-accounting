import type { Invoice } from "../types/invoice";

type Props = {
  invoices: Invoice[];
  onDelete: (id: number) => void;
  onUpdate: (
    id: number,
    field: keyof Invoice,
    value: string | number
  ) => void;
};

export default function InvoiceTable({
  invoices,
  onDelete,
  onUpdate,
}: Props) {
  return (
    <div className="bg-navy-dark rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr>
            <th>Invoice #</th>
            <th>Client</th>
            <th>Amount</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id}>
              <td>{inv.invoiceNumber}</td>
              <td>{inv.client}</td>
              <td>${inv.amount.toLocaleString()}</td>
              <td>
                <select
                  value={inv.status}
                  onChange={(e) =>
                    onUpdate(inv.id, "status", e.target.value)
                  }
                  className={
                    inv.status === "Paid"
                      ? "bg-green-900 border border-green-500 text-green-400 px-3 py-1 rounded font-semibold cursor-pointer"
                      : "bg-yellow-900 border border-yellow-500 text-yellow-400 px-3 py-1 rounded font-semibold cursor-pointer"
                  }
                >
                  <option value="Pending" className="bg-gray-800 text-yellow-400">Pending</option>
                  <option value="Paid" className="bg-gray-800 text-green-400">Paid</option>
                </select>
              </td>
              <td>
                <button
                  onClick={() => onDelete(inv.id)}
                  className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}