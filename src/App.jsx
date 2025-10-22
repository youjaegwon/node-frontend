import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Main from "./pages/Main";

function RequireAuth({ children }) {
  const hasToken = typeof localStorage !== "undefined" && !!localStorage.getItem("accessToken");
  return hasToken ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [enter, setEnter] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // 경로 바뀔 때마다 진입 애니메이션
    setEnter(false);
    const t = setTimeout(() => setEnter(true), 0);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <div className={`page ${enter ? "enter" : ""} min-h-full`}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Main />
            </RequireAuth>
          }
        />
        {/* 필요하면 회원가입/비번재설정 라우트 나중에 추가 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}
