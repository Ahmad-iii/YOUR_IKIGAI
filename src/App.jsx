import { useState } from 'react'
import LandingPage from './components/LandingPage'
import './index.css'

function App() {
  const [currentStep, setCurrentStep] = useState('landing')

  const startQuiz = () => {
    setCurrentStep('questions')
    console.log('Quiz started')
  }

  return (
    <div className="">
      {currentStep === 'landing' && <LandingPage onStart={startQuiz} />}
      {currentStep === 'questions' && <div>YE TU Question ki jagah hai</div>}
    </div>
  )
}

export default App