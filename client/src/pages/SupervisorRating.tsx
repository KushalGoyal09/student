import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type Mentor = {
  id: string
  name: string
}

export default function MentorRatingPage() {
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [selectedMentor, setSelectedMentor] = useState<string>('')
  const [ratings, setRatings] = useState({
    status: 0,
    meeting: 0,
    calling: 0,
    responsibility: 0,
    availability: 0,
    targetAssigning: 0,
    targetChecking: 0
  })

  useEffect(() => {
    // Fetch mentors from backend API
    const fetchMentors = async () => {
      try {
        const response = await fetch('/api/mentors')
        const data = await response.json()
        setMentors(data)
      } catch (error) {
        console.error('Error fetching mentors:', error)
      }
    }

    // fetchMentors()
  }, [])

  const handleRatingChange = (parameter: string, value: number[]) => {
    setRatings(prev => ({ ...prev, [parameter]: value[0] }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    // Implement your submit logic here
    console.log('Submitted ratings:', { mentorId: selectedMentor, ...ratings })
    // You would typically send this data to your backend API
  }

  return (
    <div className="container mx-auto p-4 w-3/4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>Rate Mentor Performance</CardTitle>
          <CardDescription>Select a mentor and provide ratings for various parameters.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Select onValueChange={setSelectedMentor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a mentor" />
                </SelectTrigger>
                <SelectContent>
                  {mentors.map((mentor) => (
                    <SelectItem key={mentor.id} value={mentor.id}>{mentor.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {Object.entries(ratings).map(([parameter, value]) => (
                <div key={parameter} className="space-y-2">
                  <label htmlFor={parameter} className="block text-sm font-medium text-gray-700 capitalize">
                    {parameter.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <Slider
                    id={parameter}
                    min={0}
                    max={5}
                    step={1}
                    value={[value]}
                    onValueChange={(newValue) => handleRatingChange(parameter, newValue)}
                  />
                  <span className="text-sm text-gray-500">{value}</span>
                </div>
              ))}
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" onClick={handleSubmit}>Submit Ratings</Button>
        </CardFooter>
      </Card>
    </div>
  )
}