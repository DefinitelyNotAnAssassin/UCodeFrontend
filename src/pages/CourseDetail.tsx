'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Clock, BarChart, Code, CheckCircle2 } from "lucide-react"
import Navbar from '@/components/navbar'
import axios from 'axios'
import { BASE_URL } from '@/utils/UrlConstant'
import { useToast } from '@/hooks/use-toast'
import { useNavigate } from 'react-router-dom'

const MotionCard = motion(Card)

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const initialCourseData = {
    id: '',
    title: '',
    score: { 
        total_score: 0,
        total_possible_score: 0
    },
    category: '',
    duration: '',
    level: '',
    enrolledUsers: '',
    completed: false,
    topics: [
        {
            id: '',
            name: '',
            subtopics: [
                {
                    id: '',
                    name: '',
                    examples: [],
                    activities: [
                        {
                            id: '',
                            question: '',
                            options: ['', '', '', ''],
                            correctAnswer: '',
                            submission: false
                        }
                    ]
                }
            ]
        }
    ]
}

export default function CourseDetailPage() {
    const [course, setCourse] = useState(initialCourseData)
    const [selectedExample, setSelectedExample] = useState(null)
    const [selectedActivity, setSelectedActivity] = useState(null)
    const [userAnswers, setUserAnswers] = useState({})
    const [score, setScore] = useState(0)

    const { toast } = useToast()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCourse = async () => {
            const id = window.location.pathname.split('/').pop()
            try {
                const response = await axios.get(`${BASE_URL}/API/courses/${id}`)
                setCourse(response.data)
            } catch (error) {
                console.error("Error fetching course data:", error)
               
            }
        }

        fetchCourse()
    }, [toast])

    const handleActivityRedirect = (activityId) => {
        navigate(`/activity/${activityId}`)
    }

    const isSubtopicCompleted = (subtopic) => {
        console.log(subtopic.activities)
        return subtopic.activities.every(activity => activity.submission !== false)
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    className="text-3xl font-bold mb-6 flex justify-between"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {course.title}
                    {course.completed && (
                  
                  <Button onClick={() => navigate(`/certificates/${course.id}`)}>
                      Generate Certificate
                  </Button>
          
          )}

                </motion.div>

              

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <MotionCard variants={fadeInUp} initial="hidden" animate="visible">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Duration</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{course.duration}</div>
                        </CardContent>
                    </MotionCard>
                    <MotionCard variants={fadeInUp} initial="hidden" animate="visible">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Level</CardTitle>
                            <BarChart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{course.level}</div>
                        </CardContent>
                    </MotionCard>
                    <MotionCard variants={fadeInUp} initial="hidden" animate="visible">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Score</CardTitle>
                            <BarChart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{course.score.total_score}/{course.score.total_possible_score}</div>
                        </CardContent>
                    </MotionCard>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <MotionCard variants={fadeInUp} initial="hidden" animate="visible" className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Course Content</CardTitle>
                            <CardDescription>Track your progress and complete activities</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[500px] pr-4">
                                <Accordion type="single" collapsible className="w-full">
                                    {course.topics.map((topic) => (
                                        <AccordionItem value={`topic-${topic.id}`} key={topic.id}>
                                            <AccordionTrigger>
                                                <div className="flex items-center justify-between w-full">
                                                    <span>{topic.name}</span>
                                                    <div className="flex items-center">
                                                        <Progress value={topic.subtopics.filter(s => isSubtopicCompleted(s)).length / topic.subtopics.length * 100} className="w-[100px] mr-2" />
                                                        <span className="text-sm text-muted-foreground">
                                                            {topic.subtopics.filter(s => isSubtopicCompleted(s)).length}/{topic.subtopics.length}
                                                        </span>
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                {topic.subtopics.map((subtopic) => (
                                                    <div key={subtopic.id} className="mb-4 pl-4 border-l-2 border-gray-200">
                                                        <div className="flex items-center mb-2">
                                                            <Checkbox id={`subtopic-${subtopic.id}`} checked={isSubtopicCompleted(subtopic)} />
                                                            <Label htmlFor={`subtopic-${subtopic.id}`} className="ml-2 font-semibold">
                                                                {subtopic.name}
                                                            </Label>
                                                        </div>
                                                        <div className="space-y-2">
                                                            {subtopic.examples.map((example) => (
                                                                <Button
                                                                    key={example.id}
                                                                    variant="ghost"
                                                                    className="w-full justify-start text-left"
                                                                    onClick={() => {
                                                                        setSelectedExample(example)
                                                                        setSelectedActivity(null)
                                                                    }}
                                                                >
                                                                    <Code className="mr-2 h-4 w-4" />
                                                                    {example.description}
                                                                </Button>
                                                            ))}
                                                            {subtopic.activities && subtopic.activities.map((activity, index) => (
                                                                <Button
                                                                    key={activity.id}
                                                                    variant="ghost"
                                                                    className="w-full justify-start text-left"
                                                                    onClick={() => handleActivityRedirect(activity.id)}
                                                                    disabled={activity.submission}
                                                                >
                                                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                                                    Activity {index + 1} {activity.submission && "(Completed)"}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </ScrollArea>
                        </CardContent>
                    </MotionCard>

                    <MotionCard variants={fadeInUp} initial="hidden" animate="visible">
                        <CardHeader>
                            <CardTitle>Learning Area</CardTitle>
                            <CardDescription>View examples and complete activities</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AnimatePresence mode="wait">
                                {selectedExample && (
                                    <motion.div
                                        key={`example-${selectedExample.id}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <h3 className="font-semibold mb-2">{selectedExample.description}</h3>
                                        <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                                            <code>{selectedExample.code}</code>
                                        </pre>
                                        <Button className="mt-4">
                                            <Code className="mr-2 h-4 w-4" />
                                            Try it Yourself
                                        </Button>
                                    </motion.div>
                                )}
                                {!selectedExample && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <p className="text-muted-foreground">Select an example from the course content to begin learning.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </CardContent>
                    </MotionCard>
                </div>

      
            </div>
        </div>
    )
}