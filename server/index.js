import express from "express";
import cors from "cors";
import ordersRouter from "./routes/orders.js";
import botsRouter from "./routes/bots.js";

const app = express();
app.use(express.json());
app.use(cors({
  origin: "*", // relax for demo; restrict to your front-end origin in production
}));

app.get("/", (_req, res) => {
  res.json({ ok: true, service: "order-bot-backend" });
});

app.use("/orders", ordersRouter);
app.use("/bots", botsRouter);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`✅ Backend listening on :${PORT}`);
});
