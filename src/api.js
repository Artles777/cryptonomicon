const tickersHandlers = new Map();

const API_KEY =
  "5213e1c97006620050854f97c4684d63e8a678fdd3292c5b48bf06611b520f64";
const URL_MULTYPLE_PRICE = new URL(
  "https://min-api.cryptocompare.com/data/pricemulti"
);
const URL_COIN_LIST = new URL(
  "https://min-api.cryptocompare.com/data/all/coinlist"
);

async function loadTickers() {
  URL_MULTYPLE_PRICE.searchParams.set(
    "fsyms",
    [...tickersHandlers.keys()].join(",")
  );
  URL_MULTYPLE_PRICE.searchParams.append("tsyms", "USD");
  URL_MULTYPLE_PRICE.searchParams.append("api_key", API_KEY);

  if (!tickersHandlers.size) return;
  const result = (await fetch(URL_MULTYPLE_PRICE.toJSON())).json();
  const updatedPrices = Object.fromEntries(
    Object.entries(await result).map(([key, value]) => [key, value["USD"]])
  );
  return Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
    const handler = tickersHandlers.get(currency) ?? [];
    handler.forEach(fn => fn(newPrice));
  });
}

export async function loadCoinList() {
  URL_COIN_LIST.searchParams.set("summary", "true");
  URL_COIN_LIST.searchParams.append("api_key", API_KEY);
  return (await fetch(URL_COIN_LIST.toJSON())).json();
}

export function subscribeToTicker(ticker, callback) {
  const subscribers = tickersHandlers.get(ticker) || [];
  return tickersHandlers.set(ticker, [...subscribers, callback]);
}

export function unsubscribeFromTicker(ticker) {
  tickersHandlers.delete(ticker);
}

setInterval(loadTickers, 10000);
