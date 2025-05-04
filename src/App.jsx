import { useState } from "react";
import LandingPage from "./components/LandingPage";
import QuestionForm from "./components/QuestionForm";
import "./index.css";

function App() {
  const [currentStep, setCurrentStep] = useState("landing");

  const startQuiz = () => {
    setCurrentStep("questions");
    console.log("Quiz started");
  };

  const handleQuizSubmit = (answers) => {
    console.log("Submitted answers:", answers);
  };
  return (
    <div className="container mx-auto px-4 py-8">
      {currentStep === "landing" && <LandingPage onStart={startQuiz} />}
      {currentStep === "questions" && (
        <QuestionForm onSubmit={handleQuizSubmit} />
      )}
    </div>
  );
}

export default App;
