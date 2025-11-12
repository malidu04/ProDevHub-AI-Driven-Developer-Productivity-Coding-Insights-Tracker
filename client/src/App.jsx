import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Timer from './components/TImer'
import ChartCard from './components/ChartCard'
import Home from './pages/Home'


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Timer />
            <ChartCard />
            <Home />
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App