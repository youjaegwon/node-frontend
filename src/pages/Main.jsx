import React from 'react';
import Header from '../components/Header';

export default function Main() {
  // 저장된 사용자 정보 (로그인 시 저장해둔 값 사용)
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user') || 'null');
  } catch (_) {}

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header user={user} />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-3 text-2xl font-bold text-zinc-900">메인</h1>
        <p className="text-zinc-600">
          여기에 메인 콘텐츠를 채워 넣으면 됩니다. 카드/리스트/그래프 등 자유롭게!
        </p>
      </main>
    </div>
  );
}
