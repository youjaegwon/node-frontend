import React from 'react';
export default function Home() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return (
    <div className="mx-auto max-w-md px-6 py-10">
      <h1 className="text-3xl font-bold mb-4">메인</h1>
      <p className="text-zinc-600">안녕하세요 {user ? user.name : '게스트'}님</p>
    </div>
  );
}
