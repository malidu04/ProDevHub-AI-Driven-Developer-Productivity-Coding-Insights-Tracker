import React, { useState, useEffect } from 'react'
import { Play, Square, Save } from 'lucide-react'

const Timer = ({ onSaveSession }) => {
  const [isRunning, setIsRunning] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [project, setProject] = useState('')

  useEffect(() => {
    let interval = null
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const startTimer = () => {
    setIsRunning(true)
  }

  const stopTimer = () => {
    setIsRunning(false)
  }

  const saveSession = async () => {
    if (elapsedTime > 0) {
      await onSaveSession({
        duration: elapsedTime,
        project: project || 'General Coding'
      })
      setElapsedTime(0)
      setProject('')
    }
  }

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Coding Session Timer</h3>
      
      <div className="text-center mb-6">
        <div className="text-4xl font-mono font-bold text-gray-900">
          {formatTime(elapsedTime)}
        </div>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Project name (optional)"
          value={project}
          onChange={(e) => setProject(e.target.value)}
          className="input-field"
        />

        <div className="flex space-x-3">
          {!isRunning ? (
            <button
              onClick={startTimer}
              className="flex items-center space-x-2 btn-primary flex-1 justify-center"
            >
              <Play className="h-4 w-4" />
              <span>Start</span>
            </button>
          ) : (
            <button
              onClick={stopTimer}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg flex-1 justify-center"
            >
              <Square className="h-4 w-4" />
              <span>Stop</span>
            </button>
          )}
          
          <button
            onClick={saveSession}
            disabled={elapsedTime === 0}
            className="flex items-center space-x-2 btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Timer