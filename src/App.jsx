import News from './pages/News';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Main from './pages/Main.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Reset from './pages/Reset.jsx';

function isAuthed() {
  try { return !!localStorage.getItem('token'); } catch { return false; }
}

export default function App() {
  const authed = isAuthed();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset" element={<Reset />} />
      {/* 메인: 로그인 상태면 메인, 아니면 로그인으로 */}
      <Route path="/" element={authed ? <Main /> : <Navigate to="/login" replace />} />
      {/* 나머지 경로 정리 */}
      <Route path="*" element={<Navigate to={authed ? '/' : '/login'} replace />} />
      <Route path="/news" element={<News />} />
    </Routes>
  );
}
