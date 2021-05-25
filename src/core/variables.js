export const tickersHandlers = new Map();
export const API_KEY =
  "fb120dc06519b0e15bc20d309984e3e6a4b2742c58e2c69d3be65d154d7b1193";
export const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);
export const AGGREGATE_INDEX = "5";
export const INVALID_INDEX = "500";
