import React from 'react'
import WellnessApp from './components/WellnessApp'
import ErrorBoundary from './components/common/ErrorBoundary'
import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <WellnessApp />
    </ErrorBoundary>
  )
}

export default App