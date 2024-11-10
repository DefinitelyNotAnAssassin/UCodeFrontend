'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getCourse, setCourse, getAllCourses } from '@/serviceworker/indexedDb'
import { Wifi, WifiOff } from 'lucide-react'

interface Course {
  id: number;
  title: string;
  content: string;
  lastUpdated: number;
}

export default function OfflineCourseViewer() {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    loadCourses()

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const loadCourses = async () => {
    const localCourses = await getAllCourses()
    setCourses(localCourses)
  }

  const fetchCourse = async (id: number) => {
    try {
      const response = await fetch(`/api/courses/${id}`)
      if (!response.ok) throw new Error('Failed to fetch course')
      const course = await response.json()
      await setCourse(id, { ...course, lastUpdated: Date.now() })
      setSelectedCourse(course)
    } catch (error) {
      console.error('Error fetching course:', error)
      const localCourse = await getCourse(id)
      if (localCourse) setSelectedCourse(localCourse)
      else alert('Failed to load course. Please try again when online.')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">UCode Offline Courses</h1>
      <div className="flex items-center mb-4">
        {isOnline ? (
          <Wifi className="text-green-500 mr-2" />
        ) : (
          <WifiOff className="text-red-500 mr-2" />
        )}
        <span>{isOnline ? 'Online' : 'Offline'}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Available Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {courses.map((course) => (
                <Button
                  key={course.id}
                  onClick={() => fetchCourse(course.id)}
                  className="w-full mb-2 justify-start"
                  variant="outline"
                >
                  {course.title}
                </Button>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{selectedCourse ? selectedCourse.title : 'Select a Course'}</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedCourse ? (
              <div>
                <div dangerouslySetInnerHTML={{ __html: selectedCourse.content }} />
                <p className="text-sm text-gray-500 mt-4">
                  Last updated: {new Date(selectedCourse.lastUpdated).toLocaleString()}
                </p>
              </div>
            ) : (
              <p>Please select a course from the list to view its content.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}