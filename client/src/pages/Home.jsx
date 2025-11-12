import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Code2, BarChart3, Brain, Github, Clock } from 'lucide-react'

const Home = () => {
  const { user } = useAuth()

  const features = [
    {
      icon: <Clock className="h-8 w-8" />,
      title: 'Session Tracking',
      description: 'Track your coding sessions with our built-in timer and manual logging.'
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: 'Analytics Dashboard',
      description: 'Visualize your productivity trends, streaks, and performance metrics.'
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: 'AI Insights',
      description: 'Get personalized productivity suggestions powered by OpenAI.'
    },
    {
      icon: <Github className="h-8 w-8" />,
      title: 'GitHub Integration',
      description: 'Automatically sync your commit activity and repository progress.'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Code2 className="h-16 w-16" />
            </div>
            <h1 className="text-5xl font-bold mb-6">
              Track Your Coding Journey with AI
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              ProDevHub helps developers monitor productivity, analyze patterns, and get intelligent insights to improve their coding workflow.
            </p>
            {user ? (
              <Link to="/dashboard" className="btn-primary bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
                Go to Dashboard
              </Link>
            ) : (
              <Link to="/register" className="btn-primary bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
                Start Tracking Free
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Level Up
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools designed specifically for developers to track and improve their productivity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4 text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Boost Your Productivity?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of developers who are already improving their workflow with ProDevHub.
          </p>
          {!user && (
            <Link to="/register" className="btn-primary text-lg px-8 py-3">
              Create Your Account
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home