import LandingPage from './components/LandingPage'

function App() {
  const startQuiz = () => {
    console.log('Start button clicked')
  }

  return (
    <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      
        <LandingPage onStart={startQuiz} />
    </div>
  )
}

export default App;