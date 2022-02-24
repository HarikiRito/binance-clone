export type KLineData = [
  number, // Open time
  string, // Open
  string, // High
  string, // Low
  string, // Close
  string, // Volume
  number, // Close time
  ...any[]
];

export async function getKLines(option: {
  symbol: string;
  interval: string;
  limit: number;
  endTime?: number;
}): Promise<KLineData[]> {
  const stringQuery = new URLSearchParams(option as {}).toString();
  const res = await fetch(`https://api.binance.com/api/v3/klines?${stringQuery}`);
  return res.json();
}
