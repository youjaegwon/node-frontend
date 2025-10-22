// 간단한 헬퍼들
const $ = (sel) => document.querySelector(sel);
const out = $("#out");
const print = (v) => (out.textContent = typeof v === "string" ? v : JSON.stringify(v, null, 2));

const store = {
  get at(){ return localStorage.getItem("AT") || ""; },
  set at(v){ v ? localStorage.setItem("AT", v) : localStorage.removeItem("AT"); },
  get rt(){ return localStorage.getItem("RT") || ""; },
  set rt(v){ v ? localStorage.setItem("RT", v) : localStorage.removeItem("RT"); },
};

// 버전/헬스
(async () => {
  $("#fe-ver").textContent = `FE v0.0.0`;
  try {
    const res = await fetch("/api/version");
    const v = await res.json();
    $("#be-banner").textContent = `BE ${v.app} v${v.version} • ${v.commit || "unknown"} • Node ${v.node}`;
    $("#be-ver").textContent = `BE ${v.app} v${v.version}`;
  } catch {
    $("#be-banner").textContent = "BE: 연결 실패";
  }
})();

// 공통 fetch
async function call(path, { method="GET", json, auth=false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth && store.at) headers["Authorization"] = `Bearer ${store.at}`;
  const res = await fetch(path, { method, headers, body: json ? JSON.stringify(json) : undefined });
  const text = await res.text();
  try { return { ok: res.ok, status: res.status, data: JSON.parse(text) }; }
  catch { return { ok: res.ok, status: res.status, data: text }; }
}

// 모달 도우미
function openDialog(id){ $(id).showModal(); }
function closeDialog(id){ $(id).close(); }

// 버튼 바인딩
$('[data-open="register"]').addEventListener("click", () => openDialog("#modal-register"));
$('[data-open="login"]').addEventListener("click", () => openDialog("#modal-login"));
$("#btn-email-verify").addEventListener("click", () => openDialog("#modal-login")); // 인증은 로그인 사용자 대상으로 전송 가정
$("#btn-req-reset").addEventListener("click", () => openDialog("#modal-req-reset"));
$("#btn-reset-with-token").addEventListener("click", () => openDialog("#modal-reset-token"));

$("#btn-me").addEventListener("click", async () => {
  const r = await call("/api/me", { auth:true });
  print(r);
});

$("#btn-refresh").addEventListener("click", async () => {
  if (!store.rt) return print({ error:"no_refresh_token" });
  const r = await call("/api/auth/refresh", { method:"POST", json:{ refreshToken: store.rt } });
  if (r.ok) { store.at = r.data.accessToken; store.rt = r.data.refreshToken; }
  print(r);
});

$("#btn-logout").addEventListener("click", async () => {
  const r = await call("/api/auth/logout", { method:"POST", json:{ refreshToken: store.rt } });
  if (r.ok) { store.at = ""; store.rt = ""; }
  print(r);
});

$("#btn-logout-all").addEventListener("click", async () => {
  const r = await call("/api/auth/logout-all", { method:"POST", auth:true });
  if (r.ok) { store.at = ""; store.rt = ""; }
  print(r);
});

// 폼 핸들러: 회원가입
$("#form-register").addEventListener("close", async function(){
  if (this.returnValue !== "ok") return;
  const f = this.querySelector("form") || this; // dialog 자체가 form
  const email = this.querySelector('[name="email"]').value.trim();
  const name  = this.querySelector('[name="name"]').value.trim() || undefined;
  const password = this.querySelector('[name="password"]').value;
  closeDialog("#modal-register");
  const r = await call("/api/auth/register", { method:"POST", json:{ email, name, password } });
  print(r);
});

// 폼 핸들러: 로그인
$("#form-login").addEventListener("close", async function(){
  if (this.returnValue !== "ok") return;
  const email = this.querySelector('[name="email"]').value.trim();
  const password = this.querySelector('[name="password"]').value;
  closeDialog("#modal-login");
  const r = await call("/api/auth/login", { method:"POST", json:{ email, password } });
  if (r.ok) { store.at = r.data.accessToken; store.rt = r.data.refreshToken; }
  print(r);
});

// 폼 핸들러: 비번 재설정 요청
$("#form-req-reset").addEventListener("close", async function(){
  if (this.returnValue !== "ok") return;
  const email = this.querySelector('[name="email"]').value.trim();
  closeDialog("#modal-req-reset");
  const r = await call("/api/auth/password-reset/request", { method:"POST", json:{ email } });
  print(r);
});

// 폼 핸들러: 토큰으로 비번 변경
$("#form-reset-token").addEventListener("close", async function(){
  if (this.returnValue !== "ok") return;
  const token = this.querySelector('[name="token"]').value.trim();
  const newPassword = this.querySelector('[name="newPassword"]').value;
  closeDialog("#modal-reset-token");
  const r = await call("/api/auth/password-reset/confirm", { method:"POST", json:{ token, newPassword } });
  print(r);
});

// 초기 상태 보여주기
print({ hint: "버튼을 눌러 API를 호출하세요.", at: !!store.at, rt: !!store.rt });
