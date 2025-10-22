console.log("[frontend] app.js loaded ✅");

const root = document.getElementById("app");
if (root) {
  root.insertAdjacentHTML("beforeend", `
    <section style="margin-top:16px;padding:16px;border:1px solid #ddd;border-radius:8px;background:#fafafa;">
      <h2>JS 연결 OK</h2>
      <p>이 메시지가 보이면 JS가 정상 작동 중입니다.</p>
    </section>
  `);
}
