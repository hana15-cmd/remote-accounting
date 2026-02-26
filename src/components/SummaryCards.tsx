type Props = {
  total: number;
  paid: number;
  pending: number;
  count: number;
  paidCount: number;
  pendingCount: number;
};

export default function SummaryCards({
  total,
  paid,
  pending,
  count,
  paidCount,
  pendingCount,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card title="Total Invoices" value={total} count={count} />
      <Card title="Paid" value={paid} count={paidCount} color="text-green-400" />
      <Card title="Pending" value={pending} count={pendingCount} color="text-yellow-400" />
    </div>
  );
}

function Card({
  title,
  value,
  count,
  color = "",
}: {
  title: string;
  value: number;
  count?: number;
  color?: string;
}) {
  return (
    <div className="bg-navy-dark p-4 rounded-lg">
      <div className="text-gray-400 text-sm mb-1">{title}</div>
      <div className={`text-2xl font-bold ${color}`}>
        ${value.toLocaleString()}
      </div>
      {count && (
        <div className="text-xs text-gray-400 mt-1">
          {count} invoices
        </div>
      )}
    </div>
  );
}