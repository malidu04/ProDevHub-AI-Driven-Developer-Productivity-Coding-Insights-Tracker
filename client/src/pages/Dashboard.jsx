import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { sessionsAPI } from '../api/sessionsAPI'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Clock, Target, TrendingUp, Calendar } from 'lucide-react'
import Timer from '../components/Timer'
import ChartCard from '../components/ChartCard'
import Loader from '../components/Loader'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentSessions, setRecentSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsData, sessionsData] = await Promise.all([
        sessionsAPI.getStats(),
        sessionsAPI.getRecentSessions()
      ])
      setStats(statsData)
      setRecentSessions(sessionsData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSession = async (sessionData) => {
    try {
      await sessionsAPI.createSession(sessionData)
      fetchDashboardData() // Refresh data
    } catch (error) {
      console.error('Error saving session:', error)
    }
  }

  if (loading) return <Loader />

  const weeklyData = [
    { day: 'Mon', hours: 3.5 },
    { day: 'Tue', hours: 4.2 },
    { day: 'Wed', hours: 2.8 },
    { day: 'Thu', hours: 5.1 },
    { day: 'Fri', hours: 3.9 },
    { day: 'Sat', hours: 2.1 },
    { day: 'Sun', hours: 1.5 }
  ]

  const statCards = [
    {
      icon: <Clock className="h-6 w-6" />,
      label: 'Total Hours',
      value: `${stats?.totalHours || 0}h`,
      color: 'blue'
    },
    {
      icon: <Target className="h-6 w-6" />,
      label: 'Current Streak',
      value: `${stats?.currentStreak || 0} days`,
      color: 'green'
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      label: 'Sessions',
      value: stats?.totalSessions || 0,
      color: 'purple'
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      label: 'This Week',
      value: `${stats?.weeklyHours || 0}h`,
      color: 'orange'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's your coding productivity overview
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card, index) => (
              <div key={index} className="card text-center">
                <div className={`flex justify-center mb-2 text-${card.color}-600`}>
                  {card.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                <div className="text-sm text-gray-600">{card.label}</div>
              </div>
            ))}
          </div>

          {/* Weekly Progress Chart */}
          <ChartCard title="Weekly Progress">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Recent Sessions */}
          <ChartCard title="Recent Sessions">
            <div className="space-y-3">
              {recentSessions.map((session, index) => (
                <div key={session._id || index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                  <div>
                    <div className="font-medium">{session.project}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(session.startTime).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-lg font-semibold">
                    {(session.duration / 3600).toFixed(1)}h
                  </div>
                </div>
              ))}
              {recentSessions.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No sessions recorded yet. Start tracking your coding time!
                </div>
              )}
            </div>
          </ChartCard>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <Timer onSaveSession={handleSaveSession} />

          {/* Productivity Trend */}
          <ChartCard title="Productivity Trend">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="hours" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  )
}

export default Dashboard