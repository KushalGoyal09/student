import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRecoilValue } from "recoil";
import existingStudents from "@/recoil/existingStudents";
import { Button } from "@/components/ui/button";

export default function ExistingStudents() {
    const students = useRecoilValue(existingStudents);
    const navigate = useNavigate();

    const openWhatsApp = (whatsappLink: string) => {
        window.open(whatsappLink, "_blank");
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 md:p-8">
            <h1 className="text-2xl font-bold mb-6 text-center">
                Student List
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.map((student) => (
                    <Card
                        key={student.id}
                        className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
                    >
                        <CardContent
                            className="p-4"
                            onClick={() => navigate(`/profile/${student.id}`)}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h2 className="font-semibold text-lg">
                                        {student.name}
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        {student.class}
                                    </p>
                                </div>
                                <Badge
                                    variant={
                                        student.status
                                            ? "default"
                                            : "destructive"
                                    }
                                >
                                    {student.status ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <strong>Platform:</strong>{" "}
                                    {student.platform}
                                </div>
                                <div>
                                    <strong>Dropper Status:</strong>{" "}
                                    {student.dropperStatus}
                                </div>
                                <div>
                                    <strong>Previous Score:</strong>{" "}
                                    {student.previousScore}
                                </div>
                                <div className="flex items-center cursor-pointer hover:text-primary">
                                    <span>{student.whattsapNumber}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            {student.whattsapGroupLink && (
                                <Button
                                    className="bg-green-500 mt-2"
                                    onClick={() => {
                                        const whatsappLink =
                                            student.whattsapGroupLink;
                                        if (whatsappLink)
                                            openWhatsApp(whatsappLink);
                                    }}
                                >
                                    Open Whattsap
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
