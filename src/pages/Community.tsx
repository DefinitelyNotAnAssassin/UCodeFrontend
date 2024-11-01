'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Github, Twitter, Linkedin, Youtube, Facebook, MessageCircle } from "lucide-react"
import { Link } from 'react-router-dom'
import Navbar from '@/components/navbar'

const featuredMembers = [
  { name: 'Alice Johnson', role: 'Full Stack Developer', avatar: '/avatars/alice.jpg' },
  { name: 'Bob Smith', role: 'UX Designer', avatar: '/avatars/bob.jpg' },
  { name: 'Carol Williams', role: 'Data Scientist', avatar: '/avatars/carol.jpg' },
  { name: 'David Brown', role: 'DevOps Engineer', avatar: '/avatars/david.jpg' },
]

const communities = [
  { name: 'Web Development', members: 1500, description: 'Discuss the latest in web technologies and frameworks.' },
  { name: 'Data Science', members: 1200, description: 'Share insights and techniques in data analysis and machine learning.' },
  { name: 'Mobile App Development', members: 1000, description: 'Explore mobile app development for iOS and Android.' },
  { name: 'DevOps & Cloud', members: 800, description: 'Learn about DevOps practices and cloud technologies.' },
  { name: 'UI/UX Design', members: 950, description: 'Share design tips and discuss user experience best practices.' },
]

const events = [
  { name: 'Annual CodeCon', date: '2024-06-15', description: 'Our biggest coding conference of the year.' },
  { name: 'Web Dev Workshop', date: '2024-03-22', description: 'Hands-on workshop for modern web development.' },
  { name: 'AI in Practice Webinar', date: '2024-04-10', description: 'Learn how AI is being used in real-world applications.' },
  { name: 'Hackathon 2024', date: '2024-07-01', description: '48-hour coding challenge with amazing prizes.' },
]

export default function CommunityPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">UCode Community</h1>
        
        <Tabs defaultValue="featured" className="space-y-4">
          <TabsList>
            <TabsTrigger value="featured">Featured Members</TabsTrigger>
            <TabsTrigger value="communities">Communities</TabsTrigger>
            <TabsTrigger value="events">Upcoming Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="featured">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredMembers.map((member, index) => (
                <Card key={index}>
                  <CardHeader>
                    <Avatar className="w-24 h-24 mx-auto">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription>{member.role}</CardDescription>
                  </CardContent>
                  <CardFooter className="justify-center">
                    <Button variant="outline">Connect</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="communities">
            <div className="space-y-4">
              <Input
                type="search"
                placeholder="Search communities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <ScrollArea className="h-[60vh]">
                {filteredCommunities.map((community, index) => (
                  <Card key={index} className="mb-4">
                    <CardHeader>
                      <CardTitle>{community.name}</CardTitle>
                      <CardDescription>{community.members} members</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>{community.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button>Join Community</Button>
                    </CardFooter>
                  </Card>
                ))}
              </ScrollArea>
            </div>
          </TabsContent>
          
          <TabsContent value="events">
            <div className="space-y-4">
              {events.map((event, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{event.name}</CardTitle>
                    <CardDescription>{new Date(event.date).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{event.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button>Register</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Connect with Us</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" asChild>
              <Link to="https://github.com/ucode" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" /> GitHub
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="https://twitter.com/ucode" target="_blank" rel="noopener noreferrer">
                <Twitter className="mr-2 h-4 w-4" /> Twitter
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="https://linkedin.com/company/ucode" target="_blank" rel="noopener noreferrer">
                <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="https://youtube.com/ucode" target="_blank" rel="noopener noreferrer">
                <Youtube className="mr-2 h-4 w-4" /> YouTube
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="https://facebook.com/ucode" target="_blank" rel="noopener noreferrer">
                <Facebook className="mr-2 h-4 w-4" /> Facebook
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="https://discord.gg/ucode" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" /> Discord
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}