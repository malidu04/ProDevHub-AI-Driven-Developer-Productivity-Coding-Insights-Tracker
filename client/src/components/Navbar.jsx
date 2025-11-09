import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Code2, Menu, X, User, LogOut } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Code2 className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-gray-900">ProDevHub</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
                <Link to="/projects" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Projects
                </Link>
                <Link to="/sessions" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Sessions
                </Link>
                <Link to="/insights" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Insights
                </Link>
                <div className="flex items-center space-x-4">
                  <Link to="/profile" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-700 hover:text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {user ? (
              <div className="space-y-4">
                <Link to="/dashboard" className="block text-gray-700 hover:text-blue-600">
                  Dashboard
                </Link>
                <Link to="/projects" className="block text-gray-700 hover:text-blue-600">
                  Projects
                </Link>
                <Link to="/sessions" className="block text-gray-700 hover:text-blue-600">
                  Sessions
                </Link>
                <Link to="/insights" className="block text-gray-700 hover:text-blue-600">
                  Insights
                </Link>
                <Link to="/profile" className="block text-gray-700 hover:text-blue-600">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-gray-700 hover:text-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <Link to="/login" className="block text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link to="/register" className="block btn-primary text-center">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar