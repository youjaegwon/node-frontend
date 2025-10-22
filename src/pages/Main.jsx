import React from "react";

export default function Main() {
  const email = typeof localStorage !== "undefined" ? localStorage.getItem("me_email") : null;

  return (
    <div className="min-h-full px-6 py-10">
      <div className="max-w-2xl mx-auto card p-8 animate-fade-in">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">메인 페이지</h2>
        <p className="text-neutral-300 mb-6">
          로그인에 성공했습니다{email ? `, ${email}님!` : "!"}
        </p>

        <div className="flex gap-3">
          <a className="btn-primary" href="/api-docs" target="_blank" rel="noreferrer">
            API 문서 열기
          </a>
          <button
            className="btn-ghost"
            onClick={() => {
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              window.location.href = "/login";
            }}
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
