import { useState } from 'react'

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
  const [currentAnswer, setCurrentAnswer] = useState('')

  return(
    <div className="">
      <h2>{questions[currentQuestion].text}</h2>
      <p>Category: {questions[currentQuestion].category}</p>
      <textarea 
      value={currentAnswer}
      onChange={(e)=> setCurrentAnswer(e.target.value)}
      placeholder={questions[currentQuestion].placeholder}/>
    </div>
  )
}

export default QuestionForm