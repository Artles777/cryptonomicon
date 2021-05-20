import { API_KEY } from "./variables";

const URL_COIN_LIST = new URL(
  "https://min-api.cryptocompare.com/data/all/coinlist"
);

export async function loadCoinList() {
  URL_COIN_LIST.searchParams.set("summary", "true");
  URL_COIN_LIST.searchParams.append("api_key", API_KEY);
  return (await fetch(URL_COIN_LIST.toJSON())).json();
}
