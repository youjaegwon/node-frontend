import React, { useState } from 'react';

const API = {
  login:   '/api/auth/login',
  me:      '/api/me',
  register:'/api/auth/register',
  pwReq:   '/api/auth/password-reset/request',
  pwConf:  '/api/auth/password-reset/confirm',
  version: '/api/version',
};

async function jfetch(url, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  const res = await fetch(url, { ...opts, headers });
  const text = await res.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
  if (!res.ok) {
    throw Object.assign(new Error(data?.message || data?.error || `HTTP ${res.status}`), { status: res.status, data });
  }
  return data;
}

function Toast({ msg, type }) {
  return (
    <div className={`toast ${msg ? 'show' : ''} ${type || 'ok'}`} role="status" aria-live="polite">
      {msg}
    </div>
  );
}

export default function App() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: 'ok' });

  const [openReg, setOpenReg] = useState(false);
  const [openReset, setOpenReset] = useState(false);

  // register
  const [rEmail, setREmail] = useState('');
  const [rName, setRName] = useState('');
  const [rPw, setRPw] = useState('');
  const [rLoading, setRLoading] = useState(false);

  // reset
  const [xEmail, setXEmail] = useState('');
  const [xToken, setXToken] = useState('');
  const [xNewPw, setXNewPw] = useState('');
  const [xLoading1, setXLoading1] = useState(false);
  const [xLoading2, setXLoading2] = useState(false);

  function showToast(msg, type='ok', ms=2500) {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'ok' }), ms);
  }

  async function onLogin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const out = await jfetch(API.login, { method: 'POST', body: JSON.stringify({ email: email.trim(), password: pw }) });
      localStorage.setItem('AT', out.accessToken || '');
      localStorage.setItem('RT', out.refreshToken || '');
      const me = await jfetch(API.me, { headers: { Authorization: `Bearer ${out.accessToken}` } });
      showToast(`${me.name || me.email || '로그인'} 환영합니다!`, 'ok');
    } catch (err) {
      showToast(err.message || '로그인 실패', 'err');
    } finally {
      setLoading(false);
    }
  }

  async function onRegister(e) {
    e.preventDefault();
    setRLoading(true);
    try {
      await jfetch(API.register, { method: 'POST', body: JSON.stringify({ email: rEmail.trim(), name: rName.trim() || undefined, password: rPw }) });
      showToast('가입 완료! 이제 로그인 해주세요.');
      setOpenReg(false);
      setREmail(''); setRName(''); setRPw('');
    } catch (err) {
      showToast(err.message || '회원가입 실패', 'err');
    } finally {
      setRLoading(false);
    }
  }

  async function onResetRequest(e) {
    e.preventDefault();
    setXLoading1(true);
    try {
      await jfetch(API.pwReq, { method: 'POST', body: JSON.stringify({ email: xEmail.trim() }) });
      showToast('재설정 메일을 보냈습니다.', 'ok');
    } catch (err) {
      showToast(err.message || '메일 전송 실패', 'err');
    } finally {
      setXLoading1(false);
    }
  }

  async function onResetConfirm(e) {
    e.preventDefault();
    setXLoading2(true);
    try {
      await jfetch(API.pwConf, { method: 'POST', body: JSON.stringify({ token: xToken.trim(), newPassword: xNewPw }) });
      showToast('비밀번호를 변경했습니다. 로그인하세요!', 'ok');
      setOpenReset(false);
      setXToken(''); setXNewPw('');
    } catch (err) {
      showToast(err.message || '비밀번호 변경 실패', 'err');
    } finally {
      setXLoading2(false);
    }
  }

  return (
    <div className="container">
      <section className="auth-card" aria-labelledby="login-title">
        <h1 id="login-title">로그인</h1>
        <form className="form" onSubmit={onLogin}>
          <label className="field">
            <span>이메일</span>
            <input type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required />
          </label>
          <label className="field">
            <span>비밀번호</span>
            <input type="password" placeholder="비밀번호" value={pw} onChange={e=>setPw(e.target.value)} required />
          </label>
          <button className="btn primary" type="submit" disabled={loading}>{loading ? '처리 중…' : '로그인'}</button>
        </form>

        <div className="row links">
          <button className="btn ghost" onClick={()=>setOpenReg(true)}>회원가입</button>
          <button className="btn ghost" onClick={()=>setOpenReset(true)}>비밀번호 재설정</button>
        </div>

        <div className="divider"><span>또는</span></div>

        <div className="meta">
          <BackendVersion />
        </div>
      </section>

      {/* 회원가입 모달 */}
      {openReg && (
        <div className="modal-backdrop" onClick={()=>setOpenReg(false)}>
          <div className="modal-card" onClick={(e)=>e.stopPropagation()}>
            <header>
              <h2>회원가입</h2>
              <button className="icon close" onClick={()=>setOpenReg(false)} aria-label="닫기">×</button>
            </header>
            <form onSubmit={onRegister}>
              <label className="field">
                <span>이메일</span>
                <input type="email" value={rEmail} onChange={e=>setREmail(e.target.value)} required />
              </label>
              <label className="field">
                <span>이름 (선택)</span>
                <input type="text" value={rName} onChange={e=>setRName(e.target.value)} />
              </label>
              <label className="field">
                <span>비밀번호</span>
                <input type="password" value={rPw} onChange={e=>setRPw(e.target.value)} required />
              </label>
              <footer className="row">
                <button className="btn" type="button" onClick={()=>setOpenReg(false)}>취소</button>
                <button className="btn primary" type="submit" disabled={rLoading}>{rLoading ? '처리 중…' : '가입'}</button>
              </footer>
            </form>
          </div>
        </div>
      )}

      {/* 비밀번호 재설정 모달 */}
      {openReset && (
        <div className="modal-backdrop" onClick={()=>setOpenReset(false)}>
          <div className="modal-card" onClick={(e)=>e.stopPropagation()}>
            <header>
              <h2>비밀번호 재설정</h2>
              <button className="icon close" onClick={()=>setOpenReset(false)} aria-label="닫기">×</button>
            </header>

            <form onSubmit={onResetRequest}>
              <label className="field">
                <span>가입 이메일</span>
                <input type="email" value={xEmail} onChange={e=>setXEmail(e.target.value)} required />
              </label>
              <footer className="row">
                <button className="btn" type="button" onClick={()=>setOpenReset(false)}>닫기</button>
                <button className="btn primary" type="submit" disabled={xLoading1}>{xLoading1 ? '처리 중…' : '메일 보내기'}</button>
              </footer>
            </form>

            <div className="separator"></div>

            <form onSubmit={onResetConfirm}>
              <label className="field">
                <span>토큰</span>
                <input type="text" value={xToken} onChange={e=>setXToken(e.target.value)} required />
              </label>
              <label className="field">
                <span>새 비밀번호</span>
                <input type="password" value={xNewPw} onChange={e=>setXNewPw(e.target.value)} required />
              </label>
              <footer className="row">
                <button className="btn" type="button" onClick={()=>setOpenReset(false)}>닫기</button>
                <button className="btn primary" type="submit" disabled={xLoading2}>{xLoading2 ? '처리 중…' : '비밀번호 변경'}</button>
              </footer>
            </form>
          </div>
        </div>
      )}

      <Toast msg={toast.msg} type={toast.type} />
    </div>
  );
}

function BackendVersion(){
  const [txt, setTxt] = React.useState('BE: 확인중…');
  React.useEffect(()=>{
    (async ()=>{
      try{
        const v = await jfetch('/api/version');
        setTxt(`BE ${v.app||'app'} ${v.version||''} • ${v.commit||''}`);
      }catch{
        setTxt('BE: 확인 실패');
      }
    })();
  },[]);
  return <span title="백엔드 버전">{txt}</span>;
}
