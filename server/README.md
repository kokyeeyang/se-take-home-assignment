# McDonalds Order Bot – Backend

Express.js in-memory simulation of:
- Orders with VIP priority
- Cooking bots that process one order at a time (10s each)
- Add/remove bots; removing a busy bot returns the order to PENDING

## Scripts
- `npm run dev` – Start server (local)
- `npm start` – Start server (Railway/Prod)

## Env
- `PORT` (default 8080)

## Routes
- `GET /orders` – { pending, completed }
- `POST /orders/vip`
- `POST /orders/normal`
- `GET /bots` – { bots: [...] }
- `POST /bots/increase`
- `POST /bots/decrease`
