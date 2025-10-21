console.log("✅ app.js loaded");

const outEl = document.getElementById("out");
function out(text) {
  if (outEl) outEl.textContent = typeof text === "string" ? text : JSON.stringify(text, null, 2);
}

// 공통 fetch 함수
const api = (path, opts = {}) =>
  fetch(`/api${path}`, {
    method: "GET",
    headers: { Accept: "application/json", ...(opts.headers || {}) },
    ...opts,
  }).then(async (res) => {
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    if (!res.ok) throw { status: res.status, data };
    return data;
  });

// ===== 인증 관련 API =====
async function register(email, name, password) {
  return api("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name, password }),
  });
}

async function login(email, password) {
  return api("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

async function refresh(refreshToken) {
  return api("/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
}

async function logout(refreshToken) {
  return api("/auth/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
}

async function logoutAll(accessToken) {
  return api("/auth/logout-all", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

async function getMe(accessToken) {
  return api("/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

// ===== UI 처리 =====
document.getElementById("open-register")?.addEventListener("click", () => {
  document.getElementById("modal-register").removeAttribute("hidden");
});

document.getElementById("open-login")?.addEventListener("click", () => {
  document.getElementById("modal-login").removeAttribute("hidden");
});

document.querySelectorAll("[data-close]")?.forEach((btn) =>
  btn.addEventListener("click", (e) => e.target.closest(".modal").setAttribute("hidden", ""))
);

document.getElementById("form-register")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = e.target.elements["email"].value.trim();
  const name = e.target.elements["name"].value.trim();
  const password = e.target.elements["password"].value;
  try {
    const res = await register(email, name, password);
    out(res);
    alert("회원가입 성공!");
    e.target.reset();
  } catch (err) {
    console.error(err);
    out(err);
    alert("회원가입 실패!");
  }
});

document.getElementById("form-login")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = e.target.elements["email"].value.trim();
  const password = e.target.elements["password"].value;
  try {
    const res = await login(email, password);
    localStorage.setItem("accessToken", res.accessToken);
    localStorage.setItem("refreshToken", res.refreshToken);
    out(res);
    alert("로그인 성공!");
  } catch (err) {
    console.error(err);
    out(err);
    alert("로그인 실패!");
  }
});

document.getElementById("btn-me")?.addEventListener("click", async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await getMe(token);
    out(res);
  } catch (err) {
    out(err);
  }
});

document.getElementById("btn-refresh")?.addEventListener("click", async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    const res = await refresh(refreshToken);
    localStorage.setItem("accessToken", res.accessToken);
    localStorage.setItem("refreshToken", res.refreshToken);
    out(res);
  } catch (err) {
    out(err);
  }
});

document.getElementById("btn-logout")?.addEventListener("click", async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    await logout(refreshToken);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    out("로그아웃 완료");
  } catch (err) {
    out(err);
  }
});

document.getElementById("btn-logout-all")?.addEventListener("click", async () => {
  try {
    const token = localStorage.getItem("accessToken");
    await logoutAll(token);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    out("모든 기기 로그아웃 완료");
  } catch (err) {
    out(err);
  }
});

// ===== 초기 버전 표시 =====
(async () => {
  try {
    const r = await fetch("/api/version");
    const j = await r.json();
    document.getElementById("be-ver").textContent =
      `BE ${j.app} v${j.version} • ${j.commit} • Node ${j.node}`;
  } catch {}
})();
// === AUTH-EXTRAS JS START ===
async function requestVerify(email) {
  return api('/auth/request-verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
}
async function requestReset(email) {
  return api('/auth/request-reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
}
async function resetPasswordWithToken(token, newPassword) {
  return api('/auth/reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword })
  });
}

// 모달 열기
document.getElementById('open-verify')?.addEventListener('click', () => {
  document.getElementById('modal-verify').removeAttribute('hidden');
});
document.getElementById('open-pwreset')?.addEventListener('click', () => {
  document.getElementById('modal-pwreset').removeAttribute('hidden');
});
document.getElementById('open-pwreset-apply')?.addEventListener('click', () => {
  document.getElementById('modal-pwreset-apply').removeAttribute('hidden');
});

// 모달 닫기
document.querySelectorAll('.modal [data-close]')?.forEach((btn) =>
  btn.addEventListener('click', (e) => e.target.closest('.modal').setAttribute('hidden', ''))
);

// 폼 핸들러
document.getElementById('form-request-verify')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = e.target.elements['email'].value.trim();
  try {
    const r = await requestVerify(email);
    out(r); alert('인증 메일 발송 요청 완료!');
    e.target.reset(); e.target.closest('.modal').setAttribute('hidden', '');
  } catch (err) {
    out(err); alert('요청 실패');
  }
});

document.getElementById('form-request-reset')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = e.target.elements['email'].value.trim();
  try {
    const r = await requestReset(email);
    out(r); alert('재설정 메일 발송 요청 완료!');
    e.target.reset(); e.target.closest('.modal').setAttribute('hidden', '');
  } catch (err) {
    out(err); alert('요청 실패');
  }
});

document.getElementById('form-reset-submit')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const token = e.target.elements['token'].value.trim();
  const newPassword = e.target.elements['newPassword'].value;
  try {
    const r = await resetPasswordWithToken(token, newPassword);
    out(r); alert('비밀번호가 변경되었습니다. 새 비밀번호로 로그인하세요.');
    e.target.reset(); e.target.closest('.modal').setAttribute('hidden', '');
  } catch (err) {
    out(err); alert('변경 실패');
  }
});
// === AUTH-EXTRAS JS END ===
