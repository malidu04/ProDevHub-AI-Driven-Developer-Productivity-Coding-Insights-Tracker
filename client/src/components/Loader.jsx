import React from 'react'

const Loader = ({ 
  size = 'md', 
  fullScreen = false,
  text = ''
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-12 w-12 border-b-2',
    lg: 'h-16 w-16 border-b-2',
  }

  const containerClasses = fullScreen
    ? 'fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50'
    : 'flex flex-col items-center justify-center min-h-[400px]'

  return (
    <div className={containerClasses}>
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-blue-600`}>
        <span className="sr-only">Loading...</span>
      </div>
      {text && (
        <p className="mt-4 text-sm text-gray-600 font-medium">
          {text}
        </p>
      )}
    </div>
  )
}

// Simple button loader component
export const ButtonLoader = ({ size = 'sm' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-5 w-5 border-2',
  }

  return (
    <div 
      className={`animate-spin rounded-full border-white border-t-transparent ${sizeClasses[size]}`}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default Loader