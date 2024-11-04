'use client'

import { useState, useEffect} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Trash2 } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { useForm } from 'react-hook-form'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from '@/hooks/use-toast'

// Mock data and API calls
const mockCategories = ['Web Development', 'Data Science', 'Mobile Development']
const mockCourses = [
  { id: 1, title: 'Introduction to React', category: 'Web Development', duration: '8 weeks', level: 'Beginner' },
  { id: 2, title: 'Python for Data Analysis', category: 'Data Science', duration: '10 weeks', level: 'Intermediate' },
]

const createCourse = async (courseData) => {
  // Simulating API call
  console.log('Creating course:', courseData)
  return { id: mockCourses.length + 1, ...courseData }
}

const createTopic = async (topicData) => {
  // Simulating API call
  console.log('Creating topic:', topicData)
  return { id: uuidv4(), ...topicData }
}

const createSubtopic = async (subtopicData) => {
  // Simulating API call
  console.log('Creating subtopic:', subtopicData)
  return { id: uuidv4(), ...subtopicData }
}

const createActivity = async (activityData) => {
  // Simulating API call
  console.log('Creating activity:', activityData)
  return { id: uuidv4(), ...activityData }
}

const MotionCard = motion(Card)
const MotionTableRow = motion(TableRow)

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
}

export default function AdminDashboard() {
  const [courses, setCourses] = useState([
    { id: 1, title: 'Introduction to React', category: 'Web Development', duration: '8 weeks', level: 'Beginner' },
    { id: 2, title: 'Python for Data Analysis', category: 'Data Science', duration: '10 weeks', level: 'Intermediate' },
  ])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [topics, setTopics] = useState([])
  const [newCourse, setNewCourse] = useState({ title: '', category: '', duration: '', level: '' })
  const [newTopic, setNewTopic] = useState({ name: '' })
  const [newSubtopic, setNewSubtopic] = useState({ name: '' })
  const [newActivity, setNewActivity] = useState({
    timeLimit: 0,
    quizType: 'multiple_choice',
    questions: []
  })
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    points: 1
  })
  const [unsavedChanges, setUnsavedChanges] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      category: '',
      duration: '',
      level: ''
    }
  })

  const { toast } = useToast()

  const onSubmit = async (data) => {
    try {
      const course = await createCourse(data)
      setCourses([...courses, course])
      reset()
      toast({
        title: "Course created",
        description: "The new course has been successfully added.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create the course. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCreateCourse = async (data) => {
    
  }

  const handleCreateTopic = async () => {
    if (!selectedCourse) return
    const topic = await createTopic({ ...newTopic, courseId: selectedCourse.id })
    setTopics([...topics, topic])
    setNewTopic({ name: '' })
    setUnsavedChanges(true)
  }

  const handleCreateSubtopic = async (topicId) => {
    if (!selectedCourse) {
      toast({
        title: "Error",
        description: "Please select a course first.",
        variant: "destructive",
      })
      return
    }
    const subtopic = await createSubtopic({ ...newSubtopic, topicId, courseId: selectedCourse.id })
    const updatedTopics = topics.map(topic =>
      topic.id === topicId
        ? { ...topic, subtopics: [...(topic.subtopics || []), subtopic] }
        : topic
    )
    setTopics(updatedTopics)
    setNewSubtopic({ name: '' })
    setUnsavedChanges(true)
  }

  const handleCreateActivity = async (subtopicId) => {
    const activity = await createActivity({ ...newActivity, subtopicId })
    const updatedTopics = topics.map(topic => ({
      ...topic,
      subtopics: topic.subtopics?.map(subtopic =>
        subtopic.id === subtopicId
          ? { ...subtopic, activities: [...(subtopic.activities || []), activity] }
          : subtopic
      )
    }))
    setTopics(updatedTopics)
    setNewActivity({ timeLimit: 0, quizType: 'multiple_choice', questions: [] })
    setUnsavedChanges(true)
  }

  const handleAddQuestion = () => {
    setNewActivity(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }))
    setNewQuestion({
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 1
    })
    setUnsavedChanges(true)
  }

  const handleSaveChanges = async () => {
    try {
      console.log('Saving changes...')
      console.log(newTopic, newSubtopic, newActivity)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setUnsavedChanges(false)
      toast({
        title: "Changes saved",
        description: "All changes have been successfully saved to the database.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (unsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [unsavedChanges])

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs defaultValue="courses">
        <TabsList className="mb-4">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="content">Course Content</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <MotionCard
            {...fadeInUp}
          >
            <CardHeader>
              <CardTitle>Create New Course</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Course Title</Label>
                    <Input
                      id="title"
                      {...register("title", { required: "Title is required" })}
                    />
                    {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={(value) => register("category").onChange({ target: { value } })}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCategories.map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      {...register("duration", { required: "Duration is required" })}
                    />
                    {errors.duration && <p className="text-sm text-red-500">{errors.duration.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="level">Level</Label>
                    <Input
                      id="level"
                      {...register("level", { required: "Level is required" })}
                    />
                    {errors.level && <p className="text-sm text-red-500">{errors.level.message}</p>}
                  </div>
                </div>
                <Button type="submit">Create Course</Button>
              </form>
            </CardContent>
          </MotionCard>

          <MotionCard
            className="mt-8"
            {...fadeInUp}
          >
            <CardHeader>
              <CardTitle>Existing Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {courses.map((course) => (
                        <MotionTableRow key={course.id} {...fadeInUp}>
                          <TableCell>{course.title}</TableCell>
                          <TableCell>{course.category}</TableCell>
                          <TableCell>{course.duration}</TableCell>
                          <TableCell>{course.level}</TableCell>
                          <TableCell>
                            <Button variant="outline" onClick={() => setSelectedCourse(course)}>Manage Content</Button>
                          </TableCell>
                        </MotionTableRow>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </MotionCard>
        </TabsContent>

        <AnimatePresence mode="wait">
          <TabsContent value="content">
            {selectedCourse ? (
              <MotionCard
                {...fadeInUp}
              >
                <CardHeader>
                  <CardTitle>{selectedCourse.title} - Content Management</CardTitle>
                  <CardDescription>Add topics, subtopics, and activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Label htmlFor="topicName">New Topic Name</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="topicName"
                        value={newTopic.name}
                        onChange={(e) => setNewTopic({ name: e.target.value })}
                      />
                      <Button onClick={handleCreateTopic}>Add Topic</Button>
                    </div>
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    {topics.map((topic) => (
                      <AccordionItem key={topic.id} value={topic.id}>
                        <AccordionTrigger>{topic.name}</AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-4">
                            <div className="mb-4">
                              <Label htmlFor={`subtopic-${topic.id}`}>New Subtopic Name</Label>
                              <div className="flex items-center space-x-2">
                                <Input
                                  id={`subtopic-${topic.id}`}
                                  value={newSubtopic.name}
                                  onChange={(e) => setNewSubtopic({ name: e.target.value })}
                                />
                                <Button onClick={() => handleCreateSubtopic(topic.id)}>Add Subtopic</Button>
                              </div>
                            </div>

                            {topic.subtopics?.map((subtopic) => (
                              <div key={subtopic.id} className="mb-4">
                                <h4 className="font-semibold">{subtopic.name}</h4>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <Plus className="mr-2 h-4 w-4" />
                                      Add Activity
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle>Create New Activity</DialogTitle>
                                      <DialogDescription>
                                        Add a new activity for the subtopic: {subtopic.name}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label htmlFor="timeLimit">Time Limit (seconds)</Label>
                                          <Input
                                            id="timeLimit"
                                            type="number"
                                            value={newActivity.timeLimit}
                                            onChange={(e) => setNewActivity({ ...newActivity, timeLimit: parseInt(e.target.value) })}
                                          />
                                        </div>
                                        <div>
                                          <Label htmlFor="quizType">Quiz Type</Label>
                                          <Select
                                            value={newActivity.quizType}
                                            onValueChange={(value) => setNewActivity({ ...newActivity, quizType: value })}
                                          >
                                            <SelectTrigger id="quizType">
                                              <SelectValue placeholder="Select quiz type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                                              <SelectItem value="true_false">True/False</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                      <div>
                                        <Label>Questions</Label>
                                        <ScrollArea className="h-[200px] border rounded p-2">
                                          {newActivity.questions.map((question, index) => (
                                            <div key={index} className="mb-2 p-2 border rounded">
                                              <p><strong>Question {index + 1}:</strong> {question.text}</p>
                                              <p><strong>Options:</strong> {question.options.join(', ')}</p>
                                              <p><strong>Correct Answer:</strong> Option {question.correctAnswer + 1}</p>
                                              <p><strong>Points:</strong> {question.points}</p>
                                            </div>
                                          ))}
                                        </ScrollArea>
                                      </div>
                                      <Accordion type="single" collapsible>
                                        <AccordionItem value="add-question">
                                          <AccordionTrigger>Add New Question</AccordionTrigger>
                                          <AccordionContent>
                                            <div className="space-y-2">
                                              <Input
                                                placeholder="Question Text"
                                                value={newQuestion.text}
                                                onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                                              />
                                              {newQuestion.options.map((option, index) => (
                                                <Input
                                                  key={index}
                                                  placeholder={`Option ${index + 1}`}
                                                  value={option}
                                                  onChange={(e) => {
                                                    const newOptions = [...newQuestion.options]
                                                    newOptions[index] = e.target.value
                                                    setNewQuestion({ ...newQuestion, options: newOptions })
                                                  }}
                                                />
                                              ))}
                                              <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                  <Label htmlFor="correctAnswer">Correct Answer (0-3)</Label>
                                                  <Input
                                                    id="correctAnswer"
                                                    type="number"
                                                    min="0"
                                                    max="3"
                                                    value={newQuestion.correctAnswer}
                                                    onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: parseInt(e.target.value) })}
                                                  />
                                                </div>
                                                <div>
                                                  <Label htmlFor="points">Points</Label>
                                                  <Input
                                                    id="points"
                                                    type="number"
                                                    min="1"
                                                    value={newQuestion.points}
                                                    onChange={(e) => setNewQuestion({ ...newQuestion, points: parseInt(e.target.value) })}
                                                  />
                                                </div>
                                              </div>
                                              <Button onClick={handleAddQuestion}>Add Question</Button>
                                            </div>
                                          </AccordionContent>
                                        </AccordionItem>
                                      </Accordion>
                                    </div>
                                    <Button onClick={() => handleCreateActivity(subtopic.id)}>Create Activity</Button>
                                  </DialogContent>
                                </Dialog>
                                {subtopic.activities?.map((activity) => (
                                  <div key={activity.id} className="ml-4 mt-2">
                                    <span>Activity: {activity.quizType} - {activity.questions.length} questions</span>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  {unsavedChanges && (
                    <div className="mt-4 flex justify-end">
                      <Button onClick={handleSaveChanges}>
                        Save Changes
                      </Button>
                    </div>
                  )}
                </CardContent>
              </MotionCard>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p>Please select a course from the Courses tab to manage its content.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  )
}