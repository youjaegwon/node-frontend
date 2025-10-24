import React from 'react';
import Header from '../components/Header';
import NewsWidget from '../components/NewsWidget';
import MarketsWidget from '../components/MarketsWidget';

export default function Main() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* 거래소별 시세 */}
      <div className="max-w-2xl mx-auto px-5 py-4">
        <MarketsWidget />
      </div>

      {/* 코인 뉴스 */}
      <div className="max-w-2xl mx-auto px-5 py-6">
        <NewsWidget />
      </div>
    </div>
  );
}
