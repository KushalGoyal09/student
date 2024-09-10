"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface Mentor {
    id: string;
    name: string;
}

export default function AddStudentPage() {
    const [name, setName] = useState("");
    const [dob, setDob] = useState("");
    const [mentorId, setMentorId] = useState("");
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        // Simulating fetching mentors from the backend
        const fetchMentors = async () => {
            // In a real application, this would be an API call
            const mockMentors: Mentor[] = [
                { id: "1", name: "John Doe" },
                { id: "2", name: "Jane Smith" },
                { id: "3", name: "Bob Johnson" },
            ];
            setMentors(mockMentors);
        };

        fetchMentors();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Basic form validation
        if (!name || !dob || !mentorId) {
            setError("Please fill in all fields");
            return;
        }

        // Here you would typically make an API call to add the student
        // For this example, we'll just log the data
        console.log("New student added:", { name, dob, mentorId });

        // Clear form and show success message
        setName("");
        setDob("");
        setMentorId("");
        setSuccess("Student added successfully");
    };

    return (
        <div className="container mx-auto p-4">
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">Add New Student</CardTitle>
                    <CardDescription>
                        Enter the details of the new student
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter student's full name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dob">Date of Birth</Label>
                            <Input
                                id="dob"
                                type="date"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mentor">Mentor</Label>
                            <Select
                                value={mentorId}
                                onValueChange={setMentorId}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a mentor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mentors.map((mentor) => (
                                        <SelectItem
                                            key={mentor.id}
                                            value={mentor.id}
                                        >
                                            {mentor.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {error && (
                            <div className="flex items-center space-x-2 text-red-600">
                                <AlertCircle size={16} />
                                <span className="text-sm">{error}</span>
                            </div>
                        )}
                        {success && (
                            <div className="flex items-center space-x-2 text-green-600">
                                <CheckCircle2 size={16} />
                                <span className="text-sm">{success}</span>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">
                            Add Student
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
