import { Router } from "express";
import { createOrder, enqueueOrder, getOrdersSnapshot } from "../orderQueue.js";
import { triggerIdleBots } from "../botManager.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(getOrdersSnapshot());
});

router.post("/vip", (req, res) => {
  const order = createOrder("VIP");
  enqueueOrder(order);
  triggerIdleBots(); // wake idle bots
  res.status(201).json({ ok: true, order });
});

router.post("/normal", (req, res) => {
  const order = createOrder("NORMAL");
  enqueueOrder(order);
  triggerIdleBots();
  res.status(201).json({ ok: true, order });
});

export default router;
