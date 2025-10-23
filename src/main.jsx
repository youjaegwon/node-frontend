import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './style.css';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Reset from './pages/Reset.jsx'; // 기존 파일 사용
import Home from './pages/Home.jsx';   // 메인 페이지 (간단한 더미라도)

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/reset', element: <Reset /> },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><RouterProvider router={router} /></React.StrictMode>
);
