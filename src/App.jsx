import { useState } from "react";
import LandingPage from "./components/LandingPage";
import QuestionForm from "./components/QuestionForm";
import ErrorBoundary from "./components/ErrorBoundary"; 
import { generateIkigaiAnalysis } from "./utils/gemeni";
import "./index.css";

function App() {
  const [currentStep, setCurrentStep] = useState("landing")
  const [userAnswers, setUserAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  
  const startQuiz = () => {
    setCurrentStep("questions");
    setError(null);
  };

  const handleQuizSubmit = async(submittedAnswers) => {
    setUserAnswers(submittedAnswers);
    setCurrentStep("loading");
    setError(null);

    try {
      const analysis = await generateIkigaiAnalysis(submittedAnswers);
      console.log("Received analysis:", analysis); // Debug log

      if (analysis.error) {
        throw new Error(analysis.message);
      }

      setResults(analysis);
      setCurrentStep("results");
    } catch (error) {
      console.error("Error analyzing responses:", error);
      setError(error.message);
      setCurrentStep("error");
    }    
  }
  const handleRetry = () => {
    setCurrentStep("questions");
    setError(null);
  }


  return (
  <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 p-4">
    <div className="container mx-auto px-4 py-8">
      {currentStep === 'landing' && (
        <LandingPage onStart={startQuiz} />
      )}
      
      {currentStep === 'questions' && (
        <QuestionForm onSubmit={handleQuizSubmit} />
      )}
      
      {currentStep === 'loading' && (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-600">Discovering your Ikigai...</p>
        </div>
      )}
      
      {currentStep === 'error' && (
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {error || 'Something went wrong'}
          </h2>
          <button
            onClick={handleRetry}
            className="px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600"
          >
            Try Again
          </button>
        </div>
      )}
      
      {currentStep === 'results' && results && (
        <ResultsPage results={results} answers={userAnswers} />
      )}
    </div>
  </div>
)
}

export default App
