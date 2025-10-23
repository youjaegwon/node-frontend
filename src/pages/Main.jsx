import React,{useState} from 'react';
import Header from '../components/Header';

export default function Main(){
  const [menuOpen,setMenuOpen] = useState(false);
  const user = { name: '사용자' };
  function handleLogout(){ localStorage.removeItem('token'); location.href='/login'; }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header user={user} onLogout={handleLogout} onToggleMenu={()=>setMenuOpen(v=>!v)} />
      <main className="max-w-3xl mx-auto px-5 py-8">
        <h2 className="text-2xl font-bold mb-4">메인 화면</h2>
        <p className="text-zinc-600">로그인 후 진입하는 기본 화면입니다.</p>
      </main>
      {/* 간단한 드로어 */}
      <div className={`fixed inset-0 z-40 ${menuOpen?'':'pointer-events-none'}`}>
        <div className={`absolute inset-0 bg-black/20 transition ${menuOpen?'opacity-100':'opacity-0'}`} onClick={()=>setMenuOpen(false)} />
        <aside className={`absolute right-0 top-0 h-full w-72 bg-white border-l border-zinc-100 p-6 transition-transform ${menuOpen?'translate-x-0':'translate-x-full'}`}>
          <h3 className="font-semibold mb-4">메뉴</h3>
          <ul className="space-y-3 text-zinc-700">
            <li><a href="#" className="hover:underline">내 정보</a></li>
            <li><a href="#" className="hover:underline">환경설정</a></li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
