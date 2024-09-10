"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, UserPlus, Users, X } from "lucide-react";

interface Mentor {
    id: string;
    name: string;
}

interface Student {
    id: string;
    name: string;
    dob: string;
}

export default function MentorStudentPage() {
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newStudentName, setNewStudentName] = useState("");
    const [newStudentDob, setNewStudentDob] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchMentors = async () => {
            const mockMentors: Mentor[] = [
                { id: "1", name: "John Doe" },
                { id: "2", name: "Jane Smith" },
                { id: "3", name: "Bob Johnson" },
            ];
            setMentors(mockMentors);
        };

        fetchMentors();
    }, []);

    useEffect(() => {
        const fetchStudents = async () => {
            if (selectedMentor) {
                const mockStudents: Student[] = [
                    { id: "1", name: "Alice Brown", dob: "2000-05-15" },
                    { id: "2", name: "Charlie Davis", dob: "2001-09-22" },
                    { id: "3", name: "Eva Green", dob: "1999-12-03" },
                ];
                setStudents(mockStudents);
            } else {
                setStudents([]);
            }
        };

        fetchStudents();
    }, [selectedMentor]);

    const handleAddStudent = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!newStudentName || !newStudentDob) {
            setError("Please fill in all fields");
            return;
        }

        // Here you would typically make an API call to add the student
        const newStudent: Student = {
            id: (students.length + 1).toString(),
            name: newStudentName,
            dob: newStudentDob,
        };

        setStudents([...students, newStudent]);
        setNewStudentName("");
        setNewStudentDob("");
        setShowAddForm(false);
        setSuccess("Student added successfully");

        // In a real application, you'd make an API call here
        console.log("New student added:", {
            ...newStudent,
            mentorId: selectedMentor?.id,
        });
    };

    return (
        <div className="flex flex-col sm:flex-row h-screen">
            {/* Sidebar */}
            <Card className="w-full sm:w-64 h-1/3 sm:h-full overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center">
                        <Users className="mr-2" />
                        Mentors
                    </CardTitle>
                </CardHeader>
                <ScrollArea className="h-[calc(100%-5rem)]">
                    <CardContent>
                        {mentors.map((mentor) => (
                            <div key={mentor.id} className="mb-2">
                                <Button
                                    variant={
                                        selectedMentor?.id === mentor.id
                                            ? "secondary"
                                            : "ghost"
                                    }
                                    className="w-full justify-start"
                                    onClick={() => setSelectedMentor(mentor)}
                                >
                                    {mentor.name}
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </ScrollArea>
            </Card>

            {/* Main Content */}
            <div className="flex-1 p-4 overflow-auto">
                {selectedMentor ? (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">
                                {selectedMentor.name}&apos;s Students
                            </h2>
                            <Button onClick={() => setShowAddForm(true)}>
                                <UserPlus className="mr-2" />
                                Add Student
                            </Button>
                        </div>
                        {showAddForm && (
                            <Card className="mb-4">
                                <CardHeader>
                                    <CardTitle className="text-xl flex items-center justify-between">
                                        Add New Student
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                setShowAddForm(false)
                                            }
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form
                                        onSubmit={handleAddStudent}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-2">
                                            <Label htmlFor="name">
                                                Full Name
                                            </Label>
                                            <Input
                                                id="name"
                                                value={newStudentName}
                                                onChange={(e) =>
                                                    setNewStudentName(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Enter student's full name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="dob">
                                                Date of Birth
                                            </Label>
                                            <Input
                                                id="dob"
                                                type="date"
                                                value={newStudentDob}
                                                onChange={(e) =>
                                                    setNewStudentDob(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            className="w-full"
                                        >
                                            Add Student
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        )}
                        {error && (
                            <div className="flex items-center space-x-2 text-red-600 mb-4">
                                <AlertCircle size={16} />
                                <span className="text-sm">{error}</span>
                            </div>
                        )}
                        {success && (
                            <div className="flex items-center space-x-2 text-green-600 mb-4">
                                <CheckCircle2 size={16} />
                                <span className="text-sm">{success}</span>
                            </div>
                        )}
                        <Card>
                            <CardContent className="p-0">
                                {students.length > 0 ? (
                                    <ul>
                                        {students.map((student, index) => (
                                            <li key={student.id}>
                                                <div className="flex justify-between items-center p-4">
                                                    <div>
                                                        <h3 className="font-semibold">
                                                            {student.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            DOB: {student.dob}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        View Details
                                                    </Button>
                                                </div>
                                                {index <
                                                    students.length - 1 && (
                                                    <Separator />
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="p-4 text-center text-gray-500">
                                        No students assigned yet.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-xl text-gray-500">
                            Select a mentor to view their students
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
