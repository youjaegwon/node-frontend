import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;
    setMsg("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pw })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || "로그인에 실패했습니다.");
      }

      // 토큰 저장
      if (data?.accessToken) localStorage.setItem("accessToken", data.accessToken);
      if (data?.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);

      // 전환 애니메이션을 위해 약간의 딜레이 후 이동
      setTimeout(() => nav("/", { replace: true }), 120);
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-full grid place-items-center px-6 py-10">
      <div className="w-full max-w-md card p-8 animate-fade-in-up">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            다시 만나서 반가워요 <span className="align-middle">👋</span>
          </h1>
          <p className="text-neutral-300 mt-3">이메일과 비밀번호로 로그인하세요.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-neutral-400 mb-2">이메일</label>
            <input
              type="email"
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm text-neutral-400">비밀번호</label>
              <a className="link text-sm" href="#" onClick={(e)=>{e.preventDefault(); alert("비밀번호 재설정 모달/페이지 연결 예정");}}>
                비밀번호 재설정
              </a>
            </div>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {msg && (
            <p className="text-[13px] text-red-400">{msg}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <footer className="mt-8 flex items-center justify-between text-sm">
          <span className="text-neutral-400">처음이신가요?</span>
          <a
            className="link"
            href="#"
            onClick={(e)=>{e.preventDefault(); alert("회원가입 모달/페이지 연결 예정");}}
          >
            회원가입
          </a>
        </footer>
      </div>

      <p className="mt-6 text-neutral-500 text-xs">
        © YourApp • React + Vite + Tailwind
      </p>
    </div>
  );
}
