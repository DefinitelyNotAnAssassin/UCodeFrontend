'use client'

import { useState } from 'react'
import { BookOpen, Menu } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from '@/contexts/AuthContext'

const links = [ 
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'Resources', path: '/resources' },
    { name: 'Community', path: '/community' },
]

const authLinks = [ 
    { name: 'Dashboard', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'Resources', path: '/resources' },
    { name: 'Games', path: '/games' },  
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Sign Out', path: '/logout' }   
]

export default function Navbar({ isTransparent = false }) {
    const [isOpen, setIsOpen] = useState(false)
    const auth = useAuth() 

    const userLinks = auth.user ? authLinks : links

    return (
        <header className={`px-4 lg:px-6 h-16 flex items-center justify-between ${isTransparent ? 'bg-transparent z-50 absolute w-full text-white' : 'bg-white shadow-md'}`}>
            <Link className="flex items-center justify-center" to="/">
                <BookOpen className="h-6 w-6 mr-2" />
                <span className="font-bold">UCode</span>
            </Link>
            <div className="hidden md:flex items-center space-x-4">
                <nav className="flex gap-4 sm:gap-6">
                    {userLinks.map((link) => (
                        <Link key={link.name} to={link.path} className="text-sm font-medium hover:underline underline-offset-4">
                            {link.name}
                        </Link>
                    ))}
                </nav>
                {!auth.user && (
                    <div className="flex items-center space-x-4 px-4">
                        <Link to="/sign_in" className="text-sm font-medium hover:underline underline-offset-4">Sign In</Link> 
                        <Link to="/sign_up" className="text-sm font-medium hover:underline underline-offset-4 bg-black rounded text-white p-2">Sign Up</Link> 
                    </div>
                )}
            </div>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right">
                    <nav className="flex flex-col gap-4">
                        {userLinks.map((link) => (
                            <Link key={link.name} to={link.path} className="text-sm font-medium hover:underline underline-offset-4">
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                    {!auth.user && (
                        <div className="mt-4 flex flex-col gap-2">
                            <Link className="w-full text-center p-2 rounded text-sm font-semibold border border-gray-400" to="/sign_in">Sign In</Link>
                            <Link className="w-full bg-black text-white text-center p-2 rounded text-sm font-semibold" to="/sign_up">Sign Up</Link>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </header>
    )
}