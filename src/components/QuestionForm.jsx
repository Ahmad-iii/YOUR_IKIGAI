import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const questions = [
  {
    id: 1,
    text: "What activity makes you forget to check your phone?",
    category: "Passion",
    placeholder: "e.g., painting, coding, writing..."
  },
  {
    id: 2,
    text: "What do friends always ask you to help with?",
    category: "Skills",
    placeholder: "e.g., tech support, advice, cooking..."
  },
  {
    id: 3,
    text: "What injustice makes you angry to see?",
    category: "Impact",
    placeholder: "e.g., environmental issues, inequality..."
  },
  {
    id: 4,
    text: "What job could you see yourself doing for years?",
    category: "Career",
    placeholder: "e.g., teacher, developer, artist..."
  },
  {
    id: 5,
    text: "What would you do all day if money didn't matter?",
    category: "Passion+Impact",
    placeholder: "e.g., volunteer, create art..."
  },
  {
    id: 6,
    text: "What's something you learned easily that others struggle with?",
    category: "Skills",
    placeholder: "e.g., math, languages..."
  },
  {
    id: 7,
    text: "If you had to volunteer next weekend, where would you go?",
    category: "Impact",
    placeholder: "e.g., animal shelter, teaching..."
  },
  {
    id: 8,
    text: "What's a hobby you'd love to turn into a job?",
    category: "Passion+Career",
    placeholder: "e.g., photography, gaming..."
  },
  {
    id: 9,
    text: "What skill do you wish more people would pay you for?",
    category: "Skills+Career",
    placeholder: "e.g., design, writing..."
  }
]

const QuestionForm = ({ onSubmit }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [currentAnswer, setCurrentAnswer] = useState("")

  const handleNext = () => {
    if (currentAnswer.trim()) {
      setAnswers(prev => ({ ...prev, [currentQuestion]: currentAnswer }))
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
        setCurrentAnswer("")
      } else {
        onSubmit(answers)
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
      setCurrentAnswer(answers[currentQuestion - 1] || "")
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="h-2 bg-gray-200 rounded-full">
          <motion.div
            className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-right text-sm text-gray-600 mt-2">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg p-6 shadow-lg"
        >
          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4"
                style={{ 
                  backgroundColor: questions[currentQuestion].category.includes('Passion') ? 'rgba(244,114,182,0.1)' : 
                                 questions[currentQuestion].category.includes('Skills') ? 'rgba(96,165,250,0.1)' :
                                 questions[currentQuestion].category.includes('Impact') ? 'rgba(74,222,128,0.1)' :
                                 'rgba(168,85,247,0.1)',
                  color: questions[currentQuestion].category.includes('Passion') ? 'rgb(219,39,119)' :
                         questions[currentQuestion].category.includes('Skills') ? 'rgb(29,78,216)' :
                         questions[currentQuestion].category.includes('Impact') ? 'rgb(21,128,61)' :
                         'rgb(107,33,168)'
                }}>
            {questions[currentQuestion].category}
          </span>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {questions[currentQuestion].text}
          </h2>

          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder={questions[currentQuestion].placeholder}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows={4}
            maxLength={200}
          />
          
          <div className="flex justify-between mt-6">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`px-6 py-2 rounded-full ${
                currentQuestion === 0
                  ? 'bg-gray-100 text-gray-400'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Previous
            </button>
            
            <button
              onClick={handleNext}
              disabled={!currentAnswer.trim()}
              className={`px-6 py-2 rounded-full ${
                currentAnswer.trim()
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default QuestionForm