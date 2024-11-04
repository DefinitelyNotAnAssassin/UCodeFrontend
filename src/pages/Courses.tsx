'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Code, BookOpen, Database, Globe, Server, Smartphone } from "lucide-react"
import Navbar from '@/components/navbar'
import { BASE_URL } from '@/utils/UrlConstant'
import axios from 'axios'
import { useToast } from '@/hooks/use-toast'

const categories = [
  { name: 'All', icon: BookOpen },
  { name: 'Web Development', icon: Globe },
  { name: 'Mobile Development', icon: Smartphone },
  { name: 'Database', icon: Database },
  { name: 'Backend', icon: Server },
  { name: 'Programming Fundamentals', icon: Code },
]

export default function CoursesPage() {
  const [allCourses, setAllCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await axios.get(`${BASE_URL}/API/courses`)
      const data = res.data
      setAllCourses(data)
      setFilteredCourses(data)
      console.log(data)
    }
    fetchCourses()
  }, [])

  useEffect(() => {
    const filterCourses = () => {
      let filtered = allCourses

      if (selectedCategory !== 'All') {
        filtered = filtered.filter(course => course.category === selectedCategory)
      }

      if (searchTerm) {
        filtered = filtered.filter(course => 
          course.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      setFilteredCourses(filtered)
    }

    filterCourses()
  }, [selectedCategory, searchTerm, allCourses])

  const handleSubmit = (e, id) => {

    axios.post(`${BASE_URL}/API/enroll`, {
      course_id: id
    })
    .then((response) => {
      toast({ title: "Success", description: response.data.message, variant: "success" })
    })

  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">UCode Courses</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Enhance your ICT skills with our web-based training courses. UCode is designed to improve coding comprehension in various programming languages for ICT students.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Select onValueChange={(value) => setSelectedCategory(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    <div className="flex items-center">
                      <category.icon className="mr-2 h-4 w-4" />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input
            type="search"
            placeholder="Search courses..."
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <AnimatePresence>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            layout
          >
            {filteredCourses.map((course) => (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>{course.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p><strong>Duration:</strong> {course.duration}</p>
                    <p><strong>Level:</strong> {course.level}</p>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    
                    <Button className="w-full" onClick={() => handleSubmit(this, course.id)} disabled = {course.enrolled == true}>{course.enrolled == true ? "Enrolled" : "Enroll Now"}</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredCourses.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No courses found. Try adjusting your search or filter.</p>
        )}
      </div>
    </div>
  )
}