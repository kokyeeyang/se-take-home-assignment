type Order = {
  id: number;
  type: "VIP" | "NORMAL";
  status: "PENDING" | "PROCESSING" | "COMPLETE";
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
};

export default function OrdersList({ title, orders }: { title: string; orders: Order[] }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="badge badge-blue">{orders.length} orders</div>
      </div>
      <div className="space-y-2">
        {orders.length === 0 && (
          <div className="text-sm text-neutral-400">No orders here.</div>
        )}
        {orders.map(o => (
          <div key={o.id} className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2">
            <div className="flex items-center gap-3">
              <div className="text-sm opacity-70">#{o.id}</div>
              <div className={`badge ${o.type === "VIP" ? "badge-amber" : "badge-gray"}`}>
                {o.type}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {o.status === "PENDING" && <span className="badge badge-gray">PENDING</span>}
              {o.status === "PROCESSING" && <span className="badge badge-blue">COOKING</span>}
              {o.status === "COMPLETE" && <span className="badge badge-green">DONE</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
