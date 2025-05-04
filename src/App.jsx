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
      {currentStep === "questions" && (
        <QuestionForm onSubmit={handleQuizSubmit} />
      )}
      </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;
