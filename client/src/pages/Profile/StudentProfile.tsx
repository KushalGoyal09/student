import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { motion } from "framer-motion"

type StudentProps = {
  id: string
  name: string
  gender: string
  fatherName: string
  motherName: string
  whattsapNumber: string
  callNumber: string
  motherNumber: string
  fatherNumber: string
  language: string
  target: string
  StudyHours: number
  class: string
  dropperStatus: string
  previousScore: string
  platform: string
  expectation: string
  createdAt: Date
}

export default function Component({ initialStudent }: { initialStudent: StudentProps }) {
  const [student, setStudent] = useState<StudentProps>(initialStudent)
  const [isEditing, setIsEditing] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setStudent(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/updateStudent', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(student),
      })
      if (response.ok) {
        setIsEditing(false)
        // You might want to show a success message here
      } else {
        // Handle error
        console.error('Failed to update student')
      }
    } catch (error) {
      console.error('Error updating student:', error)
    }
  }

  return (
    <div className="container mx-auto p-4 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-4xl mx-auto shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold text-center">Student Profile</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <InfoItem label="Name" value={student.name} />
              <InfoItem label="Gender" value={student.gender} />
              <InfoItem label="Father's Name" value={student.fatherName} />
              <InfoItem label="Mother's Name" value={student.motherName} />
              <InfoItem label="WhatsApp Number" value={student.whattsapNumber} />
              <InfoItem label="Call Number" value={student.callNumber} />
              <InfoItem label="Mother's Number" value={student.motherNumber} />
              <InfoItem label="Father's Number" value={student.fatherNumber} />
              <InfoItem label="Language" value={student.language} />
              <InfoItem label="Target" value={student.target} />
              <InfoItem label="Study Hours" value={student.StudyHours.toString()} />
              <InfoItem label="Class" value={student.class} />
              <InfoItem label="Dropper Status" value={student.dropperStatus} />
              <InfoItem label="Previous Score" value={student.previousScore} />
              <InfoItem label="Platform" value={student.platform} />
              <InfoItem label="Expectation" value={student.expectation} />
            </div>
            <div className="flex justify-center mt-4">
              <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105">
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Student Profile</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    {Object.entries(student).map(([key, value]) => (
                      key !== 'id' && key !== 'createdAt' && (
                        <div key={key} className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor={key} className="text-right">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </Label>
                          <Input
                            id={key}
                            name={key}
                            value={value}
                            onChange={handleInputChange}
                            className="col-span-3"
                          />
                        </div>
                      )
                    ))}
                    <Button type="submit" className="mt-4">Save changes</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      className="space-y-1 bg-white p-3 rounded-lg shadow"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Label className="text-sm font-medium text-blue-600">{label}</Label>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </motion.div>
  )
}