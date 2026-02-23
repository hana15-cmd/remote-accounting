import SummaryCards from "./components/SummaryCards";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceTable from "./components/InvoiceTable";
import { useInvoices } from "./hooks/useInvoice";


export default function AccountingApp() {
  const { invoices, addInvoice, deleteInvoice, updateInvoice, totals } =
    useInvoices();

  return (
    <div className="p-6 bg-navy-light min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">
        Accounting MFE
      </h1>

      <SummaryCards
        total={totals.total}
        paid={totals.paid}
        pending={totals.pending}
        count={invoices.length}
      />

      <InvoiceForm onAdd={addInvoice} />

      <InvoiceTable
        invoices={invoices}
        onDelete={deleteInvoice}
        onUpdate={updateInvoice}
      />
    </div>
  );
}