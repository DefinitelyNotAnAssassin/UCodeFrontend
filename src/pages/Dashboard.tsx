'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BookOpen, Code, GraduationCap, Calendar, School, User, Briefcase, Languages, FileText } from "lucide-react"
import Navbar from '@/components/navbar'
import { useAuth } from '@/contexts/AuthContext'
import { BASE_URL } from '@/utils/UrlConstant'
import axios from 'axios'
import { Link } from 'react-router-dom'

const recentActivity = [
    { id: 1, action: "Completed lesson", course: "Web Development Fundamentals", topic: "CSS Flexbox" },
    { id: 2, action: "Started new course", course: "Python for Data Science" },
    { id: 3, action: "Submitted assignment", course: "Mobile App Development", topic: "Navigation" },
]

const MotionCard = motion(Card)

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export default function StudentDashboard() {
    const [progress, setProgress] = useState(0)
    const [enrolledCourses, setEnrolledCourses] = useState([]) 

    const [user, setUser] = useState({
        id: '',
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        date_of_birth: '',
        institution: '',
        course: '',
        year_level: '',
        programming_experience: '',
        preferred_languages: [],
        expectations: ''
    })
    const auth = useAuth()

    useEffect(() => {
        const fetchCourses = async () => {
            const res = await axios.get(`${BASE_URL}/API/userCourses`)
            setEnrolledCourses(res.data)
        }
        fetchCourses()
    }, [])
   
    useEffect(() => {
        if (auth.user) {
            console.log(auth.user)
            setUser({
                id: auth.user.id,
                username: auth.user.username,
                first_name: auth.user.first_name,
                last_name: auth.user.last_name,
                email: auth.user.email,
                date_of_birth: auth.user.date_of_birth,
                institution: auth.user.institution,
                course: auth.user.course,
                year_level: auth.user.year_level,
                programming_experience: auth.user.programming_experience,
                preferred_languages: auth.user.preferred_languages,
                expectations: auth.user.expectations
            })
        }
    }, [auth.user])


    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <motion.h1 
                    className="text-3xl font-bold mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Welcome back {user.last_name}, {user.first_name}!
                </motion.h1>

                <div className="flex mb-6">
                
                    <MotionCard variants={fadeInUp} initial="hidden" className = "w-full" animate="visible">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{enrolledCourses.length}</div>
                        </CardContent>
                    </MotionCard>
                   
                </div>

                <div className="flex gap-6">
                    <MotionCard variants={fadeInUp} initial="hidden" animate="visible" className="w-full">
                        <CardHeader>
                            <CardTitle>Your Courses</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[300px]">
                               
                              
                                {enrolledCourses.map((course,index) => (
                                    <Link key={course.id + index} to={`courses/${course.id}`}>
                                         <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: course.id * 0.1 }}
                                        className="mb-4 rounded p-2 hover:bg-gray-50 cursor-pointer"
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <div>
                                                <h3 className="font-semibold">{course.title}</h3>
                                                <p className="text-sm text-muted-foreground">{course.category}</p>
                                            </div>
                                      
                                        </div>
                                   
                                       </motion.div>
                                    </Link>
                                   
                                ))}
                            </ScrollArea>
                        </CardContent>
                    </MotionCard>

                 
                </div>

                <MotionCard variants={fadeInUp} initial="hidden" animate="visible" className="mt-6">
                    <CardHeader>
                        <CardTitle>Your Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="personal" className="w-full">
                            <TabsList>
                                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                                <TabsTrigger value="academic">Academic Info</TabsTrigger>
                                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                            </TabsList>
                            <>
                                <TabsContent value="personal">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <div className="flex items-center space-x-4 mb-4">
                                            <Avatar className="w-20 h-20">
                                                <AvatarImage src="/avatars/01.png" alt={user.username} />
                                                <AvatarFallback>{user.first_name}{user.last_name}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h2 className="text-2xl font-bold">{user.first_name} {user.last_name}</h2>
                                                <p className="text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center">
                                                <Calendar className="mr-2" />
                                                <span>Born: {user.date_of_birth}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <User className="mr-2" />
                                                <span>Username: {user.username}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </TabsContent>
                                <TabsContent value="academic">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center">
                                                <School className="mr-2" />
                                                <span>Institution: {user.institution}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <BookOpen className="mr-2" />
                                                <span>Course: {user.course}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <GraduationCap className="mr-2" />
                                                <span>Year Level: {user.year_level}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Briefcase className="mr-2" />
                                                <span>Experience: {user.programming_experience}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </TabsContent>
                                <TabsContent value="preferences">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <div className="mb-4">
                                            <h3 className="font-semibold mb-2">Preferred Languages:</h3>
                                            <div className="flex flex-wrap gap-2"></div>
                                                {user.preferred_languages.map((lang, index) => (
                                                    <Badge key={lang + index} variant="secondary">
                                                        <Languages className="mr-1 h-3 w-3" />
                                                        {lang}
                                                    </Badge>
                                                ))}
                                            </div>
                                   
                                        <div>
                                            <h3 className="font-semibold mb-2">Expectations:</h3>
                                            <p className="text-muted-foreground">{user.expectations}</p>
                                        </div>
                                    </motion.div>
                                </TabsContent>
                            </>
                        </Tabs>
                    </CardContent>
                </MotionCard>
            </div>
        </div>
    )
}
