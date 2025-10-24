import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

/**
 * 메인 뉴스 위젯 (4개만 표시)
 * - 백엔드: GET /news (배열: { title, link, source, image })
 * - 카드 클릭 시 기사 새 탭 열기
 * - 하단 버튼: /news 이동
 */
export default function NewsWidget() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await api('/news');
        const list = Array.isArray(r?.data)
          ? r.data.slice(0, 4) // 4개만 표시
          : Array.isArray(r)
          ? r.slice(0, 4)
          : [];
        setItems(list);
      } catch (e) {
        console.error('news fetch error', e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="mt-5">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[18px] font-semibold text-zinc-900">코인 뉴스</h2>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[80px] rounded-2xl bg-zinc-100 animate-pulse"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-zinc-500 text-sm">표시할 뉴스가 없습니다.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((n, i) => (
            <a
              key={n.link || i}
              href={n.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl border border-zinc-100 shadow-sm hover:shadow transition overflow-hidden"
            >
              <div className="p-4 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-medium text-zinc-900 whitespace-normal">
                    {n.title_ko || n.title || '제목 없음'}
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">
                    {n.source || ''}
                  </div>
                </div>
                {n.image ? (
                  <img
                    src={n.image}
                    alt=""
                    className="w-16 h-16 rounded-md object-cover shrink-0 bg-zinc-100"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-md bg-zinc-100 shrink-0" />
                )}
              </div>
            </a>
          ))}
        </div>
      )}

      <div className="mt-4">
        <Link
          to="/news"
          className="block w-full text-center rounded-xl bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-300 transition py-3 text-[15px] text-zinc-700"
        >
          뉴스 더보기
        </Link>
      </div>
    </section>
  );
}
