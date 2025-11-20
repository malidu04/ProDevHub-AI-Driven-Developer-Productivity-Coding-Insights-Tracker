import React, { useState, useEffect } from 'react'
import { aiAPI } from '../api/aiAPI'
import { Brain, TrendingUp, Target, Lightbulb } from 'lucide-react'
import ChartCard from '../components/ChartCard'
import Loader from '../components/Loader'

const Insights = () => {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    fetchInsights()
  }, [])

  const fetchInsights = async () => {
    try {
      const data = await aiAPI.getInsights()
      setInsights(data)
    } catch (error) {
      console.error('Error fetching insights:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateWeeklyReport = async () => {
    setGenerating(true)
    try {
      const report = await aiAPI.generateWeeklyReport()
      setInsights(prev => ({ ...prev, weeklyReport: report }))
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      setGenerating(false)
    }
  }

  if (loading) return <Loader />

  const productivityData = [
    { day: 'Mon', productivity: 85 },
    { day: 'Tue', productivity: 92 },
    { day: 'Wed', productivity: 78 },
    { day: 'Thu', productivity: 88 },
    { day: 'Fri', productivity: 95 },
    { day: 'Sat', productivity: 65 },
    { day: 'Sun', productivity: 45 }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Insights</h1>
          <p className="text-gray-600 mt-2">
            Smart productivity analysis and personalized recommendations
          </p>
        </div>
        <button
          onClick={generateWeeklyReport}
          disabled={generating}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50"
        >
          <Brain className="h-4 w-4" />
          <span>{generating ? 'Generating...' : 'Generate Weekly Report'}</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Productivity Score */}
        <ChartCard title="Productivity Score">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mb-4">
              <span className="text-3xl font-bold text-white">87%</span>
            </div>
            <p className="text-gray-600">
              Your productivity is better than 75% of developers
            </p>
          </div>
        </ChartCard>

        {/* Best Coding Times */}
        <ChartCard title="Best Coding Times">
          <div className="space-y-4">
            {[
              { time: 'Morning (9AM - 12PM)', efficiency: '92%' },
              { time: 'Afternoon (2PM - 5PM)', efficiency: '85%' },
              { time: 'Evening (7PM - 10PM)', efficiency: '78%' },
              { time: 'Late Night (11PM - 2AM)', efficiency: '65%' }
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-700">{item.time}</span>
                <span className="font-semibold text-green-600">{item.efficiency}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Weekly Report */}
        <div className="lg:col-span-2">
          <ChartCard title="Weekly AI Report">
            {insights?.weeklyReport ? (
              <div className="prose max-w-none">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="text-blue-800 font-semibold mb-2">📊 Weekly Summary</h4>
                  <p className="text-blue-700">{insights.weeklyReport.summary}</p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold mb-2 flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Key Achievements</span>
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {insights.weeklyReport.achievements?.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold mb-2 flex items-center space-x-2">
                    <Target className="h-4 w-4" />
                    <span>Recommendations</span>
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {insights.weeklyReport.recommendations?.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 flex items-center space-x-2">
                    <Lightbulb className="h-4 w-4" />
                    <span>Focus Areas</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {insights.weeklyReport.focusAreas?.map((area, index) => (
                      <span
                        key={index}
                        className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No AI Report Generated
                </h3>
                <p className="text-gray-600 mb-4">
                  Generate your first weekly AI report to get personalized insights
                </p>
                <button
                  onClick={generateWeeklyReport}
                  className="btn-primary"
                >
                  Generate Report
                </button>
              </div>
            )}
          </ChartCard>
        </div>

        {/* Productivity Trends */}
        <div className="space-y-8">
          <ChartCard title="Productivity Trends">
            <div className="space-y-4">
              {[
                { metric: 'Code Consistency', trend: 'up', value: '+12%' },
                { metric: 'Session Length', trend: 'stable', value: '±0%' },
                { metric: 'Focus Time', trend: 'up', value: '+8%' },
                { metric: 'Break Efficiency', trend: 'down', value: '-5%' }
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-700">{item.metric}</span>
                  <span
                    className={`font-semibold ${
                      item.trend === 'up'
                        ? 'text-green-600'
                        : item.trend === 'down'
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Quick Tips */}
          <ChartCard title="AI Suggestions">
            <div className="space-y-3">
              {[
                "Try the Pomodoro technique for better focus",
                "Schedule deep work sessions in your most productive hours",
                "Review your code before committing to improve quality",
                "Take regular breaks to maintain mental freshness"
              ].map((tip, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Lightbulb className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  )
}

export default Insights