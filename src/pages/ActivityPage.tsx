'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"
import { BASE_URL } from '@/utils/UrlConstant'
import { useToast } from '@/hooks/use-toast'
import Navbar from '@/components/navbar'

interface Question {
  id: number
  text: string
  options: string[]
  correctAnswer: number
  points: number
}

interface Activity {
  id: number
  subtopic: string
  timeLimit: number
  activityCode: string
  quizType: string
  maxScore: number
  questions: Question[]
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export default function ActivityPage() {
  const [activity, setActivity] = useState<Activity | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const activityId = window.location.pathname.split('/').pop()

  const { toast } = useToast()

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/API/activities/${activityId}`)
        const fetchedActivity = response.data

        // Calculate maxScore based on question points
        const totalPoints = fetchedActivity.questions.reduce((sum: number, question: Question) => {
          return sum + question.points
        }, 0)

        fetchedActivity.maxScore = totalPoints
        setActivity(fetchedActivity)
        setTimeLeft(fetchedActivity.timeLimit)

        // Initialize userAnswers array
        setUserAnswers(Array(fetchedActivity.questions.length).fill(null))
      } catch (error) {
        console.error("Error fetching activity data:", error)
        toast({
          title: "Error",
          description: "Failed to fetch activity data. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchActivity()
  }, [toast])

  useEffect(() => {
    if (!activity || isFinished) return

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          handleFinish()
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [activity, isFinished])

  useEffect(() => {
    if (userAnswers.length > 0) {
      setSelectedAnswer(userAnswers[currentQuestionIndex])
    }
  }, [currentQuestionIndex, userAnswers])

  const handleAnswerSelect = (answerIndex: number) => {
    const updatedAnswers = [...userAnswers]
    updatedAnswers[currentQuestionIndex] = answerIndex
    setUserAnswers(updatedAnswers)
    setSelectedAnswer(answerIndex)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < activity!.questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
      const nextAnswer = userAnswers[currentQuestionIndex + 1]
      setSelectedAnswer(nextAnswer)
    } else {
      handleFinish()
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1)
      const prevAnswer = userAnswers[currentQuestionIndex - 1]
      setSelectedAnswer(prevAnswer)
    }
  }

  const handleFinish = async () => {
    setIsSubmitting(true)
    setIsFinished(true)

    // Calculate final score
    const finalScore = activity!.questions.reduce((total, question, index) => {
      const userAnswer = userAnswers[index]
      if (userAnswer === question.correctAnswer) {
        return total + question.points
      }
      return total
    }, 0)

    try {
      await axios.post(`${BASE_URL}/API/submitActivity`, {
        activity_id: activityId,
        score: finalScore,
        timeSpent: activity!.timeLimit - timeLeft,
      })

      toast({
        title: "Activity Completed",
        description: `Your score: ${finalScore}/${activity!.maxScore}`,
        variant: "success",
      })

      window.history.back()
    } catch (error) {
      console.error("Error submitting activity result:", error)
      toast({
        title: "Error",
        description: "Failed to submit activity result. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleExitQuiz = () => {
    if (window.confirm("Are you sure you want to exit the quiz?")) {
      window.history.back()
    }
  }

  if (!activity) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const currentQuestion = activity.questions[currentQuestionIndex]

  return (

    <>
    <Navbar />
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{activity.subtopic}</CardTitle>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {activity.questions.length}
              </span>
              <span className="text-sm text-gray-500">
                Time left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <Progress value={((currentQuestionIndex + 1) / activity.questions.length) * 100} className="w-full" />
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-semibold mb-4">{currentQuestion.text}</h3>
                <RadioGroup
                  value={selectedAnswer !== null ? selectedAnswer.toString() : ''}
                  onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                >
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </motion.div>
            </AnimatePresence>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleExitQuiz}
            >
              Exit Quiz
            </Button>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0 || isSubmitting}
              >
                Previous
              </Button>
              <Button
                onClick={handleNextQuestion}
                disabled={isSubmitting}
              >
                {currentQuestionIndex === activity.questions.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
    
    </>
    
  )
}