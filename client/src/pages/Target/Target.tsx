import { useState, useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Plus, CalendarIcon } from "lucide-react";
import { useRecoilValue } from "recoil";
import existingStudents from "@/recoil/existingStudents";
import syllabusAtom from "@/recoil/syllabus";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PreviewModal from "./Preview";

interface SubjectTarget {
    chapterId: number;
}

interface DayTarget {
    date: string;
    targetType: "Regular" | "Revision" | "Extra";
    physics: SubjectTarget[];
    chemistry: SubjectTarget[];
    biology: SubjectTarget[];
}

type TargetType = "Regular" | "Revision" | "Extra";
type Subject = "physics" | "chemistry" | "biology";

export default function TargetAssignment() {
    const students = useRecoilValue(existingStudents);
    const syllabus = useRecoilValue(syllabusAtom);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<string>("");
    const [dates, setDates] = useState<string[]>([]);
    const [targets, setTargets] = useState<DayTarget[]>([]);
    const [includeCommonSteps, setIncludeCommonSteps] = useState(false);
    const [specialNote, setSpecialNote] = useState("");
    const [includeSpecialNote, setIncludeSpecialNote] = useState(false);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [selectedChapters, setSelectedChapters] = useState<{
        [key in TargetType]: {
            [key in Subject]: number[];
        };
    }>({
        Regular: {
            physics: [0, 0, 0],
            chemistry: [0, 0, 0],
            biology: [0, 0, 0],
        },
        Revision: {
            physics: [0, 0, 0],
            chemistry: [0, 0, 0],
            biology: [0, 0, 0],
        },
        Extra: {
            physics: [0, 0, 0],
            chemistry: [0, 0, 0],
            biology: [0, 0, 0],
        },
    });

    useEffect(() => {
        const initialDates = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            return date.toISOString().split("T")[0];
        });
        setDates(initialDates);
    }, [startDate]);

    const addDay = () => {
        const lastDate = new Date(dates[dates.length - 1]);
        lastDate.setDate(lastDate.getDate() + 1);
        setDates([...dates, lastDate.toISOString().split("T")[0]]);
    };

    const handleTargetChange = (
        date: string,
        targetType: TargetType,
        subject: Subject,
        columnIndex: number,
        checked: boolean,
    ) => {
        const chapterId = selectedChapters[targetType][subject][columnIndex];
        if (chapterId === 0) return; 

        setTargets((prevTargets) => {
            const targetIndex = prevTargets.findIndex(
                (t) => t.date === date && t.targetType === targetType,
            );
            if (targetIndex === -1) {
                return [
                    ...prevTargets,
                    {
                        date,
                        targetType,
                        physics: subject === "physics" ? [{ chapterId }] : [],
                        chemistry: subject === "chemistry" ? [{ chapterId }] : [],
                        biology: subject === "biology" ? [{ chapterId }] : [],
                    },
                ];
            } else {
                const updatedTargets = [...prevTargets];
                if (checked) {
                    updatedTargets[targetIndex][subject].push({ chapterId });
                } else {
                    updatedTargets[targetIndex][subject] = updatedTargets[targetIndex][subject].filter(
                        (t) => t.chapterId !== chapterId
                    );
                }
                return updatedTargets;
            }
        });
    };

    const handleChapterSelect = (targetType: TargetType, subject: Subject, columnIndex: number, chapterId: number) => {
        setSelectedChapters((prev) => ({
            ...prev,
            [targetType]: {
                ...prev[targetType],
                [subject]: prev[targetType][subject].map((id, index) => (index === columnIndex ? chapterId : id)),
            },
        }));
    };

    const handlePreview = () => {
        console.log(targets);
        setIsPreviewOpen(true);
    };

    const renderSubjectTable = (
        targetType: TargetType,
        subject: Subject,
    ) => (
        <Card className="mt-4 bg-white shadow-md">
            <CardHeader className="bg-pcb/10">
                <CardTitle className="text-pcb">
                    {subject.charAt(0).toUpperCase() + subject.slice(1)}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-pcb/20">
                                <th className="p-4 text-pcb">Date</th>
                                {[0, 1, 2].map((_, index) => (
                                    <th key={index} className="p-2">
                                        <Select
                                            onValueChange={(value) => handleChapterSelect(targetType, subject, index, Number(value))}
                                            value={selectedChapters[targetType][subject][index].toString()}
                                        >
                                            <SelectTrigger className="border-pcb/30 text-pcb">
                                                <SelectValue placeholder={"Select chapter"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {syllabus[subject].map((chapter) => (
                                                    <SelectItem
                                                        key={chapter.id}
                                                        value={chapter.id.toString()}
                                                    >
                                                        {chapter.chapterName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {dates.map((date) => (
                                <tr key={date} className="border-b border-pcb/10">
                                    <td className="p-2 text-pcb text-center">
                                        {format(new Date(date), "MMM dd")}
                                    </td>
                                    {[0, 1, 2].map((_, index) => (
                                        <td key={`${date}-${index}`} className="p-2 text-center">
                                            <Checkbox
                                                className="border-pcb/30 text-pcb"
                                                onCheckedChange={(checked) =>
                                                    handleTargetChange(
                                                        date,
                                                        targetType,
                                                        subject,
                                                        index,
                                                        checked as boolean,
                                                    )
                                                }
                                                disabled={selectedChapters[targetType][subject][index] === 0}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );

    const renderTargetSection = (targetType: TargetType) => (
        <Card className="mt-8 bg-white shadow-md">
            <CardHeader className="bg-pcb/10">
                <CardTitle className="text-pcb">{targetType} Targets</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="physics" className="w-full">
                    <TabsList className="bg-pcb/5 flex justify-evenly">
                        <TabsTrigger
                            value="physics"
                            className="data-[state=active]:bg-pcb data-[state=active]:text-white w-full"
                        >
                            Physics
                        </TabsTrigger>
                        <TabsTrigger
                            value="chemistry"
                            className="data-[state=active]:bg-pcb data-[state=active]:text-white w-full"
                        >
                            Chemistry
                        </TabsTrigger>
                        <TabsTrigger
                            value="biology"
                            className="data-[state=active]:bg-pcb data-[state=active]:text-white w-full"
                        >
                            Biology
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="physics">
                        {renderSubjectTable(targetType, "physics")}
                    </TabsContent>
                    <TabsContent value="chemistry">
                        {renderSubjectTable(targetType, "chemistry")}
                    </TabsContent>
                    <TabsContent value="biology">
                        {renderSubjectTable(targetType, "biology")}
                    </TabsContent>
                </Tabs>
                <Button
                    onClick={addDay}
                    className="mt-4 bg-pcb text-white hover:bg-pcb/90"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Day
                </Button>
            </CardContent>
        </Card>
    );

    return (
        <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-pcb">
                Target Assignment
            </h1>

            <Card className="mb-6 bg-white shadow-md">
                <CardContent className="p-4">
                    <div className="mb-4">
                        <Label htmlFor="student-select" className="text-pcb">
                            Select Junior
                        </Label>
                        <Select
                            onValueChange={setSelectedStudent}
                            value={selectedStudent}
                        >
                            <SelectTrigger
                                id="student-select"
                                className="border-pcb/30 text-pcb"
                            >
                                <SelectValue placeholder="Select a student" />
                            </SelectTrigger>
                            <SelectContent>
                                {students.map((student) => (
                                    <SelectItem
                                        key={student.id}
                                        value={student.id}
                                    >
                                        {student.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="text-pcb">Start Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal border-pcb/30 text-pcb"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {startDate ? (
                                        format(startDate, "PPP")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-white">
                                <Calendar
                                    mode="single"
                                    selected={startDate}
                                    onSelect={(date) =>
                                        date && setStartDate(date)
                                    }
                                    initialFocus
                                    className="border-pcb/10"
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </CardContent>
            </Card>

            {renderTargetSection("Regular")}
            {renderTargetSection("Revision")}
            {renderTargetSection("Extra")}

            <Card className="mt-8 bg-white shadow-md">
                <CardContent className="p-4">
                    <div className="mb-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="include-common-steps"
                                checked={includeCommonSteps}
                                onCheckedChange={(checked) =>
                                    setIncludeCommonSteps(checked as boolean)
                                }
                                className="border-pcb/30 text-pcb"
                            />
                            <Label
                                htmlFor="include-common-steps"
                                className="text-pcb"
                            >
                                Include common steps
                            </Label>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <Checkbox
                                id="include-special-note"
                                checked={includeSpecialNote}
                                onCheckedChange={(checked) =>
                                    setIncludeSpecialNote(checked as boolean)
                                }
                                className="border-pcb/30 text-pcb"
                            />
                            <Label
                                htmlFor="include-special-note"
                                className="text-pcb"
                            >
                                Include special note
                            </Label>
                        </div>
                        {includeSpecialNote && (
                            <Textarea
                                placeholder="Enter special note"
                                value={specialNote}
                                onChange={(e) => setSpecialNote(e.target.value)}
                                className="border-pcb/30 text-pcb placeholder-pcb/50"
                            />
                        )}
                    </div>

                    <Button
                        onClick={handlePreview}
                        className="w-full bg-pcb text-white hover:bg-pcb/90"
                    >
                        Preview
                    </Button>
                </CardContent>
            </Card>
            <PreviewModal
                isOpen={isPreviewOpen}
                
                onClose={() => setIsPreviewOpen(false)}
                onEdit={() => setIsPreviewOpen(false)}
                data={{
                    studentId: selectedStudent,
                    studentName:
                        students.find((s) => s.id === selectedStudent)?.name ||
                        "",
                    targets: {
                        regular: targets.filter(
                            (t) => t.targetType === "Regular",
                        ),
                        revision: targets.filter(
                            (t) => t.targetType === "Revision",
                        ),
                        extra: targets.filter((t) => t.targetType === "Extra"),
                    },
                    includeCommonSteps,
                    specialNote: includeSpecialNote ? specialNote : null,
                    whatsappGroupLink:
                        students.find((s) => s.id === selectedStudent)
                            ?.whattsapGroupLink || null,
                }}
            />
        </div>
    );
}