import React from 'react';
import { Link } from 'react-router-dom';

function Magnifier({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.47 6.47 0 0 0 1.57-4.23A6.5 6.5 0 1 0 9.5 15a6.47 6.47 0 0 0 4.23-1.57l.27.28v.79L20.5 21 22 19.5 15.5 14Zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z"/>
    </svg>
  );
}

/**
 * items: [{ title, source, image, link, publishedAt }]
 * 최대 4개 미리보기 + '뉴스 더보기' 버튼
 */
export default function NewsWidget({ items = [] }) {
  const top4 = items.slice(0, 4);

  return (
    <section className="rounded-2xl p-4 bg-white shadow-sm ring-1 ring-zinc-100">
      <div className="flex items-center gap-2 mb-3">
        <Magnifier className="w-5 h-5 text-emerald-600" />
        <h2 className="text-base font-semibold">코인 뉴스</h2>
      </div>

      <ul className="flex flex-col gap-3">
        {top4.map((n, i) => (
          <li key={n.link || i}>
            <a
              href={n.link || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 ring-1 ring-zinc-100 hover:bg-zinc-50 transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Magnifier className="w-4 h-4 text-zinc-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  {/* 제목은 줄바꿈 허용해서 한눈에 다 보이게 */}
                  <div className="text-[15px] font-medium text-zinc-900 whitespace-normal">
                    {n.title || '제목 없음'}
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">
                    {n.source || ''}{' '}
                    {n.publishedAt
                      ? new Date(n.publishedAt).toLocaleString('ko-KR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : ''}
                  </div>
                </div>
              </div>

              {n.image ? (
                <img
                  src={n.image}
                  alt=""
                  className="w-14 h-14 rounded-lg object-cover shrink-0"
                  loading="lazy"
                />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-zinc-200 shrink-0" />
              )}
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <Link
          to="/news"
          className="block w-full text-center rounded-xl px-4 py-2.5 text-sm font-medium
                     bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition"
        >
          뉴스 더보기
        </Link>
      </div>
    </section>
  );
}
