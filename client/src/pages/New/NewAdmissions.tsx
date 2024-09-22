import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";

interface Student {
    id: string;
    name: string;
    callNumber: string;
    createdAt: string;
}

const NewAdmissions = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const { data } = await axios.get("/api/new/students", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setStudents(data.data);
            } catch (error) {
                setError("Error fetching students. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                Loading...
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4 max-w-md">
            <h1 className="text-2xl font-bold mb-4 text-center">
                Student List
            </h1>
            <ScrollArea className="h-[calc(100vh-120px)]">
                <div className="space-y-4">
                    {students.map((student) => (
                        <Card
                            key={student.id}
                            className="hover:shadow-md transition-shadow"
                        >
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    {student.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Call Number: {student.callNumber}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Created:{" "}
                                    {new Date(
                                        student.createdAt,
                                    ).toLocaleDateString()}
                                </p>
                                <Link
                                    to={`/profile/${student.id}`}
                                    className="mt-2 inline-block text-sm text-primary hover:underline"
                                >
                                    View Profile
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

export default NewAdmissions;
