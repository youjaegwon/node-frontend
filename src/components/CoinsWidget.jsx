import React, { useEffect, useMemo, useState } from 'react';
import { formatKRW, formatPct, classBySign } from '../lib/format';

/**
 * 백엔드: GET /api/coins
 * 응답 스키마(예시)
 * {
 *   ok: true,
 *   items: [
 *     {
 *       market: "KRW-BTC",
 *       symbol: "BTC",
 *       nameKo: "비트코인",
 *       nameEn: "Bitcoin",
 *       price: 163532186,
 *       change: -1712345,       // 전일 대비 가격(원)
 *       changeRate: -1.04,      // 전일 대비 등락률(%)
 *       volume24h: 1234.56,     // 24h 거래량
 *       value24h: 987654321.12  // 24h 거래대금(원 환산)
 *     }, ...
 *   ]
 * }
 */

const TABS = [
  { key: 'today',   text: '오늘의 코인' },
  { key: 'up',      text: '상승' },
  { key: 'down',    text: '하락' },
  { key: 'popular', text: '인기' },
  { key: 'value',   text: '거래량' }, // 거래대금/거래량 기준
];

export default function CoinsWidget() {
  const [tab, setTab] = useState('today');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        setLoading(true);
        const r = await fetch('/api/coins');
        const j = await r.json();
        if (!alive) return;
        const list = Array.isArray(j.items) ? j.items : [];
        setRows(list);
      } catch (e) {
        console.error(e);
        if (alive) setRows([]);
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    const t = setInterval(load, 30_000); // 30초마다 갱신
    return () => { alive = false; clearInterval(t); };
  }, []);

  const top3 = useMemo(() => {
    const list = [...rows];

    switch (tab) {
      case 'up':
        // 등락률 내림차순(상승 TOP3)
        return list
          .filter(x => typeof x.changeRate === 'number')
          .sort((a,b) => b.changeRate - a.changeRate)
          .slice(0,3);
      case 'down':
        // 등락률 오름차순(하락 TOP3)
        return list
          .filter(x => typeof x.changeRate === 'number')
          .sort((a,b) => a.changeRate - b.changeRate)
          .slice(0,3);
      case 'popular':
        // 거래량 기준 TOP3
        return list
          .filter(x => typeof x.volume24h === 'number')
          .sort((a,b) => b.volume24h - a.volume24h)
          .slice(0,3);
      case 'value':
        // 거래대금 기준 TOP3
        return list
          .filter(x => typeof x.value24h === 'number')
          .sort((a,b) => b.value24h - a.value24h)
          .slice(0,3);
      case 'today':
      default:
        // 기본: BTC/ETH/SOL 등 대표 코인 우선 노출 (없으면 앞에서 3개)
        const prefs = ['KRW-BTC','KRW-ETH','KRW-SOL','KRW-XRP','KRW-ADA'];
        const picked = [];
        for (const m of prefs) {
          const f = list.find(x => x.market === m);
          if (f) picked.push(f);
          if (picked.length >= 3) break;
        }
        if (picked.length < 3) {
          for (const x of list) {
            if (!picked.includes(x)) picked.push(x);
            if (picked.length >= 3) break;
          }
        }
        return picked.slice(0,3);
    }
  }, [rows, tab]);

  return (
    <div className="max-w-2xl mx-auto px-5 mt-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="px-5 pt-5">
          <h2 className="text-[20px] font-[700] tracking-tight">오늘의 코인</h2>
          <div className="flex gap-2 mt-3 overflow-x-auto">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={
                  'px-3 py-1.5 rounded-full text-[13px] border ' +
                  (tab === t.key
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-gray-200')
                }
              >
                {t.text}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 divide-y">
          <div className="px-5 py-2 flex text-gray-400 text-[12px]">
            <div className="w-1/2">코인</div>
            <div className="w-1/2 text-right pr-2">실시간(₩) <span className="ml-2">전일대비</span></div>
          </div>

          {loading && (
            <div className="px-5 py-6 text-center text-sm text-gray-500">불러오는 중…</div>
          )}

          {!loading && top3.map((c) => (
            <div key={c.market} className="px-5 py-3 flex items-center">
              <div className="w-1/2">
                <div className="text-[15px] font-semibold text-gray-900">{c.nameEn || c.symbol}</div>
                <div className="text-[12px] text-gray-500">{c.symbol}</div>
              </div>
              <div className="w-1/2 text-right">
                <div className={'text-[15px] font-semibold ' + classBySign(c.change)}>
                  {formatKRW(c.price)}
                </div>
                <div className={'text-[12px] ' + classBySign(c.changeRate)}>
                  {formatPct(c.changeRate)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
