"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import OrdersList from "../components/OrdersList";
import BotPanel from "../components/BotPanel";
import StatChip from "../components/StatChip";

const API = process.env.BACKEND_API_URL || "http://localhost:8081";

type Order = {
  id: number;
  type: "VIP" | "NORMAL";
  status: "PENDING" | "PROCESSING" | "COMPLETE";
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
};

type BotsResp = {
  bots: {
    id: number;
    status: "IDLE" | "WORKING";
    currentOrderId: number | null;
    startedAt: string | null;
  }[];
};

export default function Page() {
  const [pending, setPending] = useState<Order[]>([]);
  const [completed, setCompleted] = useState<Order[]>([]);
  const [bots, setBots] = useState<BotsResp["bots"]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      const [oRes, bRes] = await Promise.all([
        fetch(`${API}/orders`, { cache: "no-store" }),
        fetch(`${API}/bots`, { cache: "no-store" })
      ]);
      const oData = await oRes.json();
      const bData = await bRes.json();
      setPending(oData.pending);
      setCompleted(oData.completed);
      setBots(bData.bots);
    } catch (e) {
      console.error("Fetch error", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const id = setInterval(fetchAll, 2000); // poll every 2s
    return () => clearInterval(id);
  }, [fetchAll]);

  const stats = useMemo(() => ({
    total: pending.length + completed.length,
    inProgress: pending.filter(o => o.status === "PROCESSING").length + bots.filter(b => b.status === "WORKING").length,
    done: completed.length
  }), [pending, completed, bots]);

  const addNormal = async () => {
    await fetch(`${API}/orders/normal`, { method: "POST" });
    fetchAll();
  };
  const addVIP = async () => {
    await fetch(`${API}/orders/vip`, { method: "POST" });
    fetchAll();
  };
  const addBot = async () => {
    await fetch(`${API}/bots/increase`, { method: "POST" });
    fetchAll();
  };
  const removeBot = async () => {
    await fetch(`${API}/bots/decrease`, { method: "POST" });
    fetchAll();
  };

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">🍔 McD Order Controller (VIP-aware)</h1>
        <div className="flex gap-2">
          <StatChip label="Total Orders" value={stats.total} />
          <StatChip label="Completed" value={stats.done} />
          <StatChip label="Bots" value={bots.length} />
        </div>
      </header>

      <section className="card">
        <div className="flex flex-wrap gap-2">
          <button className="btn" onClick={addNormal}>New Normal Order</button>
          <button className="btn btn-primary" onClick={addVIP}>New VIP Order</button>
          <div className="mx-2 border-l border-neutral-800" />
          <button className="btn btn-primary" onClick={addBot}>+ Bot</button>
          <button className="btn btn-danger" onClick={removeBot}>- Bot</button>
        </div>
        {loading && <div className="mt-3 text-sm text-neutral-400">Loading…</div>}
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <OrdersList title="Pending" orders={pending} />
        <OrdersList title="Completed" orders={completed} />
      </section>

      <BotPanel bots={bots} onAdd={addBot} onRemove={removeBot} />
    </main>
  );
}
