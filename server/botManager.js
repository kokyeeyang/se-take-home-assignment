import { dequeueNextOrder, completeOrder, requeueOrder, ordersState } from "./orderQueue.js";

const COOK_TIME_MS = 10_000;

export const botState = {
  bots: [],       // { id, status: 'IDLE'|'WORKING', currentOrderId|null, timeoutId|null, startedAt|null }
  nextBotId: 1
};

/** Internal: start processing if bot is idle and there is work */
function tick(bot) {
  if (!bot || bot.status === "WORKING") return;

  const next = dequeueNextOrder();
  if (!next) {
    bot.status = "IDLE";
    bot.currentOrderId = null;
    bot.startedAt = null;
    return;
  }

  // Assign and cook for 10s (non-interruptible unless bot is destroyed)
  bot.status = "WORKING";
  bot.currentOrderId = next.id;
  bot.startedAt = new Date().toISOString();
  next.status = "PROCESSING";
  next.startedAt = bot.startedAt;

  bot.timeoutId = setTimeout(() => {
    completeOrder(next);
    bot.status = "IDLE";
    bot.currentOrderId = null;
    bot.startedAt = null;
    bot.timeoutId = null;
    // Immediately look for more work
    tick(bot);
  }, COOK_TIME_MS);
}

/** Public: create a new bot and start it */
export function addBot() {
  const bot = {
    id: botState.nextBotId++,
    status: "IDLE",
    currentOrderId: null,
    timeoutId: null,
    startedAt: null
  };
  botState.bots.push(bot);
  // On creation, immediately try to process something
  tick(bot);
  return bot;
}

/** Public: destroy the newest bot; if WORKING, return its order to pending */
export function removeBot() {
  if (botState.bots.length === 0) return null;
  const bot = botState.bots.pop();

  if (bot.timeoutId) {
    clearTimeout(bot.timeoutId);
    bot.timeoutId = null;

    // Recover the in-flight order and requeue it (unprocessed)
    const inflight = recoverOrderById(bot.currentOrderId);
    if (inflight) {
      requeueOrder(inflight);
    }
  }
  return bot;
}

/** Trigger all IDLE bots to try to start */
export function triggerIdleBots() {
  botState.bots.forEach(b => {
    if (b.status === "IDLE") tick(b);
  });
}

/** Helper: find and remove order from completed/pending/processing if needed.
 * In this prototype, "processing order" object is shared by reference, so we
 * simply search pending + completed; if not found, it was the currently cooking
 * object and we still have a reference passed in botManager (above).
 */
function recoverOrderById(orderId) {
  if (orderId == null) return null;
  // Not in pending because we dequeued it; not in completed (we canceled early).
  // Rebuild a minimal order object so we can requeue it consistently.
  // We can search in completed/pending just in case (no-op typical).
  const all = [...ordersState.pending, ...ordersState.completed];
  const found = all.find(o => o.id === orderId);
  if (found) return { ...found, status: "PENDING", finishedAt: null, startedAt: null };

  // If not found anywhere, build a placeholder (safe in-memory prototype)
  return {
    id: orderId,
    type: "NORMAL",        // best-effort; in practice, we always cancel with a ref in real systems
    status: "PENDING",
    createdAt: new Date().toISOString(),
    startedAt: null,
    finishedAt: null
  };
}

export function getBotsSnapshot() {
  return botState.bots.map(b => ({
    id: b.id,
    status: b.status,
    currentOrderId: b.currentOrderId,
    startedAt: b.startedAt
  }));
}
