'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Code } from "lucide-react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import Navbar from '@/components/navbar'

const topics = [
  {
    name: 'HTML',
    subtopics: ['Introduction', 'Elements', 'Attributes', 'Headings', 'Paragraphs', 'Links', 'Images', 'Lists', 'Tables', 'Forms'],
  },
  {
    name: 'CSS',
    subtopics: ['Introduction', 'Selectors', 'Colors', 'Backgrounds', 'Borders', 'Margins', 'Padding', 'Height/Width', 'Box Model', 'Flexbox'],
},
  {
    name: 'JavaScript',
    subtopics: ['Introduction', 'Variables', 'Data Types', 'Functions', 'Objects', 'Arrays', 'Loops', 'Conditionals', 'DOM Manipulation', 'Events'],
  },
  { 
    name: 'Python',
    subtopics: ['Introduction', 'Variables', 'Data Types', 'Functions', 'Modules', 'File I/O', 'Error Handling', 'Classes', 'Inheritance', 'Libraries'],
  },
  {
    name: 'C',
    subtopics: ['Introduction', 'Variables', 'Data Types', 'Functions', 'Pointers', 'Arrays', 'Structures', 'File I/O', 'Preprocessor', 'Memory Management'],
  }
]

const examples = {
  'HTML': {
    'Introduction': {
      description: 'HTML is the standard markup language for creating Web pages.',
      code: `<!DOCTYPE html>
<html>
<head>
  <title>My First HTML Page</title>
</head>
<body>
  <h1>Welcome to HTML!</h1>
  <p>This is a paragraph.</p>
</body>
</html>`,
    },
    'Elements': {
      description: 'HTML elements are the building blocks of HTML pages.',
      code: `<h1>This is a heading</h1>
<p>This is a paragraph.</p>
<a href="https://www.example.com">This is a link</a>
<img src="image.jpg" alt="An example image">`,
    },
  },
  'CSS': {
    'Introduction': {
      description: 'CSS is used to style and layout web pages.',
      code: `body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
}

h1 {
  color: #333;
  text-align: center;
}`,
    },
    'Selectors': {
      description: 'CSS selectors are used to select the HTML elements you want to style.',
      code: `/* Element Selector */
p {
  color: blue;
}

/* Class Selector */
.highlight {
  background-color: yellow;
}

/* ID Selector */
#header {
  font-size: 24px;
}`,
    },
  },
  'JavaScript': {
    'Introduction': {
      description: 'JavaScript is a programming language that can update and change both HTML and CSS.',
      code: `// This is a comment
console.log("Hello, World!");

let greeting = "Welcome to JavaScript!";
alert(greeting);`,
    },
    'Variables': {
      description: 'Variables are containers for storing data values.',
      code: `// Declaring variables
let name = "John";
const age = 30;
var isStudent = true;

console.log(name);  // Output: John
console.log(age);   // Output: 30
console.log(isStudent);  // Output: true`,
    },
  },
}

export default function ResourcesPage() {
  const [selectedTopic, setSelectedTopic] = useState('HTML')
  const [selectedSubtopic, setSelectedSubtopic] = useState('Introduction')

  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <Navbar />
      <div className="mx-auto ">
      

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <Card className="lg:col-span-1 md:min-h-screen ">
            <CardContent>
              <ScrollArea className="h-full">
                <Accordion type="multiple" className = "flex justify-around lg:flex-col">
                  {topics.map((topic) => (
                    <AccordionItem key={topic.name} value={topic.name}>
                      <AccordionTrigger>{topic.name}</AccordionTrigger>
                      <AccordionContent>
                        {topic.subtopics.map((subtopic) => (
                          <Button
                            key={subtopic}
                            variant={subtopic === selectedSubtopic && topic.name === selectedTopic ? "secondary" : "ghost"}
                            className="w-full justify-start mb-2"
                            onClick={() => {
                              setSelectedTopic(topic.name)
                              setSelectedSubtopic(subtopic)
                            }}
                          >
                            {subtopic}
                          </Button>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>{selectedSubtopic}</CardTitle>
              <CardDescription>
                {examples[selectedTopic]?.[selectedSubtopic]?.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-800 text-white p-4 rounded-md">
                <pre className="whitespace-pre-wrap">
                  <code>{examples[selectedTopic]?.[selectedSubtopic]?.code}</code>
                </pre>
              </div>
              <Button className="mt-4" onClick={() => {
                alert("This would open a live code editor in a full application.")
              }}>
                <Code className="mr-2 h-4 w-4" />
                Try it Yourself
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}