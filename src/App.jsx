import React from 'react'
import { Outlet } from 'react-router-dom'

export default function App() {
  return (
    <div className="min-h-full flex items-center justify-center p-6">
      <Outlet />
    </div>
  )
}
