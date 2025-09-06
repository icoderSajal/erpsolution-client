import React from 'react'
import { Outlet } from 'react-router-dom'

export default function Leaddashboard() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Main Content Area */}
      <div className="min-h-screen w-full">
        <main className="pt-16 px-4 overflow-y-auto h-full">
          <Outlet/>
        </main>
      </div>
    </div>
  )
}
