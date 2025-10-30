type Bot = {
  id: number;
  status: "IDLE" | "WORKING";
  currentOrderId: number | null;
  startedAt: string | null;
};

export default function BotPanel({
  bots,
  onAdd,
  onRemove
}: {
  bots: Bot[];
  onAdd: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Cooking Bots</h2>
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={onAdd}>+ Bot</button>
          <button className="btn btn-danger" onClick={onRemove}>- Bot</button>
        </div>
      </div>

      <div className="space-y-2">
        {bots.length === 0 && <div className="text-sm text-neutral-400">No bots yet.</div>}
        {bots.map(b => (
          <div key={b.id} className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2">
            <div className="flex items-center gap-3">
              <div className="text-sm opacity-70">Bot #{b.id}</div>
              <div className={`badge ${b.status === "WORKING" ? "badge-blue" : "badge-gray"}`}>
                {b.status}
              </div>
            </div>
            <div className="text-sm opacity-70">
              {b.status === "WORKING" ? `Order #${b.currentOrderId}` : "—"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
