import React, { useState, useEffect } from 'react'
import { sessionsAPI } from '../api/sessionsAPI'
import { Calendar, Clock, Filter } from 'lucide-react'
import Timer from '../components/Timer'
import Loader from '../components/Loader'

const Sessions = () => {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const data = await sessionsAPI.getSessions()
      setSessions(data)
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSession = async (sessionData) => {
    try {
      await sessionsAPI.createSession(sessionData)
      fetchSessions()
    } catch (error) {
      console.error('Error saving session:', error)
    }
  }

  const filteredSessions = sessions.filter(session => {
    if (filter === 'all') return true
    const sessionDate = new Date(session.startTime)
    const today = new Date()
    
    switch (filter) {
      case 'today':
        return sessionDate.toDateString() === today.toDateString()
      case 'week':
        const weekAgo = new Date(today.setDate(today.getDate() - 7))
        return sessionDate >= weekAgo
      case 'month':
        const monthAgo = new Date(today.setMonth(today.getMonth() - 1))
        return sessionDate >= monthAgo
      default:
        return true
    }
  })

  const totalHours = filteredSessions.reduce((total, session) => total + (session.duration / 3600), 0)

  if (loading) return <Loader />

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Coding Sessions</h1>
          <p className="text-gray-600 mt-2">Track and manage your coding time</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Timer onSaveSession={handleSaveSession} />
          
          <div className="card mt-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filter Sessions</span>
            </h3>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'All Time' },
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'This Week' },
                { value: 'month', label: 'This Month' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    filter === option.value
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card mt-8">
            <h3 className="text-lg font-semibold mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Sessions:</span>
                <span className="font-semibold">{filteredSessions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Hours:</span>
                <span className="font-semibold">{totalHours.toFixed(1)}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Session:</span>
                <span className="font-semibold">
                  {filteredSessions.length > 0 ? (totalHours / filteredSessions.length).toFixed(1) : 0}h
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="card">
            <h3 className="text-lg font-semibold mb-6">Session History</h3>
            
            <div className="space-y-4">
              {filteredSessions.map((session) => (
                <div key={session._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-lg">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-semibold">{session.project}</div>
                      <div className="text-sm text-gray-600 flex items-center space-x-2 mt-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(session.startTime).toLocaleDateString()} • 
                          {new Date(session.startTime).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {(session.duration / 3600).toFixed(1)}h
                    </div>
                    <div className="text-sm text-gray-600">
                      {Math.floor(session.duration / 3600)}h {Math.floor((session.duration % 3600) / 60)}m
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredSessions.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Clock className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No sessions found</h3>
                <p className="text-gray-600">
                  {filter === 'all' 
                    ? "You haven't logged any coding sessions yet."
                    : `No sessions found for the selected filter.`
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sessions