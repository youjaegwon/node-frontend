export async function fetchTopCoins() {
  const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=krw&ids=bitcoin,ethereum,solana,binancecoin,ripple&price_change_percentage=24h';
  const res = await fetch(url, { headers: { 'x-cg-demo-api-key': '' }});
  if (!res.ok) throw new Error('coingecko failed ' + res.status);
  return await res.json();
}

export const fmtKRW = (n) =>
  new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(n);
