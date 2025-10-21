/** 간단 상태 */
const state = {
  at: sessionStorage.getItem('AT') || '',
  rt: sessionStorage.getItem('RT') || '',
};
const el = (id)=>document.getElementById(id);
const setTokens = ({ accessToken, refreshToken })=>{
  if (accessToken) { state.at = accessToken; sessionStorage.setItem('AT', accessToken); el('at').textContent = accessToken; }
  if (refreshToken){ state.rt = refreshToken; sessionStorage.setItem('RT', refreshToken); el('rt').textContent = refreshToken; }
};
el('at').textContent = state.at || '-';
el('rt').textContent = state.rt || '-';

/** 공통 fetch: 401이면 RT로 자동 재발급 후 1회 재시도 */
async function apiFetch(path, opts={}) {
  const url = path.startsWith('/api') ? path : `/api${path}`;
  const headers = Object.assign({'Content-Type':'application/json'}, opts.headers||{});
  if (state.at) headers.Authorization = `Bearer ${state.at}`;
  const doFetch = () => fetch(url, {...opts, headers});
  let res = await doFetch();
  if (res.status === 401 && state.rt) {
    // refresh 시도
    const r = await fetch('/api/auth/refresh', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ refreshToken: state.rt })
    });
    if (r.ok) {
      const t = await r.json(); setTokens(t);
      headers.Authorization = `Bearer ${state.at}`;
      res = await doFetch(); // 1회 재시도
    }
  }
  return res;
}

/** 회원가입 */
document.getElementById('form-register').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  const res = await apiFetch('/auth/register',{method:'POST', body:JSON.stringify(data)});
  el('out-register').textContent = await res.text();
});

/** 로그인 */
document.getElementById('form-login').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  const res = await apiFetch('/auth/login',{method:'POST', body:JSON.stringify(data)});
  const txt = await res.text();
  try { const json = JSON.parse(txt); setTokens(json); }
  catch(_) {}
  el('out-login').textContent = txt;
});

/** 보호 API들 */
el('btn-me').addEventListener('click', async ()=>{
  const res = await apiFetch('/me'); el('out-protected').textContent = await res.text();
});
el('btn-refresh').addEventListener('click', async ()=>{
  const res = await fetch('/api/auth/refresh',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({refreshToken: state.rt})});
  const txt = await res.text(); try{ setTokens(JSON.parse(txt)); }catch(_){}
  el('out-protected').textContent = txt;
});
el('btn-logout').addEventListener('click', async ()=>{
  const res = await fetch('/api/auth/logout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({refreshToken: state.rt})});
  el('out-protected').textContent = await res.text();
});
el('btn-logout-all').addEventListener('click', async ()=>{
  const headers = {'Content-Type':'application/json'};
  if (state.at) headers.Authorization = `Bearer ${state.at}`;
  const res = await fetch('/api/auth/logout-all',{method:'POST',headers});
  el('out-protected').textContent = await res.text();
});

/** 상태 표시 */
(async ()=>{
  try { const a = await fetch('/api/healthz'); el('hz').textContent = (await a.text()) || a.status; } catch{ el('hz').textContent = 'error'; }
  try { const b = await fetch('/api/db/ping'); el('db').textContent = await b.text(); } catch{ el('db').textContent = 'error'; }
  // 배지(선택) – 백엔드 /api/version 있으면 표시
  const fe = document.getElementById('fe-ver'); const be = document.getElementById('be-ver');
  const build = document.currentScript.src.split('v=')[1]||'0'; fe.textContent = `FE v 0.0.${build}`;
  try {
    const r = await fetch('/api/version'); if (r.ok){ const v = await r.json();
      be.textContent = `BE ${v.app} v${v.version} · ${v.commit?.slice(0,7)||'unknown'}`;
    }
  } catch {}
})();
