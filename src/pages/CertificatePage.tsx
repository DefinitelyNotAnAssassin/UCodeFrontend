'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Download, FileImage } from 'lucide-react'
import axios from 'axios'
import { BASE_URL } from '@/utils/UrlConstant'

export default function CertificatePage() {
  const [exportFormat, setExportFormat] = useState<'png' | 'jpg' | 'pdf'>('png')
  const certificateRef = useRef<HTMLDivElement>(null)
  const { id } = useParams()

  const [userData, setUserData] = useState({
    name: '',
    id: ''
  })

  const [courseData, setCourseData] = useState({
    title: '',
    completionDate: ''
  })

  useEffect(() => { 
    const checkEligibity = async () => { 
        try{ 
            const response = await axios.get(`${BASE_URL}/API/checkEligibity/${id}`)
                if (response.data.isEligible){ 
                    console.log('Eligible')
                }
                else{ 
                    // go back to the previous page 
                    window.history.back()
                }
        }
        catch(err){ 
            console.log(err)
        }

    }

  }, [])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/API/users`) // Adjust the endpoint as needed
        setUserData({
          name: response.data.last_name + ', ' + response.data.first_name,
          id: response.data.id
        })
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    const fetchCourseData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/API/checkEligibity/${id}`)
        setCourseData({
          title: response.data.title,
          completionDate: new Date().toISOString().split('T')[0] // Use actual completion date if available
        })
      } catch (error) {
        console.error('Error fetching course data:', error)
      }
    }

    fetchUserData()
    fetchCourseData()
  }, [id])

  const handleExport = async () => {
    if (!certificateRef.current) return

    try {
      const canvas = await html2canvas(certificateRef.current, { scale: 2 })

      if (exportFormat === 'pdf') {
        const pdf = new jsPDF('landscape', 'mm', 'a4')
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 297, 210)
        pdf.save(`${userData.name}_certificate.pdf`)
      } else {
        const link = document.createElement('a')
        link.download = `${userData.name}_certificate.${exportFormat}`
        link.href = canvas.toDataURL(`image/${exportFormat}`)
        link.click()
      }
    } catch (error) {
      console.error('Error exporting certificate:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Certificate of Completion</h1>

      <Card className="mb-6">
        <CardContent className="p-6">
          <motion.div
            ref={certificateRef}
            className="bg-white p-8 rounded-lg shadow-lg text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="border-8 border-double border-red-800 p-6">
              <h2 className="text-4xl font-bold text-red-800 mb-4">Certificate of Completion</h2>
              <p className="text-xl mb-6">This is to certify that</p>
              <h3 className="text-3xl font-bold text-red-700 mb-4">{userData.name}</h3>
              <p className="text-xl mb-6">has successfully completed the course</p>
              <h4 className="text-2xl font-bold text-red-600 mb-4">{courseData.title}</h4>
              <p className="text-lg mb-8">on {new Date(courseData.completionDate).toLocaleDateString()}</p>
              <div className="flex justify-between items-center">
              
                <div>
                  <p className="font-bold">UCode</p>
                  <p>Learning Platform</p>
                </div>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <Select onValueChange={(value: 'png' | 'jpg' | 'pdf') => setExportFormat(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="png">PNG</SelectItem>
            <SelectItem value="jpg">JPG</SelectItem>
            <SelectItem value="pdf">PDF</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleExport} className="w-full sm:w-auto">
          {exportFormat === 'pdf' ? (
            <Download className="mr-2 h-4 w-4" />
          ) : (
            <FileImage className="mr-2 h-4 w-4" />
          )}
          Export as {exportFormat.toUpperCase()}
        </Button>
      </div>
    </div>
  )
}