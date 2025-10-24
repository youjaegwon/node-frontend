import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Card from '../components/Card';
import { api } from '../lib/api';

function groupByDate(list) {
  const g = {};
  list.forEach((n) => {
    const key = new Date(n.publishedAt || n.published_at || n.date || Date.now())
      .toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric', weekday: 'short' });
    (g[key] ||= []).push(n);
  });
  return g;
}

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await api('/news'); // 백엔드에서 title_ko 제공
        const arr = Array.isArray(r?.data) ? r.data : (Array.isArray(r?.items) ? r.items : []);
        setNews(arr);
      } catch (e) {
        console.error(e);
        setNews([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const grouped = groupByDate(news);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-2xl mx-auto px-5 py-8">
        <h1 className="text-xl font-bold mb-4">코인 뉴스</h1>
        {loading && <p className="text-sm text-zinc-500">불러오는 중…</p>}
        {!loading && Object.keys(grouped).length === 0 && (
          <p className="text-sm text-zinc-500">표시할 뉴스가 없습니다.</p>
        )}

        {Object.entries(grouped).map(([date, items]) => (
          <section key={date} className="mb-6">
            <h2 className="text-zinc-600 font-semibold mb-3">{date}</h2>
            <div className="grid gap-3">
              {items.map((n, i) => (
                <a key={n.link || i} href={n.link} target="_blank" rel="noopener noreferrer">
                  <Card>
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        {/* 번역 제목 우선 사용 */}
                        <div className="font-medium text-[15px] text-zinc-900 whitespace-normal">
                          {n.title_ko || n.title || '제목 없음'}
                        </div>
                        <div className="text-xs text-zinc-500 mt-1">{n.source || n.site || ''}</div>
                      </div>

                      {n.image ? (
                        <img
                          src={n.image}
                          alt=""
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-zinc-100"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-zinc-100 flex-shrink-0" />
                      )}
                    </div>
                  </Card>
                </a>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
