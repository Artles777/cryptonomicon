import { tickersHandlers, API_KEY } from "./variables";

const AGGREGATE_INDEX = "5";
const INVALID_INDEX = "500";

const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);

socket.addEventListener("message", e => {
  const {
    TYPE: type,
    FROMSYMBOL: currency,
    PRICE: newPrice,
    PARAMETER: sub
  } = JSON.parse(e.data);

  if (type === INVALID_INDEX) {
    const coin = JSON.stringify(sub).split("~")[2];
    const handler = tickersHandlers.get(coin) ?? [];
    handler.forEach(fn => fn(newPrice, type));
  }

  if (type !== AGGREGATE_INDEX || newPrice === undefined) return;
  const handler = tickersHandlers.get(currency) ?? [];
  handler.forEach(fn => fn(newPrice, type));
});

export function sendToWebSockets(message) {
  const stringifyMessage = JSON.stringify(message);
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifyMessage);
    return;
  }
  socket.addEventListener("open", () => socket.send(message), { once: true });
}
