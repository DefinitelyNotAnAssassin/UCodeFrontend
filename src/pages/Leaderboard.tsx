'use client'

import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpDown, Trophy } from 'lucide-react'
import { BASE_URL } from '@/utils/UrlConstant'
import axios from "@/utils/AuthAxios"
import Navbar from '@/components/navbar'

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([])
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    axios.get(`${BASE_URL}/API/getLeaderboard`)
      .then(response => {
        setLeaderboardData(response.data)
      })
      .catch(err => {
        console.error(err)
      })
  }, [])

  const handleSort = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc'
    setSortOrder(newSortOrder)
    const sortedData = [...leaderboardData].sort((a, b) => 
      newSortOrder === 'asc' ? a.points - b.points : b.points - a.points
    )
    setLeaderboardData(sortedData)
  }

  const getRowStyle = (index: number) => {
    if (index === 0) return 'bg-yellow-100 dark:bg-yellow-900'
    if (index === 1) return 'bg-gray-100 dark:bg-gray-800'
    if (index === 2) return 'bg-orange-100 dark:bg-orange-900'
    return ''
  }

  return (
    <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
      <Card className = "min-h-screen">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center justify-center">
            <Trophy className="mr-2" /> UCode Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end items-center mb-4">
            <Button onClick={handleSort} className="w-full sm:w-auto">
              Sort by Points <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Rank</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardData.map((user, index) => (
                  <TableRow key={user.id} className={getRowStyle(index)}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{user.user}</TableCell>
                    <TableCell className="text-right">{user.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>  
    </>
  
  )
}