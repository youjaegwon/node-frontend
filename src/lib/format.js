export function formatKRW(n) {
  if (n == null || Number.isNaN(n)) return '-';
  return '₩' + n.toLocaleString('ko-KR');
}
export function formatPct(p) {
  if (p == null || Number.isNaN(p)) return '-';
  return (p >= 0 ? '+' : '') + p.toFixed(2) + '%';
}
export function upDownColor(p) {
  if (p == null) return 'text-gray-400';
  return p > 0 ? 'text-red-500' : p < 0 ? 'text-blue-500' : 'text-gray-500';
}
export function arrow(p) {
  if (p == null) return '';
  return p > 0 ? '▲' : p < 0 ? '▼' : '—';
}
