// In-memory queues and helpers

export const ordersState = {
  pending: [],      // array of order objects
  completed: [],    // array of order objects
  nextId: 1
};

/** Build a new order object */
export function createOrder(type) {
  return {
    id: ordersState.nextId++,
    type, // "VIP" | "NORMAL"
    status: "PENDING",
    createdAt: new Date().toISOString(),
    startedAt: null,
    finishedAt: null
  };
}

/** Insert order respecting VIP priority rule:
 * VIPs go before all NORMAL orders but after existing VIPs.
 * NORMAL orders go to the end.
 */
export function enqueueOrder(order) {
  if (order.type === "VIP") {
    const lastVipIndex = ordersState.pending.map(o => o.type).lastIndexOf("VIP");
    if (lastVipIndex === -1) {
      ordersState.pending.unshift(order);
    } else {
      ordersState.pending.splice(lastVipIndex + 1, 0, order);
    }
  } else {
    ordersState.pending.push(order);
  }
}

/** Requeue an order back to pending (e.g., when a bot is destroyed mid-cook) */
export function requeueOrder(order) {
  order.status = "PENDING";
  order.startedAt = null;
  enqueueOrder(order);
}

/** Pull the next order (front of array) */
export function dequeueNextOrder() {
  return ordersState.pending.shift() || null;
}

/** Mark an order as complete */
export function completeOrder(order) {
  order.status = "COMPLETE";
  order.finishedAt = new Date().toISOString();
  ordersState.completed.push(order);
}

/** Simple getters to return snapshots */
export function getOrdersSnapshot() {
  return {
    pending: ordersState.pending,
    completed: ordersState.completed
  };
}
