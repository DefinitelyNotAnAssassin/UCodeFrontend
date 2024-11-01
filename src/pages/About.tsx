'use client'

import { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Cpu, Globe, Users, Zap } from "lucide-react"
import Navbar from '@/components/navbar'

const MotionCard = motion(Card)

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const AnimatedSection = ({ children, className = '' }) => {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={staggerChildren}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <motion.h1 
          className="text-5xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About UCode
        </motion.h1>

        <AnimatedSection className="mb-16">
          <MotionCard variants={fadeInUp} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-3xl font-bold flex items-center">
                <Code className="mr-2" /> Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl">
                To empower individuals with the knowledge and skills to thrive in the digital age through accessible, high-quality coding education.
              </p>
            </CardContent>
          </MotionCard>
        </AnimatedSection>

        <AnimatedSection className="mb-16">
          <MotionCard variants={fadeInUp} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-3xl font-bold flex items-center">
                <Globe className="mr-2" /> Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl">
                A world where technology literacy is universal, and everyone has the opportunity to contribute to and shape the digital future.
              </p>
            </CardContent>
          </MotionCard>
        </AnimatedSection>

        <AnimatedSection className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <MotionCard variants={fadeInUp} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center">
                <Zap className="mr-2" /> Innovation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Constantly updating our curriculum to reflect the latest technologies and industry trends.
              </p>
            </CardContent>
          </MotionCard>
          <MotionCard variants={fadeInUp} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center">
                <Users className="mr-2" /> Community
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Fostering a supportive and collaborative learning environment for students worldwide.
              </p>
            </CardContent>
          </MotionCard>
        </AnimatedSection>

        <AnimatedSection className="mb-16">
          <MotionCard variants={fadeInUp} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-3xl font-bold flex items-center">
                <Cpu className="mr-2" /> Our Technology Stack
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'MongoDB', 'GraphQL', 'Docker', 'AWS'].map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-lg py-1 px-3">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </MotionCard>
        </AnimatedSection>

        <AnimatedSection>
          <MotionCard variants={fadeInUp} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Join Us in Shaping the Future</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl mb-4">
                At UCode, we're not just teaching code; we're building a community of innovators, problem-solvers, and digital creators. Whether you're taking your first steps in programming or advancing your tech career, UCode is here to guide you every step of the way.
              </p>
              <p className="text-xl">
                Ready to start your coding journey? Join UCode today and be part of the next generation of tech leaders!
              </p>
            </CardContent>
          </MotionCard>
        </AnimatedSection>
      </div>
    </div>
  )
}