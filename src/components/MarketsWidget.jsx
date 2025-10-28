import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';

function fmtKRW(n) {
  if (n == null) return '-';
  try {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0
    }).format(n);
  } catch {
    return `₩${Number(n).toLocaleString('ko-KR')}`;
  }
}

function fmtPct(n, digits = 2) {
  if (n == null || Number.isNaN(n)) return '-';
  return `${n.toFixed(digits)}%`;
}

export default function MarketsWidget() {
  const [base, setBase] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await api('/markets');
        setBase(r?.base || null);
        setItems(Array.isArray(r?.items) ? r.items : []);
      } catch (e) {
        console.error(e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="w-full">
      <div className="bg-white rounded-xl shadow-sm ring-1 ring-zinc-100">
        {/* 헤더 */}
        <div className="flex items-baseline justify-between px-4 pt-4">
          <h2 className="text-[15px] font-semibold tracking-tight">
            거래소별 BTC 시세
          </h2>
          <div className="text-[10px] text-zinc-500">
            바이낸스 기준{' '}
            {base?.binanceKRW != null ? fmtKRW(base.binanceKRW) : '-'}
          </div>
        </div>

        {/* 열 타이틀 */}
        <div className="px-4 pb-2 mt-2 grid grid-cols-[1.5fr_1.5fr_1fr_1fr] text-[11px] text-zinc-500">
          <div>거래소</div>
          <div className="text-center">실시간(₩)</div>
          <div className="text-center">전일대비</div>
          <div className="text-right">프리미엄</div>
        </div>

        {/* 데이터 */}
        <div className="divide-y divide-zinc-100">
          {loading ? (
            <div className="p-4 text-xs text-zinc-400">불러오는 중…</div>
          ) : items.length === 0 ? (
            <div className="p-4 text-xs text-zinc-400">
              표시할 데이터가 없습니다.
            </div>
          ) : (
            items.map((x, i) => {
              const rate = Number(x.changeRate || 0);
              const up = rate >= 0;
              const priceCls = up ? 'text-red-500' : 'text-blue-500';
              return (
                <div
                  key={i}
                  className="px-4 py-2 grid grid-cols-[1.5fr_1.5fr_1fr_1fr] items-center text-[13px]"
                >
                  {/* 거래소 */}
                  <div className="font-medium text-zinc-800">{x.exchange}</div>

                  {/* 실시간 금액 */}
                  <div
                    className={`text-center font-semibold ${priceCls}`}
                    style={{ letterSpacing: '-0.3px' }}
                  >
                    {fmtKRW(x.price)}
                  </div>

                  {/* 전일대비 */}
                  <div className="text-center">
                    {rate === 0 ? (
                      <span className="text-zinc-400">-</span>
                    ) : (
                      <span
                        className={`inline-flex items-center justify-center gap-1 text-[12px] ${
                          up ? 'text-red-500' : 'text-blue-500'
                        }`}
                      >
                        {up ? '▲' : '▼'} {fmtPct(Math.abs(rate), 2)}
                      </span>
                    )}
                  </div>

                  {/* 프리미엄 */}
                  <div className="text-right">
                    {x.premium != null ? (
                      <span className="text-emerald-600 font-medium text-[12px]">
                        {fmtPct(x.premium, 2)}
                      </span>
                    ) : (
                      <span className="text-zinc-400">-</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
