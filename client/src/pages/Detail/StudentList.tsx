import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle, ExternalLink } from "lucide-react";
import axios from "axios";

interface Student {
    id: string;
    name: string;
    status: boolean;
    whattsapNumber: string;
    class: string;
    platform: string;
}

export default function Component() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const { data } = await axios.get("/api/detail/students", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setStudents(data.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching students:", error);
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const openWhatsApp = (number: string) => {
        window.open(`https://wa.me/${number.replace(/\D/g, "")}`, "_blank");
    };

    if (loading) {
        return (
            <div className="p-4 space-y-4">
                {[...Array(5)].map((_, index) => (
                    <Card key={index}>
                        <CardContent className="p-4">
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold mb-4">Student List</h1>
            {students.map((student) => (
                <Card
                    key={student.id}
                    className="hover:shadow-md transition-shadow"
                >
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="font-semibold">
                                    {student.name}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    {student.class}
                                </p>
                            </div>
                            <Badge
                                variant={
                                    student.status ? "default" : "destructive"
                                }
                            >
                                {student.status ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                        <div className="mt-2 text-sm flex items-center">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="mr-2"
                                onClick={() =>
                                    openWhatsApp(student.whattsapNumber)
                                }
                            >
                                <MessageCircle className="h-4 w-4" />
                            </Button>
                            <span>{student.whattsapNumber}</span>
                        </div>
                        <p className="text-sm">Platform: {student.platform}</p>
                        <div className="mt-4 flex justify-between items-center">
                            <Link to={`/profile/${student.id}`}>
                                <Button variant="outline">
                                    View Profile
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
