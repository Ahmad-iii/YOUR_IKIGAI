import { useState } from "react";
import LandingPage from "./components/LandingPage";
import QuestionForm from "./components/QuestionForm";
import ErrorBoundary from "./components/ErrorBoundary"; 
import { generateIkigaiAnalysis } from "./utils/gemeni";
import "./index.css";

function App() {
  const [currentStep, setCurrentStep] = useState("landing");

  const startQuiz = () => {
    setCurrentStep("questions");
    console.log("Quiz started");
  };

  const handleQuizSubmit = async(submittedAnswers) => {
    setCurrentStep("loading");
    try {
      const analysis = await generateIkigaiAnalysis(submittedAnswers);
      console.log("Ikigai Analysis:", analysis);
    }
    catch (error){
      console.error("Error analyzing responses:", error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
    <div className="container mx-auto px-4 py-8">
      <ErrorBoundary>
      {currentStep === "landing" && <LandingPage onStart={startQuiz} />}
      {currentStep === "questions" && <QuestionForm onSubmit={handleQuizSubmit} />}
      {currentStep === "loading" && (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-600">Discovering your Ikigai...</p>
        </div>
      )}
      </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;
