import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Code, Globe, Laptop, Users } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "@/components/navbar"
import { useAuth } from "@/contexts/AuthContext"
import { redirect } from "react-router-dom"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"


export default function LandingPage(){
    const auth = useAuth() 
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
     

    useEffect(() => {
        if (auth.user){ 
            location.href = '/dashboard'
            setIsLoading(false)
        } 
        else{ 
            setIsLoading(false)
        }

    }, [])
 

    if (isLoading){ 
        return ( 
            <Skeleton />
        )
    }   

    else{
        return (
            <div className="flex flex-col min-h-screen">
              <Navbar isTransparent = {true} />
                <main className="flex-1">
                    <section className="relative w-full h-screen flex flex-col items-center justify-center">
                        <img src = "/tup_background.gif" className="absolute inset-0 object-fill w-full h-full z-0" />
                        <div className="absolute inset-0 bg-black opacity-50"></div>

                        <div className="container px-4 md:px-6 z-10">
                            <div className="flex flex-col items-center space-y-4 text-center">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                                        Learn to Code with UCode
                                    </h1>
                                    <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                                        A Web-Based Training Course to Enhance ICT Students' Coding Comprehension in Basic Programming Language.
                                    </p>
                                </div>
                                <div className="space-x-4">
                                    <Button className="bg-white text-black hover:bg-gray-200">Get Started</Button>
                                    <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                                        Explore Courses
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
                        <div className="container px-4 md:px-6">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Why Choose UCode?</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <Card>
                                    <CardHeader>
                                        <Laptop className="w-8 h-8 mb-2" />
                                        <CardTitle>Interactive Lessons</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p>Learn by doing with our hands-on, interactive coding exercises and projects.</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <Users className="w-8 h-8 mb-2" />
                                        <CardTitle>Community Support</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p>Join a vibrant community of learners and mentors to accelerate your growth.</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <Globe className="w-8 h-8 mb-2" />
                                        <CardTitle>Diverse Curriculum</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p>Explore a wide range of programming languages and technologies.</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </section>
                    <section className="w-full py-12 md:py-24 lg:py-32">
                        <div className="container px-4 md:px-6">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Popular Courses</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {["HTML & CSS", "JavaScript", "Python", "React", "Node.js", "Data Structures & Algorithms"].map((course) => (
                                    <Card key={course}>
                                        <CardHeader>
                                            <Code className="w-8 h-8 mb-2" />
                                            <CardTitle>{course}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p>Master {course} with our comprehensive curriculum and hands-on projects.</p>
                                            <Button className="mt-4" variant="outline">
                                                Start Learning
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>
                    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
                        <div className="container px-4 md:px-6">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">What Our Students Say</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[
                                    {
                                        name: "Alex Johnson",
                                        role: "Web Developer",
                                        content: "UCode helped me transition from a non-tech background to a full-time web developer role in just 6 months!"
                                    },
                                    {
                                        name: "Samantha Lee",
                                        role: "Software Engineer",
                                        content: "The project-based learning approach at UCode gave me the practical skills I needed to excel in my software engineering career."
                                    },
                                    {
                                        name: "Michael Chen",
                                        role: "Data Scientist",
                                        content: "Thanks to UCode's data science track, I was able to land my dream job as a data scientist at a top tech company."
                                    }
                                ].map((testimonial, index) => (
                                    <Card key={index}>
                                        <CardHeader>
                                            <CardTitle>{testimonial.name}</CardTitle>
                                            <p className="text-sm text-gray-500">{testimonial.role}</p>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="italic">"{testimonial.content}"</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </section>
                    <section className="w-full py-12 md:py-24 lg:py-32 bg-black text-white">
                        <div className="container px-4 md:px-6">
                            <div className="flex flex-col items-center space-y-4 text-center">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                        Ready to Start Your Coding Journey?
                                    </h2>
                                    <p className="mx-auto max-w-[600px] text-gray-300 md:text-xl">
                                        Join thousands of students who have transformed their careers with UCode.
                                    </p>
                                </div>
                                <div className="w-full max-w-sm space-y-2">
                                    <form className="flex space-x-2">
                                        <Input
                                            className="max-w-lg flex-1 bg-white text-black"
                                            placeholder="Enter your email"
                                            type="email"
                                        />
                                        <Button className="bg-white text-black hover:bg-gray-200" type="submit">
                                            Get Started
                                        </Button>
                                    </form>
                                    <p className="text-xs text-gray-400">
                                        By signing up, you agree to our Terms of Service and Privacy Policy.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
                <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                    <p className="text-xs text-gray-500">© 2024 UCode. All rights reserved.</p>
                    <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                        <Link className="text-xs hover:underline underline-offset-4" to="/terms">
                            Terms of Service
                        </Link>
                        <Link className="text-xs hover:underline underline-offset-4" to="/privacy">
                            Privacy
                        </Link>
                        <Link className="text-xs hover:underline underline-offset-4" to="/careers">
                            Careers
                        </Link>
                    </nav>
                </footer>
            </div>
        )

    }


 
}