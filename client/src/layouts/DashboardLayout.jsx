// client/src/layouts/DashboardLayout.jsx
import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default DashboardLayout