const $ = s=>document.querySelector(s);
const out = $("#out");
const show = (x)=>out.textContent = (typeof x==="string")?x:JSON.stringify(x,null,2);

// 모달
function openModal(id){ $(id).hidden=false; }
function closeModal(e){ e.target.closest(".modal").hidden=true; }
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",closeModal));
$("#open-register").onclick = ()=>openModal("#modal-register");
$("#open-login").onclick    = ()=>openModal("#modal-login");

// 공통 fetch (쿠키 포함)
async function api(path, opt={}) {
  const res = await fetch(path.startsWith("/api")?path:`/api${path}`, {
    credentials:"include", // ★ 쿠키 보내기
    headers: Object.assign({"Content-Type":"application/json"}, opt.headers||{}),
    method: opt.method||"GET",
    body: opt.body
  });
  const text = await res.text();
  let data; try{ data = JSON.parse(text); }catch{ data = text; }
  return {res, data};
}

// 회원가입
$("#form-register").addEventListener("submit", async (e)=>{
  e.preventDefault();
  const body = JSON.stringify(Object.fromEntries(new FormData(e.target).entries()));
  const {res, data} = await api("/auth/register",{method:"POST", body});
  show(data); closeModal(e);
});

// 로그인 (쿠키에 AT/RT 세팅됨)
$("#form-login").addEventListener("submit", async (e)=>{
  e.preventDefault();
  const body = JSON.stringify(Object.fromEntries(new FormData(e.target).entries()));
  const {res, data} = await api("/auth/login",{method:"POST", body});
  show(data); closeModal(e);
});

// 보호 API들
$("#btn-me").onclick = async ()=>{
  const {data} = await api("/me"); show(data);
};
$("#btn-refresh").onclick = async ()=>{
  const {data} = await api("/auth/refresh",{method:"POST", body:"{}"}); show(data);
};
$("#btn-logout").onclick = async ()=>{
  const {data} = await api("/auth/logout",{method:"POST", body:"{}"}); show(data);
};
$("#btn-logout-all").onclick = async ()=>{
  const {data} = await api("/auth/logout-all",{method:"POST", body:"{}"}); show(data);
};

// 배지
(async ()=>{
  $("#fe-ver").textContent = "FE modal+cookie";
  try {
    const r = await fetch("/api/version",{credentials:"include"});
    if (r.ok){ const v = await r.json(); $("#be-ver").textContent = `BE ${v.app} v${v.version}`; }
  } catch {}
})();
