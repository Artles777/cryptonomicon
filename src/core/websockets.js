import {
  tickersHandlers,
  socket,
  INVALID_INDEX,
  AGGREGATE_INDEX
} from "./variables";

let BTC;

socket.addEventListener("message", e => {
  const {
    TYPE: type,
    FROMSYMBOL: currency,
    PRICE: newPrice,
    PARAMETER: sub,
    TOSYMBOL: link
  } = JSON.parse(e.data);
  if (currency === "BTC") BTC = newPrice;

  if (type === INVALID_INDEX) {
    const coin = JSON.stringify(sub).split("~")[2];
    const handler = tickersHandlers.get(coin) ?? [];
    if (coin === "BTC") return;
    sendToWebSockets({
      action: "SubAdd",
      subs:
        coin !== "BTC"
          ? ["5~CCCAGG~BTC~USD", `5~CCCAGG~${coin}~BTC`]
          : [`5~CCCAGG~${coin}~BTC`]
    });
    if (coin) handler.forEach(fn => fn(newPrice, type));
  }

  if (type !== AGGREGATE_INDEX || newPrice === undefined) return;
  const crossPrice = newPrice * BTC;
  const handler = tickersHandlers.get(currency) ?? [];
  if (link === "BTC") handler.forEach(fn => fn(crossPrice, type));
  else handler.forEach(fn => fn(newPrice, type));
});

export function sendToWebSockets(message) {
  const stringifyMessage = JSON.stringify(message);
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifyMessage);
    return;
  }
  socket.addEventListener("open", () => socket.send(message), { once: true });
}
