import { sendToWebSockets } from "./websockets";
import { tickersHandlers } from "./variables";

function subscribeToTickerOnWS(ticker) {
  sendToWebSockets({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~USD`]
  });
}

function unsubscribeFromTickerOnWS(ticker) {
  sendToWebSockets({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~USD`]
  });
}

export function subscribeToTicker(ticker, callback) {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, callback]);
  subscribeToTickerOnWS(ticker);
}

export function unsubscribeFromTicker(ticker) {
  tickersHandlers.delete(ticker);
  unsubscribeFromTickerOnWS(ticker);
}
