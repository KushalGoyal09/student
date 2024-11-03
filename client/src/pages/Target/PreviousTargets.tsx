import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import axios from "axios"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Loader2 } from "lucide-react"
import syllabusAtom from "@/recoil/syllabus"

type TargetType = "Regular" | "Revision" | "Extra"

interface Target {
  id: string
  completed: boolean
  date: string
  targetType: TargetType
  physics: {
    id: string
    chapterId: number
  }[]
  chemistry: {
    id: string
    chapterId: number
  }[]
  biology: {
    id: string
    chapterId: number
  }[]
}

interface Chapter {
  id: number
  chapterName: string
  createdAt: Date
}

interface Syllabus {
  physics: Chapter[]
  chemistry: Chapter[]
  biology: Chapter[]
}

const getTargets = async (studentId: string, startDate: Date): Promise<Target[]> => {
  const { data } = await axios.post("/api/target/get", {
    studentId,
    fromDate: format(new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    toDate: format(startDate, "yyyy-MM-dd"),
  },{
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
  return data.data
}

const PreviousTargets = ({ studentId, startDate }: { studentId: string; startDate: Date }) => {
  const syllabus: Syllabus = useRecoilValue(syllabusAtom)
  const [targets, setTargets] = useState<Target[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTargets = async () => {
      try {
        const fetchedTargets = await getTargets(studentId, startDate)
        setTargets(fetchedTargets)
      } catch (error) {
        console.error("Error fetching targets:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTargets()
  }, [studentId, startDate])

  const getChapterName = (subject: keyof Syllabus, chapterId: number) => {
    const chapter = syllabus[subject].find((ch) => ch.id === chapterId)
    return chapter ? chapter.chapterName : "Unknown Chapter"
  }

  const renderChapters = (subject: keyof Syllabus, chapters: { id: string; chapterId: number }[]) => {
    return chapters.map((chapter) => (
      <Badge key={chapter.id} variant="outline" className="mr-2 mb-2 bg-white text-pcb">
        {getChapterName(subject, chapter.chapterId)}
      </Badge>
    ))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-pcb" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
        <h1 className="text-pcb font-bold">Previous Targets</h1>
        {targets.length === 0 && <p className="text-black">No targets found</p>}
      {targets.map((target) => (
        <Card key={target.id} className="bg-white border-pcb border-2">
          <CardHeader>
            <CardTitle className="flex justify-between items-center text-pcb">
              <span>{format(new Date(target.date), "MMMM d, yyyy")}</span>
              <Badge
                variant={target.completed ? "default" : "destructive"}
                className={target.completed ? "bg-pcb text-white" : "bg-red-500 text-white"}
              >
                {target.completed ? "Completed" : "Incomplete"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="physics">
                <AccordionTrigger className="text-pcb">Physics</AccordionTrigger>
                <AccordionContent>{renderChapters("physics", target.physics)}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="chemistry">
                <AccordionTrigger className="text-pcb">Chemistry</AccordionTrigger>
                <AccordionContent>{renderChapters("chemistry", target.chemistry)}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="biology">
                <AccordionTrigger className="text-pcb">Biology</AccordionTrigger>
                <AccordionContent>{renderChapters("biology", target.biology)}</AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default PreviousTargets