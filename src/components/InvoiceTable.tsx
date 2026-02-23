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
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                </select>
              </td>
              <td>
                <button
                  onClick={() => onDelete(inv.id)}
                  className="bg-red-600 px-3 py-1 rounded text-sm"
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