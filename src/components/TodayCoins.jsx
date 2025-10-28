import { useEffect, useState } from 'react';
import Avatar from './Avatar.jsx';
import { formatKRW, formatPct, upDownColor, arrow } from '../lib/format.js';

const TABS = [
  { key: 'gainers',  label: '상승' },
  { key: 'losers',   label: '하락' },
  { key: 'trending', label: '인기' },
  { key: 'volume',   label: '거래량' },
];

export default function TodayCoins() {
  const [active, setActive] = useState('gainers');
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/coins?type=${active}&limit=3`, { cache: 'no-store' });
        const j = await res.json();
        if (!alive) return;
        setItems(Array.isArray(j.items) ? j.items : []);
      } catch {
        if (alive) setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [active]);

  return (
    <section className="w-full">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* 헤더 */}
        <div className="px-5 pt-5">
          <h2 className="text-[17px] font-[800] tracking-tight">실시간 랭킹</h2>

          {/* 탭 */}
          <div className="mt-3 flex gap-8 overflow-x-auto pb-2">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                className={`text-[14px] font-semibold transition-colors ${
                  active === t.key ? 'text-black' : 'text-gray-400'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 컬럼 헤더 */}
        <div className="grid grid-cols-3 text-[11px] text-gray-400 px-5 pb-2">
          <div>코인</div>
          <div className="text-center">실시간(₩)</div>
          <div className="text-right">전일대비</div>
        </div>

        {/* 리스트 */}
        <ul className="divide-y">
          {(loading ? Array.from({ length: 3 }) : items).map((c, i) => (
            <li key={c?.market || i} className="px-5 py-3 flex items-center gap-3">
              {loading ? (
                <div className="w-full h-6 bg-gray-100 rounded animate-pulse" />
              ) : (
                <>
                  <Avatar text={c?.symbol} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold truncate">
                      {c?.nameKo || c?.nameEn || c?.symbol || '-'}
                    </div>
                    <div className="text-[11px] text-gray-500">{c?.symbol}</div>
                  </div>

                  <div className="w-32 text-center text-[14px] font-semibold">
                    <span className={upDownColor(c?.changeRate)}>{formatKRW(c?.price)}</span>
                  </div>

                  <div className={`w-20 text-right text-[13px] font-semibold ${upDownColor(c?.changeRate)}`}>
                    {c?.changeRate == null ? '-' : (
                      <>
                        <span className="mr-1">{arrow(c.changeRate)}</span>
                        {formatPct(c.changeRate)}
                      </>
                    )}
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
