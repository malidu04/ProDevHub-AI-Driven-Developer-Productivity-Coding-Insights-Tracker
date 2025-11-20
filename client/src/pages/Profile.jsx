import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../api/authAPI'
import { User, Mail, Github, Save, Edit } from 'lucide-react'

const Profile = () => {
  const { user, logout } = useAuth()
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    githubUsername: '',
    dailyGoal: '',
    weeklyGoal: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        githubUsername: user.githubUsername || '',
        dailyGoal: user.dailyGoal?.toString() || '4',
        weeklyGoal: user.weeklyGoal?.toString() || '20'
      })
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      await authAPI.updateProfile(formData)
      setMessage('Profile updated successfully!')
      setEditing(false)
      // Note: In a real app, you'd update the user context here
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error updating profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account and preferences</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              <button
                onClick={() => setEditing(!editing)}
                className="btn-secondary flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>{editing ? 'Cancel' : 'Edit'}</span>
              </button>
            </div>

            {message && (
              <div className={`mb-4 px-4 py-3 rounded-lg ${
                message.includes('Error') 
                  ? 'bg-red-50 border border-red-200 text-red-600'
                  : 'bg-green-50 border border-green-200 text-green-600'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-1" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!editing}
                    className="input-field disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!editing}
                    className="input-field disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Github className="h-4 w-4 inline mr-1" />
                    GitHub Username
                  </label>
                  <input
                    type="text"
                    name="githubUsername"
                    value={formData.githubUsername}
                    onChange={handleChange}
                    disabled={!editing}
                    className="input-field disabled:bg-gray-100"
                    placeholder="Enter your GitHub username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Daily Coding Goal (hours)
                  </label>
                  <input
                    type="number"
                    name="dailyGoal"
                    value={formData.dailyGoal}
                    onChange={handleChange}
                    disabled={!editing}
                    className="input-field disabled:bg-gray-100"
                    min="1"
                    max="12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weekly Coding Goal (hours)
                  </label>
                  <input
                    type="number"
                    name="weeklyGoal"
                    value={formData.weeklyGoal}
                    onChange={handleChange}
                    disabled={!editing}
                    className="input-field disabled:bg-gray-100"
                    min="5"
                    max="60"
                  />
                </div>
              </div>

              {editing && (
                <div className="flex space-x-3 mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="space-y-6">
          {/* Account Summary */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Account Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Member since</span>
                <span className="font-medium">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account type</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">GitHub connected</span>
                <span className="font-medium">
                  {user?.githubUsername ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card border border-red-200">
            <h3 className="text-lg font-semibold mb-4 text-red-700">Danger Zone</h3>
            <p className="text-sm text-gray-600 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              onClick={logout}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile