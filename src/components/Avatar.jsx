export default function Avatar({ text }) {
  const t = (text || '').trim().toUpperCase();
  const initials = t.slice(0, 2);
  // 간단 해시로 배경색 변화
  let sum = 0; for (let i = 0; i < t.length; i++) sum = (sum * 31 + t.charCodeAt(i)) >>> 0;
  const hue = sum % 360;
  const bg = `hsl(${hue} 70% 88%)`;
  const fg = `hsl(${hue} 50% 35%)`;
  return (
    <div
      aria-hidden
      className="shrink-0 inline-flex items-center justify-center rounded-full w-9 h-9"
      style={{ background: bg, color: fg, fontWeight: 700 }}
    >
      {initials || '?'}
    </div>
  );
}
