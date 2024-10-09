import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRecoilValue } from "recoil";
import newStudents from "@/recoil/newStudents";
import { Phone, Calendar, Eye } from "lucide-react";

interface Student {
    id: string;
    name: string;
    callNumber: string;
    dropperStatus: string;
    previousScore: string;
    platform: string;
    createdAt: Date;
}

export default function NewAdmissions() {
    const students: Student[] = useRecoilValue(newStudents);
    const navigate = useNavigate();

    return (
        <div className="container mx-auto p-4 sm:p-6 md:p-8">
            <h1 className="text-2xl font-bold mb-6 text-center">
                New Admissions
            </h1>
            <ScrollArea className="h-[calc(100vh-160px)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {students.map((student) => (
                        <Card
                            key={student.id}
                            className="hover:shadow-lg transition-shadow duration-300"
                            onClick={() => navigate(`/profile/${student.id}`)}
                        >
                            <CardContent className="p-4">
                                <h2 className="font-semibold text-lg mb-2">
                                    {student.name}
                                </h2>
                                <div className="grid grid-cols-1 gap-2 text-sm">
                                    <div className="flex items-center">
                                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span>{student.callNumber}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span>
                                            {new Date(
                                                student.createdAt,
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div>
                                        <strong>Dropper Status:</strong>{" "}
                                        {student.dropperStatus}
                                    </div>
                                    <div>
                                        <strong>Previous Score:</strong>{" "}
                                        {student.previousScore}
                                    </div>
                                    <div>
                                        <strong>Platform:</strong>{" "}
                                        {student.platform}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
