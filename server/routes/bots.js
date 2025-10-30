import { Router } from "express";
import { addBot, removeBot, getBotsSnapshot } from "../botManager.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ bots: getBotsSnapshot() });
});

router.post("/increase", (req, res) => {
  const bot = addBot();
  res.status(201).json({ ok: true, bot, bots: getBotsSnapshot() });
});

router.post("/decrease", (req, res) => {
  const removed = removeBot();
  res.json({ ok: true, removed, bots: getBotsSnapshot() });
});

export default router;
