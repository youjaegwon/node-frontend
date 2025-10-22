import React, { useState, useEffect } from "react";

const API = {
  login:   "/api/auth/login",
  me:      "/api/me",
  register:"/api/auth/register",
  pwReq:   "/api/auth/password-reset/request",
  pwConf:  "/api/auth/password-reset/confirm",
  version: "/api/version",
};

async function jfetch(url, opts = {}) {
  const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
  const res = await fetch(url, { ...opts, headers });
  const text = await res.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
  if (!res.ok) {
    throw Object.assign(new Error(data?.message || data?.error || `HTTP ${res.status}`), { status: res.status, data });
  }
  return data;
}

const IconMail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 6h16v12H4z" stroke="currentColor" opacity=".5"/>
    <path d="m4 7 8 6 8-6" stroke="currentColor"/>
  </svg>
);
const IconLock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="5" y="10" width="14" height="9" rx="2" stroke="currentColor"/>
    <path d="M9 10V8a3 3 0 1 1 6 0v2" stroke="currentColor"/>
  </svg>
);
const IconClose = () => <span aria-hidden="true">×</span>;

function Toast({ msg, type }) {
  return <div className={`toast ${msg ? "show" : ""} ${type || "ok"}`} role="status">{msg}</div>;
}

export default function App() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "ok" });

  const [openReg, setOpenReg] = useState(false);
  const [openReset, setOpenReset] = useState(false);

  // register fields
  const [rEmail, setREmail] = useState("");
  const [rName, setRName] = useState("");
  const [rPw, setRPw] = useState("");
  const [rLoading, setRLoading] = useState(false);

  // reset fields
  const [xEmail, setXEmail] = useState("");
  const [xToken, setXToken] = useState("");
  const [xNewPw, setXNewPw] = useState("");
  const [xLoading1, setXLoading1] = useState(false);
  const [xLoading2, setXLoading2] = useState(false);

  const [beVer, setBeVer] = useState("확인중…");

  useEffect(() => {
    (async () => {
      try {
        const v = await jfetch(API.version);
        setBeVer(`BE ${v.app || "app"} ${v.version || ""} • ${v.commit || ""}`);
      } catch {
        setBeVer("연결 실패");
      }
    })();
  }, []);

  function showToast(msg, type = "ok", ms = 2600) {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "ok" }), ms);
  }

  async function onLogin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const out = await jfetch(API.login, { method: "POST", body: JSON.stringify({ email: email.trim(), password: pw }) });
      localStorage.setItem("AT", out.accessToken || "");
      localStorage.setItem("RT", out.refreshToken || "");
      const me = await jfetch(API.me, { headers: { Authorization: `Bearer ${out.accessToken}` } });
      showToast(`${me.name || me.email || "로그인"} 환영합니다!`);
    } catch (err) {
      showToast(err.message || "로그인 실패", "err");
    } finally {
      setLoading(false);
    }
  }

  async function onRegister(e) {
    e.preventDefault();
    setRLoading(true);
    try {
      await jfetch(API.register, { method: "POST", body: JSON.stringify({ email: rEmail.trim(), name: rName.trim() || undefined, password: rPw }) });
      showToast("가입 완료! 이제 로그인 해주세요.");
      setOpenReg(false); setREmail(""); setRName(""); setRPw("");
    } catch (err) {
      showToast(err.message || "회원가입 실패", "err");
    } finally {
      setRLoading(false);
    }
  }

  async function onResetRequest(e) {
    e.preventDefault();
    setXLoading1(true);
    try {
      await jfetch(API.pwReq, { method: "POST", body: JSON.stringify({ email: xEmail.trim() }) });
      showToast("재설정 메일을 보냈습니다.");
    } catch (err) {
      showToast(err.message || "메일 전송 실패", "err");
    } finally {
      setXLoading1(false);
    }
  }

  async function onResetConfirm(e) {
    e.preventDefault();
    setXLoading2(true);
    try {
      await jfetch(API.pwConf, { method: "POST", body: JSON.stringify({ token: xToken.trim(), newPassword: xNewPw }) });
      showToast("비밀번호를 변경했습니다. 로그인하세요!");
      setOpenReset(false); setXToken(""); setXNewPw("");
    } catch (err) {
      showToast(err.message || "비밀번호 변경 실패", "err");
    } finally {
      setXLoading2(false);
    }
  }

  return (
    <div className="wrap">
      {/* 배경 장식 */}
      <div className="bg bg-1" />
      <div className="bg bg-2" />
      <div className="bg bg-3" />

      <main className="shell">
        <section className="panel">
          <div className="brand">
            <div className="logo" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 2l3.5 6h6.5l-5.25 4 2 7L12 15l-6.75 4 2-7L2 8h6.5z"/></svg>
            </div>
            <div className="title">
              <h1>MyApp</h1>
              <p>간결하고 빠른 로그인</p>
            </div>
          </div>

          <form className="form" onSubmit={onLogin}>
            <label className="field">
              <span>이메일</span>
              <div className="input">
                <i><IconMail/></i>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </label>

            <label className="field">
              <span>비밀번호</span>
              <div className="input">
                <i><IconLock/></i>
                <input
                  type="password"
                  placeholder="비밀번호"
                  value={pw}
                  onChange={(e)=>setPw(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </label>

            <button className="btn primary" type="submit" disabled={loading}>
              {loading ? "처리 중…" : "로그인"}
            </button>
          </form>

          <div className="links">
            <button className="btn link" onClick={()=>setOpenReg(true)}>회원가입</button>
            <span>•</span>
            <button className="btn link" onClick={()=>setOpenReset(true)}>비밀번호 재설정</button>
          </div>

          <div className="foot">
            <span className="tag">BE: {beVer}</span>
          </div>
        </section>
      </main>

      {/* 회원가입 모달 */}
      {openReg && (
        <div className="modal" onClick={()=>setOpenReg(false)}>
          <div className="modal-card" onClick={(e)=>e.stopPropagation()}>
            <header>
              <h3>회원가입</h3>
              <button className="icon close" onClick={()=>setOpenReg(false)} aria-label="닫기"><IconClose/></button>
            </header>
            <form onSubmit={onRegister}>
              <label className="field">
                <span>이메일</span>
                <input type="email" value={rEmail} onChange={(e)=>setREmail(e.target.value)} required/>
              </label>
              <label className="field">
                <span>이름(선택)</span>
                <input type="text" value={rName} onChange={(e)=>setRName(e.target.value)}/>
              </label>
              <label className="field">
                <span>비밀번호</span>
                <input type="password" value={rPw} onChange={(e)=>setRPw(e.target.value)} required/>
              </label>
              <footer className="row">
                <button type="button" className="btn" onClick={()=>setOpenReg(false)}>취소</button>
                <button className="btn primary" disabled={rLoading}>{rLoading ? "처리 중…" : "가입"}</button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* 비밀번호 재설정 모달 */}
      {openReset && (
        <div className="modal" onClick={()=>setOpenReset(false)}>
          <div className="modal-card" onClick={(e)=>e.stopPropagation()}>
            <header>
              <h3>비밀번호 재설정</h3>
              <button className="icon close" onClick={()=>setOpenReset(false)} aria-label="닫기"><IconClose/></button>
            </header>

            <form onSubmit={onResetRequest}>
              <label className="field">
                <span>가입 이메일</span>
                <input type="email" value={xEmail} onChange={(e)=>setXEmail(e.target.value)} required/>
              </label>
              <footer className="row">
                <button type="button" className="btn" onClick={()=>setOpenReset(false)}>닫기</button>
                <button className="btn primary" disabled={xLoading1}>{xLoading1 ? "처리 중…" : "메일 보내기"}</button>
              </footer>
            </form>

            <div className="sep" />

            <form onSubmit={onResetConfirm}>
              <label className="field">
                <span>토큰</span>
                <input type="text" value={xToken} onChange={(e)=>setXToken(e.target.value)} required/>
              </label>
              <label className="field">
                <span>새 비밀번호</span>
                <input type="password" value={xNewPw} onChange={(e)=>setXNewPw(e.target.value)} required/>
              </label>
              <footer className="row">
                <button type="button" className="btn" onClick={()=>setOpenReset(false)}>닫기</button>
                <button className="btn primary" disabled={xLoading2}>{xLoading2 ? "처리 중…" : "비밀번호 변경"}</button>
              </footer>
            </form>
          </div>
        </div>
      )}

      <Toast msg={toast.msg} type={toast.type}/>
    </div>
  );
}
