'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Heart, Clock, Trophy, GamepadIcon } from 'lucide-react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Navbar from '@/components/navbar'
import { get } from 'http'
import axios from '@/utils/AuthAxios'
import { profile } from 'console'
import { BASE_URL } from '@/utils/UrlConstant'

// Mock data (replace with actual API call in a real application)
const gamesData = {
    "games": [
        {
            "id": 1,
            "title": "JavaScript Basics",
            "type": "multipleChoice",
            "difficulty": "Easy",
            "questions": [
                {
                    "question": "What is the correct way to declare a variable in JavaScript?",
                    "options": ["var x = 5;", "variable x = 5;", "let x = 5;", "const x = 5;"],
                    "correctAnswer": 2
                }
            ]
        },
        {
            "id": 2,
            "title": "Python Function Order",
            "type": "sortableCode",
            "difficulty": "Medium",
            "codeBlocks": [
                "    print(f'Hello, {name}!')",
                "result = greet('Alice')",
                "def greet(name):",
                "    return f'Welcome, {name}'",
                "print(result)"
            ]
        },
        {
            "id": 3,
            "title": "HTML Tag Matcher",
            "type": "tagMatcher",
            "difficulty": "Hard",
            "tags": [
                "<div>","</p>",
                "<p>","</div>",
                "<span>","</a>" ,
                "<a>","</span>"
            ]
        }
    ]
}

const LIVES_KEY = 'ucode_lives'
const REFRESH_KEY = 'ucode_refresh'

export default function GamesPage() {
    const [lives, setLives] = useState(() => {
        const savedLives = localStorage.getItem(LIVES_KEY)
        return savedLives !== null ? parseInt(savedLives, 10) : 3
    })

    const [playerProfile, setPlayerProfile] = useState({points: 0}) 
    useEffect(() => {

        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/API/getPlayerProfile`)
                setScore(response.data.points)  
            } catch (error) {
                console.error('Error fetching profile:', error)
            }
        }
        fetchProfile()
    }, [])  




    const [nextRefresh, setNextRefresh] = useState(() => {
        const savedRefresh = localStorage.getItem(REFRESH_KEY)
        if (savedRefresh == null) { 
            const newRefreshTime = Date.now() + 30 * 60 * 1000
            localStorage.setItem(REFRESH_KEY, newRefreshTime.toString())
            
            return newRefreshTime
        }
        return parseInt(savedRefresh, 10)
    })
    const [currentGame, setCurrentGame] = useState(null)
    const [gameResult, setGameResult] = useState(null)
    const [score, setScore] = useState(playerProfile.points)
    const [currentTime, setCurrentTime] = useState('')

    useEffect(() => {
        const updateCurrentTime = () => {
            const now = Date.now()
            setCurrentTime(new Date(nextRefresh - now).toISOString().substr(14, 5))
        }

        updateCurrentTime()
        const interval = setInterval(updateCurrentTime, 1000)

        return () => clearInterval(interval)
    }, [nextRefresh])

    useEffect(() => {
        const timer = setInterval(() => {
            const now = Date.now()
            if (now >= nextRefresh) {
                setLives(3)
                localStorage.setItem(LIVES_KEY, '3')
                const newRefreshTime = now + 30 * 60 * 1000
                setNextRefresh(newRefreshTime)
                localStorage.setItem(REFRESH_KEY, newRefreshTime.toString())
                
            }
           

        }, 1000)

        return () => clearInterval(timer)
    }, [nextRefresh])

    useEffect(() => {
        localStorage.setItem(LIVES_KEY, lives.toString())
    }, [lives])

    const handlePlayGame = (game) => {
        if (lives > 0) {
            setLives(lives - 1)
            setCurrentGame(game)
            setGameResult(null)
        }
        else{ 
            alert("You have no lives left wait for the next refresh")
        }
    }

    const handleGameComplete = (isCorrect) => {
        setGameResult(isCorrect)
        if (isCorrect) {
            axios.post(`${BASE_URL}/API/updatePlayerProfile`, {
                points: score + 1
            })
            setScore(score + 1)
        }
        setCurrentGame(null)
    }

    const renderGame = () => {
        switch (currentGame.type) {
            case 'multipleChoice':
                return <MultipleChoiceGame game={currentGame} onComplete={handleGameComplete} />
            case 'sortableCode':
                return <SortableCodeGame game={currentGame} onComplete={handleGameComplete} />
            case 'tagMatcher':
                return <TagMatcherGame game={currentGame} onComplete={handleGameComplete} />
            default:
                return null
        }
    }



   

    return (
    <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">UCode Games</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Heart className="mr-2" /> Lives
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{lives}</div>
                        <Progress value={(lives / 3) * 100} className="mt-2" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Clock className="mr-2" /> Next Refresh
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {currentTime}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Trophy className="mr-2" /> Score
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{score}</div>
                    </CardContent>
                </Card>
            </div>

            <div>
                {currentGame ? (
                    <motion.div
                        key="game"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderGame()}
                    </motion.div>
                ) : gameResult !== null ? (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>{gameResult ? 'Congratulations!' : 'Better luck next time!'}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{gameResult ? 'You completed the game successfully.' : 'You didn\'t complete the game successfully.'}</p>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={() => setGameResult(null)}>Back to Games</Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div
                        key="games-list"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {gamesData.games.map((game) => (
                                <GameCard key={game.id} game={game} onPlay={handlePlayGame} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    </>
    )
}

const GameCard = ({ game, onPlay }) => {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{game.title}</CardTitle>
                <CardDescription>
                    <Badge className={game.difficulty === 'Easy' ? 'bg-green-400' : game.difficulty === 'Medium' ? 'bg-yellow-400' : 'bg-red-400'}>
                        {game.difficulty}
                    </Badge>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>Type: {game.type}</p>
            </CardContent>
            <CardFooter>
                <Button onClick={() => onPlay(game)}>Play</Button>
            </CardFooter>
        </Card>
    )
}

const MultipleChoiceGame = ({ game, onComplete }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null)

    const handleSubmit = () => {
        const isCorrect = selectedAnswer === game.questions[0].correctAnswer
        onComplete(isCorrect)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{game.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-4">{game.questions[0].question}</p>
                {game.questions[0].options.map((option, index) => (
                    <Button
                        key={index}
                        variant={selectedAnswer === index ? 'default' : 'outline'}
                        className="w-full mb-2"
                        onClick={() => setSelectedAnswer(index)}
                    >
                        {option}
                    </Button>
                ))}
            </CardContent>
            <CardFooter>
                <Button onClick={handleSubmit} disabled={selectedAnswer === null}>Submit</Button>
            </CardFooter>
        </Card>
    )
}

const SortableCodeGame = ({ game, onComplete }) => {
    const [items, setItems] = useState(game.codeBlocks)
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = (event) => {
        const { active, over } = event

        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.indexOf(active.id)
                const newIndex = items.indexOf(over.id)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    const handleSubmit = () => {
        const isCorrect = JSON.stringify(items) === JSON.stringify(game.codeBlocks)
        onComplete(isCorrect)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{game.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-4">Arrange the code blocks in the correct order:</p>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={items} strategy={verticalListSortingStrategy}>
                        {items.map((item) => (
                            <SortableItem key={item} id={item}>
                                <div className="bg-secondary p-2 mb-2 rounded cursor-move">{item}</div>
                            </SortableItem>
                        ))}
                    </SortableContext>
                </DndContext>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSubmit}>Submit</Button>
            </CardFooter>
        </Card>
    )
}

const TagMatcherGame = ({ game, onComplete }) => {
    const [matchedPairs, setMatchedPairs] = useState([])
    const [selectedTag, setSelectedTag] = useState(null)

    const handleTagClick = (tag) => {
        if (!selectedTag) {
            setSelectedTag(tag)
        } else {
            if (tag === selectedTag.replace('<', '</') || tag.replace('<', '</') === selectedTag) {
                setMatchedPairs([...matchedPairs, [selectedTag, tag]])
            }
            else{
                alert("Incorrect match")
            }
            setSelectedTag(null)
        }
    }

    const handleSubmit = () => {
        const isCorrect = matchedPairs.length === game.tags.length / 2
        onComplete(isCorrect)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{game.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-4">Match the opening and closing HTML tags:</p>
                <div className="grid grid-cols-2 gap-2">
                    {game.tags.map((tag, index) => (
                        <Button
                            key={index}
                            variant={selectedTag === tag ? 'default' : 'outline'}
                            className={matchedPairs.flat().includes(tag) ? 'opacity-50' : ''}
                            onClick={() => handleTagClick(tag)}
                            disabled={matchedPairs.flat().includes(tag)}
                        >
                            {tag}
                        </Button>
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSubmit} disabled={matchedPairs.length !== game.tags.length / 2}>Submit</Button>
            </CardFooter>
        </Card>
    )
}

const SortableItem = ({ id, children }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    )
}